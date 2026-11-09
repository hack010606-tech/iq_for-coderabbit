const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

function sanitizeEndpoint(endpoint) {
  if (
    typeof endpoint !== 'string' ||
    !endpoint.startsWith('/') ||
    endpoint.startsWith('//') ||
    endpoint.includes('://')
  ) {
    throw new Error('Invalid API endpoint: must be a relative path starting with /');
  }
  return endpoint;
}

/**
 * Access and refresh tokens are stashed in sessionStorage on first entry from
 * the dashboard's URL fragment. That keeps them out of browser history, and
 * clearing the fragment once read means a casual shoulder-surf reveals nothing.
 */
export function getToken() {
  return sessionStorage.getItem('exam_token');
}

export function setToken(token) {
  sessionStorage.setItem('exam_token', token);
}

export function getRefreshToken() {
  return sessionStorage.getItem('exam_refresh_token');
}

export function setRefreshToken(token) {
  sessionStorage.setItem('exam_refresh_token', token);
}

export function clearToken() {
  sessionStorage.removeItem('exam_token');
  sessionStorage.removeItem('exam_refresh_token');
}

/**
 * Returns the configured portal base URL to redirect students back to.
 * Checks for a URL passed via launch param/hash, then sessionStorage, then env var, falling back to window origin.
 */
export function getPortalUrl() {
  const fromStorage = sessionStorage.getItem('exam_portal_url');
  if (fromStorage && typeof fromStorage === 'string' && fromStorage.startsWith('http')) {
    return fromStorage;
  }
  const fromEnv = import.meta.env.VITE_PORTAL_URL;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.startsWith('http')) {
    return fromEnv;
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin + '/student';
  }
  return 'http://localhost:5173/student';
}

/**
 * Pull tokens from `#token=...&refresh=...` on the current location, store
 * them, and scrub the fragment from the address bar so it does not persist.
 */
export function captureTokenFromUrl() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const token = params.get('token');
  const refresh = params.get('refresh');
  const portal = params.get('portal');

  if (portal) {
    sessionStorage.setItem('exam_portal_url', portal);
  }

  if (token) {
    setToken(token);
    if (refresh) setRefreshToken(refresh);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    return token;
  }

  return null;
}

let refreshPromise = null;

/** Single in-flight refresh so concurrent requests do not stampede the auth endpoint. */
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refresh }),
        });
        if (!res.ok) {
          clearToken();
          return null;
        }

        const data = await res.json();
        if (data.accessToken) setToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        return data.accessToken || null;
      } catch {
        return null;
      } finally {
        // Release the lock on the next tick so waiters read the stored token.
        setTimeout(() => { refreshPromise = null; }, 0);
      }
    })();
  }

  return refreshPromise;
}

export class ExamApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const apiClient = {
  baseURL: BASE_URL,

  async request(endpoint, method = 'GET', body = null, { isRetry = false } = {}) {
    const token = getToken();

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers.Authorization = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);

    const safeEndpoint = sanitizeEndpoint(endpoint);
    const targetUrl = new URL(safeEndpoint.replace(/^\/+/, '/'), this.baseURL).toString();

    const res = await fetch(targetUrl, options);

    if (res.status === 401) {
      // Mid-exam expiry is expected on a long paper — refresh once and retry
      // rather than ending the student's session.
      if (!isRetry) {
        const newToken = await refreshAccessToken();
        if (newToken) return this.request(endpoint, method, body, { isRetry: true });
      }

      clearToken();
      throw new ExamApiError(
        'Your session has expired. Please relaunch the exam from your dashboard.',
        401,
      );
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = Array.isArray(err.message) ? err.message[0] : err.message;
      throw new ExamApiError(message || 'Request failed', res.status);
    }

    return res.status === 204 ? {} : res.json();
  },

  get(endpoint) { return this.request(endpoint); },
  post(endpoint, body) { return this.request(endpoint, 'POST', body); },
  patch(endpoint, body) { return this.request(endpoint, 'PATCH', body); },
};

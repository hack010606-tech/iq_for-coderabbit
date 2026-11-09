const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Access tokens are held in sessionStorage so a tab can use them, but closing
 * the window forgets them; refresh tokens live in localStorage to survive a
 * restart. This mirrors what Supabase's browser client does natively.
 */
export function getToken() {
  return sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
}

export function setToken(token) {
  sessionStorage.setItem('access_token', token);
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function setRefreshToken(token) {
  localStorage.setItem('refresh_token', token);
}

export function clearSession() {
  sessionStorage.removeItem('access_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Trade the stored refresh token for a fresh access token without asking the
 * user to log in again. Returns the new token, or null if the session is gone.
 */
async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.accessToken) setToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return data.accessToken || null;
  } catch {
    return null;
  }
}

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

function buildHeaders(options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Let the browser set the multipart boundary itself.
  if (options.body instanceof FormData) delete headers['Content-Type'];

  return headers;
}

/**
 * fetch wrapper that attaches the bearer token and, on a 401, transparently
 * refreshes the session once before giving up and sending the user to login.
 */
async function fetchClient(endpoint, options = {}, { isRetry = false } = {}) {
  const safeEndpoint = sanitizeEndpoint(endpoint);
  const targetUrl = new URL(safeEndpoint.replace(/^\/+/, '/'), BASE_URL).toString();

  const response = await fetch(targetUrl, {
    ...options,
    headers: buildHeaders(options),
  });

  const isAuthCall = safeEndpoint.startsWith('/auth/');

  if (response.status === 401 && !isAuthCall && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetchClient(endpoint, options, { isRetry: true });
    }

    clearSession();
    if (window.location.pathname !== '/') window.location.assign('/');
    throw new Error('Your session has expired. Please log in again.');
  }

  if (response.status === 401 && !isAuthCall) {
    clearSession();
    if (window.location.pathname !== '/') window.location.assign('/');
  }

  // 204 and other empty responses have no JSON body.
  const data =
    response.status === 204 ? {} : await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message
      ? Array.isArray(data.message)
        ? data.message[0]
        : data.message
      : `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Unwraps a list response.
 *
 * Collection endpoints are paginated — they answer `{ data, total, page, limit,
 * totalPages }` rather than a bare array, because returning every student or
 * every test in one response stopped being viable at cohort scale. This accepts
 * either shape so a caller that only wants the rows does not have to care.
 */
export function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export const apiClient = {
  get: (endpoint, options) => fetchClient(endpoint, { ...options, method: 'GET' }),

  /** GET that always resolves to an array, paginated envelope or not. */
  getList: async (endpoint, options) =>
    toList(await fetchClient(endpoint, { ...options, method: 'GET' })),

  post: (endpoint, body, options) =>
    fetchClient(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  patch: (endpoint, body, options) =>
    fetchClient(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: (endpoint, options) => fetchClient(endpoint, { ...options, method: 'DELETE' }),

  /** Revokes the session server-side, then clears local state. */
  async logout() {
    try {
      await fetchClient('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch {
      // A failed revoke must never trap the user in the app.
    }
    clearSession();
    window.location.assign('/');
  },
};

/**
 * Mirrors the server's password policy so a weak password is rejected before
 * the round-trip. The server enforces the same rule regardless.
 */
export const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 10 characters and include an uppercase letter, a lowercase letter and a digit.';

export const PASSWORD_RULE_TEXT = PASSWORD_POLICY_MESSAGE;

export function passwordProblem(pwd) {
  if (!pwd || pwd.length < 10) return PASSWORD_POLICY_MESSAGE;
  if (!/[a-z]/.test(pwd) || !/[A-Z]/.test(pwd) || !/\d/.test(pwd)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  return null;
}

export { BASE_URL };

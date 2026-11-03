"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVerificationError = void 0;
exports.verifySupabaseToken = verifySupabaseToken;
const crypto_1 = require("crypto");
const jwt = __importStar(require("jsonwebtoken"));
class TokenVerificationError extends Error {
}
exports.TokenVerificationError = TokenVerificationError;
const ASYMMETRIC_ALGS = ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'EdDSA'];
const CLOCK_TOLERANCE_SECONDS = 5;
const JWKS_TTL_MS = 10 * 60 * 1000;
let jwksKeys = new Map();
let jwksFetchedAt = 0;
let jwksInFlight = null;
async function refreshJwks() {
    if (jwksInFlight)
        return jwksInFlight;
    jwksInFlight = (async () => {
        const baseUrl = process.env.SUPABASE_URL;
        if (!baseUrl)
            throw new TokenVerificationError('SUPABASE_URL is not configured');
        const res = await fetch(`${baseUrl}/auth/v1/.well-known/jwks.json`, {
            headers: process.env.SUPABASE_ANON_KEY
                ? { apikey: process.env.SUPABASE_ANON_KEY }
                : undefined,
        });
        if (!res.ok)
            throw new TokenVerificationError(`JWKS fetch failed (${res.status})`);
        const body = await res.json();
        const next = new Map();
        for (const jwk of body?.keys ?? []) {
            if (!jwk?.kid)
                continue;
            try {
                next.set(jwk.kid, (0, crypto_1.createPublicKey)({ key: jwk, format: 'jwk' }));
            }
            catch {
            }
        }
        jwksKeys = next;
        jwksFetchedAt = Date.now();
    })().finally(() => {
        jwksInFlight = null;
    });
    return jwksInFlight;
}
async function getSigningKey(kid) {
    const stale = Date.now() - jwksFetchedAt > JWKS_TTL_MS;
    if (jwksKeys.size === 0 || stale)
        await refreshJwks().catch(() => undefined);
    if (jwksKeys.has(kid))
        return jwksKeys.get(kid);
    if (!stale)
        await refreshJwks().catch(() => undefined);
    return jwksKeys.get(kid) ?? null;
}
function toIdentity(payload) {
    if (!payload?.sub)
        throw new TokenVerificationError('Token has no subject');
    return { userId: payload.sub, email: payload.email ?? '' };
}
async function verifyRemotely(token) {
    const baseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!baseUrl || !anonKey)
        throw new TokenVerificationError('Cannot verify token');
    const res = await fetch(`${baseUrl}/auth/v1/user`, {
        headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
    });
    if (!res.ok)
        throw new TokenVerificationError('Token rejected by Supabase Auth');
    const user = await res.json();
    if (!user?.id)
        throw new TokenVerificationError('Token rejected by Supabase Auth');
    return { userId: user.id, email: user.email ?? '' };
}
async function verifySupabaseToken(rawToken) {
    const token = (rawToken ?? '').replace(/^Bearer\s+/i, '').trim();
    if (!token)
        throw new TokenVerificationError('Missing token');
    let header;
    try {
        header = jwt.decode(token, { complete: true })?.header;
    }
    catch {
        throw new TokenVerificationError('Malformed token');
    }
    const alg = header?.alg;
    if (!alg || alg.toLowerCase() === 'none') {
        throw new TokenVerificationError('Token is unsigned');
    }
    try {
        if (alg.startsWith('HS')) {
            const secret = process.env.SUPABASE_JWT_SECRET;
            if (!secret)
                return await verifyRemotely(token);
            return toIdentity(jwt.verify(token, secret, {
                algorithms: [alg],
                clockTolerance: CLOCK_TOLERANCE_SECONDS,
            }));
        }
        if (ASYMMETRIC_ALGS.includes(alg)) {
            const key = header?.kid ? await getSigningKey(header.kid) : null;
            if (!key)
                return await verifyRemotely(token);
            return toIdentity(jwt.verify(token, key, {
                algorithms: ASYMMETRIC_ALGS,
                clockTolerance: CLOCK_TOLERANCE_SECONDS,
            }));
        }
    }
    catch (e) {
        if (e instanceof TokenVerificationError)
            throw e;
        if (e instanceof jwt.TokenExpiredError) {
            throw new TokenVerificationError('Token has expired. Please log in again.');
        }
        throw new TokenVerificationError('Invalid token signature');
    }
    throw new TokenVerificationError(`Unsupported token algorithm: ${alg}`);
}
//# sourceMappingURL=supabase-jwt.js.map
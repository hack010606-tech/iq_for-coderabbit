export interface VerifiedIdentity {
    userId: string;
    email: string;
}
export declare class TokenVerificationError extends Error {
}
export declare function verifySupabaseToken(rawToken: string): Promise<VerifiedIdentity>;

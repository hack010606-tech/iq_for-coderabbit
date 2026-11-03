export declare class RefreshDto {
    refreshToken: string;
}
export declare class LogoutDto {
    refreshToken?: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    accessToken: string;
    newPassword: string;
}

export declare class AuthService {
    private readonly logger;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | undefined;
            full_name: any;
            role: any;
            subject: any;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(accessToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(accessToken: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(userId: string, subject?: string): Promise<{
        subject: string;
        id: any;
        full_name: any;
        email: any;
        role: any;
        created_at: any;
    }>;
}

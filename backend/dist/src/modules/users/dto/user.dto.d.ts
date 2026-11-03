export declare const MIN_PASSWORD_LENGTH = 10;
export declare class UpdateProfileDto {
    full_name: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AdminCreateUserDto {
    full_name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
    subject?: string;
}
export declare class AdminResetPasswordDto {
    newPassword: string;
}
export declare class UserListQueryDto {
    search?: string;
    page?: number;
    limit?: number;
}
export declare class StudentListQueryDto extends UserListQueryDto {
    batchId?: string;
}
export declare class AdminUserListQueryDto extends UserListQueryDto {
    role?: string;
}

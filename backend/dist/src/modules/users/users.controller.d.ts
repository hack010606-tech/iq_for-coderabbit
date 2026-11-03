import { UsersService } from './users.service';
import { AdminCreateUserDto, AdminResetPasswordDto, AdminUserListQueryDto, ChangePasswordDto, StudentListQueryDto, UpdateProfileDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
        id: any;
        full_name: any;
        email: any;
        role: any;
        created_at: any;
    }>;
    updateProfile(user: any, body: UpdateProfileDto): Promise<{
        id: any;
        full_name: any;
        email: any;
        role: any;
    }>;
    updatePassword(user: any, body: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    listStudents(query: StudentListQueryDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStudentProfile(id: string): Promise<{
        recentAttempts: {
            id: any;
            total_score: any;
            status: any;
            started_at: any;
            submitted_at: any;
            tests: {
                title: any;
            }[];
        }[];
        id: any;
        full_name: any;
        email: any;
        role: any;
        created_at: any;
        batch_students: {
            batch_id: any;
            joined_at: any;
            batches: {
                name: any;
                subject_focus: any;
            }[];
        }[];
    }>;
    listTeachers(): Promise<{
        id: any;
        full_name: any;
        email: any;
        role: any;
        created_at: any;
    }[]>;
    listTeacherDirectory(): Promise<{
        id: any;
        full_name: any;
    }[]>;
    listAllUsers(query: AdminUserListQueryDto): Promise<{
        data: {
            id: any;
            full_name: any;
            email: any;
            role: any;
            created_at: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    adminCreateUser(body: AdminCreateUserDto): Promise<{
        id: any;
        full_name: any;
        email: any;
        role: any;
        created_at: any;
    }>;
    adminResetPassword(id: string, body: AdminResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    adminDeleteUser(id: string, user: any): Promise<{
        success: boolean;
    }>;
}

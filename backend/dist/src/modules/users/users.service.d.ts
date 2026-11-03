import { AdminCreateUserDto, AdminUserListQueryDto, ChangePasswordDto, StudentListQueryDto } from './dto/user.dto';
export declare class UsersService {
    private readonly logger;
    getProfile(userId: string): Promise<{
        id: any;
        full_name: any;
        email: any;
        role: any;
        created_at: any;
    }>;
    updateProfile(userId: string, body: {
        full_name: string;
    }): Promise<{
        id: any;
        full_name: any;
        email: any;
        role: any;
    }>;
    updatePassword(userId: string, body: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    listStudents(filters: StudentListQueryDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    private pageAllStudents;
    private pageStudentsInBatch;
    getStudentProfile(studentId: string): Promise<{
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
    listTeachersForStudents(): Promise<{
        id: any;
        full_name: any;
    }[]>;
    listAllUsers(filters: AdminUserListQueryDto): Promise<{
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
    adminResetPassword(userId: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminDeleteUser(userId: string, actingAdminId: string): Promise<{
        success: boolean;
    }>;
    private escapeLike;
    private escapeOrFilter;
}

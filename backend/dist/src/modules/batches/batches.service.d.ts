import { CreateBatchDto, UpdateBatchDto } from './dto/batch.dto';
export interface Requester {
    id: string;
    role?: string;
}
export declare class BatchesService {
    private assertCanManage;
    findAll(user: Requester): Promise<{
        id: any;
        name: any;
        subject_focus: any;
        created_at: any;
        created_by: any;
        batch_students: {
            count: number;
        }[];
    }[]>;
    create(body: CreateBatchDto, user: Requester): Promise<any>;
    findOne(id: string, user: Requester): Promise<{
        id: any;
        name: any;
        subject_focus: any;
        created_at: any;
        batch_students: {
            student_id: any;
            joined_at: any;
            users: {
                id: any;
                full_name: any;
                email: any;
            }[];
        }[];
    }>;
    update(id: string, body: UpdateBatchDto, user: Requester): Promise<any>;
    remove(id: string, user: Requester): Promise<{
        message: string;
    }>;
    getStudents(batchId: string, user: Requester): Promise<any[]>;
    addStudent(batchId: string, studentId: string, user: Requester): Promise<any>;
    removeStudent(batchId: string, studentId: string, user: Requester): Promise<{
        message: string;
    }>;
}

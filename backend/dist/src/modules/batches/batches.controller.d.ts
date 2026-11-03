import { BatchesService } from './batches.service';
import { AddStudentDto, CreateBatchDto, UpdateBatchDto } from './dto/batch.dto';
export declare class BatchesController {
    private readonly batchesService;
    constructor(batchesService: BatchesService);
    findAll(user: any): Promise<{
        id: any;
        name: any;
        subject_focus: any;
        created_at: any;
        created_by: any;
        batch_students: {
            count: number;
        }[];
    }[]>;
    create(body: CreateBatchDto, user: any): Promise<any>;
    findOne(id: string, user: any): Promise<{
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
    update(id: string, body: UpdateBatchDto, user: any): Promise<any>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getStudents(id: string, user: any): Promise<any[]>;
    addStudent(batchId: string, body: AddStudentDto, user: any): Promise<any>;
    removeStudent(batchId: string, studentId: string, user: any): Promise<{
        message: string;
    }>;
}

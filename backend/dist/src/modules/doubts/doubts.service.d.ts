import { CreateDoubtDto } from './dto/doubt.dto';
export interface Requester {
    id: string;
    role?: string;
}
interface DoubtOwnership {
    id: string;
    student_id: string;
    accepted_by: string | null;
    status: string;
}
export declare class DoubtsService {
    private loadOwnership;
    private canRead;
    private canWrite;
    assertCanRead(doubtId: string, user: Requester): Promise<DoubtOwnership>;
    assertCanWrite(doubtId: string, user: Requester): Promise<DoubtOwnership>;
    checkAccess(doubtId: string, user: Requester): Promise<{
        canRead: boolean;
        canWrite: boolean;
    }>;
    create(studentId: string, body: CreateDoubtDto): Promise<any>;
    getMyDoubts(studentId: string, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAll(user: Requester, status?: string, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    private paginate;
    private page;
    findOne(id: string, user: Requester): Promise<{
        id: any;
        status: any;
        created_at: any;
        resolved_at: any;
        student: {
            id: any;
            full_name: any;
            email: any;
        }[];
        questions: {
            id: any;
            question_text: any;
            subject: any;
            topic: any;
            options: any;
            correct_answer: any;
        }[];
        teacher: {
            id: any;
            full_name: any;
        }[];
    }>;
    accept(id: string, user: Requester): Promise<any>;
    resolve(id: string, user: Requester): Promise<any>;
    getMessages(doubtId: string, user: Requester): Promise<{
        id: any;
        message_text: any;
        sent_at: any;
        users: {
            id: any;
            full_name: any;
            role: any;
        }[];
    }[]>;
    sendMessage(doubtId: string, user: Requester, messageText: string): Promise<{
        id: any;
        message_text: any;
        sent_at: any;
        doubt_id: any;
    }>;
    persistMessage(doubtId: string, senderId: string, messageText: string): Promise<{
        id: any;
        message_text: any;
        sent_at: any;
        doubt_id: any;
    }>;
    uploadImage(doubtId: string, user: Requester, file: Express.Multer.File): Promise<{
        imageUrl: string;
        id: any;
        message_text: any;
        sent_at: any;
        doubt_id: any;
    }>;
    remove(doubtId: string, user: Requester): Promise<{
        success: boolean;
    }>;
}
export {};

import { CreateQuestionDto, CsvRowDto, UpdateQuestionDto } from './dto/question.dto';
export interface Requester {
    id: string;
    role?: string;
    subject?: string;
}
export declare class QuestionsService {
    private scopedSubject;
    private assertCanWriteAll;
    private pickWritable;
    findAll(filters: {
        subject?: string;
        difficulty?: string;
        q_type?: string;
        topic?: string;
        search?: string;
        review_status?: string;
        page?: number;
        limit?: number;
        exclude_subjective?: string;
    }, user?: Requester): Promise<{
        data: {
            id: any;
            subject: any;
            topic: any;
            subtopic: any;
            difficulty: any;
            q_type: any;
            question_text: any;
            options: any;
            correct_answer: any;
            marks: any;
            created_at: any;
            image_url: any;
            review_status: any;
            source: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    private escapeLike;
    getReviewQueue(filters: {
        subject?: string;
        page?: number;
        limit?: number;
    }, user?: Requester): Promise<{
        data: {
            id: any;
            subject: any;
            topic: any;
            subtopic: any;
            difficulty: any;
            q_type: any;
            question_text: any;
            options: any;
            correct_answer: any;
            marks: any;
            created_at: any;
            image_url: any;
            review_status: any;
            source: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    findOne(id: string, user?: Requester): Promise<any>;
    create(body: CreateQuestionDto, user: Requester): Promise<any>;
    update(id: string, body: UpdateQuestionDto, user?: Requester): Promise<any>;
    remove(id: string, user?: Requester): Promise<{
        message: string;
    }>;
    duplicate(id: string, user: Requester): Promise<any>;
    approve(id: string, reviewer: Requester, corrections?: UpdateQuestionDto): Promise<any>;
    reject(id: string, reviewer: Requester): Promise<any>;
    bulkApprove(ids: string[], reviewer: Requester): Promise<{
        approved: number;
    }>;
    bulkRemove(ids: string[], user?: Requester): Promise<{
        deleted: number;
    }>;
    deleteImageQuestions(user?: Requester): Promise<{
        deleted: number;
    }>;
    private validateCsvRow;
    parseCSV(fileBuffer: Buffer, maxRows?: number): Promise<any[]>;
    bulkInsert(rows: CsvRowDto[], user: Requester): Promise<{
        inserted: number;
    }>;
}

import { QuestionsService } from './questions.service';
import { PdfProcessorService } from './pdf-processor.service';
import { ApproveQuestionDto, BulkConfirmDto, BulkIdsDto, CreateQuestionDto, PdfUploadDto, QuestionQueryDto, ReviewQueueQueryDto, UpdateQuestionDto } from './dto/question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    private readonly pdfProcessorService;
    constructor(questionsService: QuestionsService, pdfProcessorService: PdfProcessorService);
    findAll(user: any, query: QuestionQueryDto): Promise<{
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
    getReviewQueue(user: any, query: ReviewQueueQueryDto): Promise<{
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
    create(body: CreateQuestionDto, user: any): Promise<any>;
    bulkApprove(body: BulkIdsDto, user: any): Promise<{
        approved: number;
    }>;
    bulkDelete(body: BulkIdsDto, user: any): Promise<{
        deleted: number;
    }>;
    bulkUpload(file: Express.Multer.File): Promise<any[]>;
    bulkConfirm(body: BulkConfirmDto, user: any): Promise<{
        inserted: number;
    }>;
    bulkUploadPdf(file: Express.Multer.File, body: PdfUploadDto, user: any): Promise<{
        success: boolean;
        processed: number;
        inserted: number;
        byType: Record<string, number>;
        runId: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    deleteImageQuestions(user: any): Promise<{
        deleted: number;
    }>;
    findOne(id: string, user: any): Promise<any>;
    update(id: string, body: UpdateQuestionDto, user: any): Promise<any>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    duplicate(id: string, user: any): Promise<any>;
    approve(id: string, body: ApproveQuestionDto, user: any): Promise<any>;
    reject(id: string, user: any): Promise<any>;
}

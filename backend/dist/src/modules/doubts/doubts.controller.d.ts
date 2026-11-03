import { DoubtsService } from './doubts.service';
import { DoubtsGateway } from './doubts.gateway';
import { CreateDoubtDto, DoubtHistoryQueryDto, DoubtQueueQueryDto, SendMessageDto } from './dto/doubt.dto';
export declare class DoubtsController {
    private readonly doubtsService;
    private readonly doubtsGateway;
    constructor(doubtsService: DoubtsService, doubtsGateway: DoubtsGateway);
    create(user: any, body: CreateDoubtDto): Promise<any>;
    getMyDoubts(user: any, query: DoubtHistoryQueryDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAll(user: any, query: DoubtQueueQueryDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, user: any): Promise<{
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
    accept(id: string, user: any): Promise<any>;
    resolve(id: string, user: any): Promise<any>;
    getMessages(id: string, user: any): Promise<{
        id: any;
        message_text: any;
        sent_at: any;
        users: {
            id: any;
            full_name: any;
            role: any;
        }[];
    }[]>;
    sendMessage(id: string, user: any, body: SendMessageDto): Promise<{
        id: any;
        message_text: any;
        sent_at: any;
        doubt_id: any;
    }>;
    uploadImage(id: string, user: any, file: Express.Multer.File): Promise<{
        imageUrl: string;
        id: any;
        message_text: any;
        sent_at: any;
        doubt_id: any;
    }>;
    remove(id: string, user: any): Promise<{
        success: boolean;
    }>;
}

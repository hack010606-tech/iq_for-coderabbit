export declare class DoubtHistoryQueryDto {
    page?: number;
    limit?: number;
}
export declare const MAX_MESSAGE_LENGTH = 4000;
export declare class CreateDoubtDto {
    question_id?: string;
    attempt_id?: string;
    snippet?: string;
    teacher_id?: string;
}
export declare class SendMessageDto {
    message_text: string;
}
export declare class DoubtQueueQueryDto {
    status?: string;
    page?: number;
    limit?: number;
}

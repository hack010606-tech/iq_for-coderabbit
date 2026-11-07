export declare const DIFFICULTIES: readonly ["easy", "medium", "hard"];
export declare const QUESTION_TYPES: readonly ["single_correct", "multi_correct", "numerical", "assertion", "subjective"];
export declare class CreateQuestionDto {
    subject: string;
    topic?: string;
    subtopic?: string;
    question_text: string;
    options?: string[];
    correct_answer: Record<string, any>;
    difficulty?: string;
    q_type?: string;
    marks?: number;
    image_url?: string;
}
declare const UpdateQuestionDto_base: import("@nestjs/common").Type<Partial<CreateQuestionDto>>;
export declare class UpdateQuestionDto extends UpdateQuestionDto_base {
}
export declare class ApproveQuestionDto {
    corrections?: UpdateQuestionDto;
}
export declare const MAX_BULK_IDS = 500;
export declare class BulkIdsDto {
    ids: string[];
}
export declare class CsvRowDto extends CreateQuestionDto {
    valid?: boolean;
    errorMsg?: string | null;
}
export declare const MAX_CSV_ROWS = 2000;
export declare class BulkConfirmDto {
    rows: CsvRowDto[];
}
export declare class QuestionQueryDto {
    subject?: string;
    difficulty?: string;
    q_type?: string;
    topic?: string;
    search?: string;
    review_status?: string;
    exclude_subjective?: string;
    page?: number;
    limit?: number;
}
export declare class ReviewQueueQueryDto {
    subject?: string;
    exclude_subjective?: string;
    page?: number;
    limit?: number;
}
export declare class PdfUploadDto {
    examType?: string;
}
export {};

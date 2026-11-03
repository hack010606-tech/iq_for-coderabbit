export declare const ANSWER_STATUSES: readonly ["not_visited", "not_answered", "answered", "marked", "answered_marked"];
export declare class SaveAnswerDto {
    question_id: string;
    selected_answer?: any;
    status?: string;
    time_spent_seconds: number;
}
export declare class ToggleFlagDto {
    question_id: string;
    flagged: boolean;
}
export declare class LogViolationDto {
    type?: string;
    detail?: string;
}
export declare class SubmitAttemptDto {
    autoSubmitted?: boolean;
}

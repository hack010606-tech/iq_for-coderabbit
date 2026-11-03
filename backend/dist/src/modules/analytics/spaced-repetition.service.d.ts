export declare class SpacedRepetitionService {
    private readonly logger;
    processAttempt(attemptId: string, studentId: string): Promise<void>;
    private loadGradedAnswers;
    private quality;
    private updateSrsState;
    recomputePredictions(studentId: string): Promise<void>;
    getDueQuestions(studentId: string, limit?: number): Promise<{
        question_id: any;
        due_at: any;
        mastery_level: any;
        priority_weight: any;
        questions: {
            id: any;
            subject: any;
            topic: any;
            question_text: any;
            difficulty: any;
            image_url: any;
        }[];
    }[]>;
}

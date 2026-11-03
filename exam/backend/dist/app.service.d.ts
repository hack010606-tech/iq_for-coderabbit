export declare class AppService {
    private readonly logger;
    private supabase;
    constructor();
    private isMissingSchema;
    private assertSchemaPresent;
    private loadOwnedSession;
    private isExpired;
    startSession(examId: string, studentId: string): Promise<{
        sessionId: any;
        startedAt: any;
        endsAt: any;
        resumed: boolean;
        testDetails: {
            id: any;
            title: any;
            duration_minutes: any;
            total_marks: any;
            status: any;
            negative_marking: any;
            negative_marks: any;
        };
        savedResponses: {
            question_id: any;
            selected_answer: any;
            status: any;
            time_spent_seconds: any;
        }[];
    }>;
    private loadResponses;
    getQuestions(sessionId: string, studentId: string): Promise<{
        id: any;
        order: any;
        subject: any;
        topic: any;
        question_text: any;
        options: any;
        image_url: any;
        difficulty: any;
        type: any;
        marks: any;
    }[]>;
    heartbeat(sessionId: string, studentId: string): Promise<{
        remainingSeconds: number;
        status: any;
    }>;
    saveResponse(sessionId: string, studentId: string, payload: any): Promise<{
        success: boolean;
    }>;
    logViolation(sessionId: string, studentId: string, payload: any): Promise<{
        success: boolean;
        terminated: boolean;
        strikes: number;
    }>;
    submitSession(sessionId: string, studentId: string, autoSubmitted?: boolean): Promise<{
        success: boolean;
        alreadySubmitted: boolean;
        score: any;
    } | {
        score: number;
        maxScore: number;
        correct: number;
        incorrect: number;
        unattempted: number;
        accuracy: number;
        success: boolean;
        autoSubmitted: boolean;
        alreadySubmitted?: undefined;
    }>;
    private finaliseSession;
    private isUniqueViolation;
    private gradeSession;
    private answersMatch;
    getResult(sessionId: string, studentId: string): Promise<{
        score: number;
        maxScore: number;
        correct: number;
        incorrect: number;
        unattempted: number;
        accuracy: number;
        sessionId: string;
        status: any;
        test: {
            title: any;
            total_marks: any;
            duration_minutes: any;
        } | null;
        violations: number;
        storedScore: any;
    }>;
}

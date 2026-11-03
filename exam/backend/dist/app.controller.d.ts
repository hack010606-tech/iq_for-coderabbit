import { AppService } from './app.service';
interface Caller {
    id: string;
    email: string;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    health(): {
        status: string;
    };
    startSession(examId: string, user: Caller): Promise<{
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
    getQuestions(sessionId: string, user: Caller): Promise<{
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
    heartbeat(sessionId: string, user: Caller): Promise<{
        remainingSeconds: number;
        status: any;
    }>;
    saveResponse(sessionId: string, user: Caller, body: any): Promise<{
        success: boolean;
    }>;
    logViolation(sessionId: string, user: Caller, body: any): Promise<{
        success: boolean;
        terminated: boolean;
        strikes: number;
    }>;
    submitSession(sessionId: string, user: Caller, body: {
        autoSubmitted?: boolean;
    }): Promise<{
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
    getResult(sessionId: string, user: Caller): Promise<{
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
export {};

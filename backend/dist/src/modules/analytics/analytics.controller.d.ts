import { AnalyticsService } from './analytics.service';
import { SpacedRepetitionService } from './spaced-repetition.service';
declare class RevisionQueryDto {
    limit?: number;
}
declare class CohortQueryDto {
    batchId?: string;
}
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly srsService;
    constructor(analyticsService: AnalyticsService, srsService: SpacedRepetitionService);
    getMyAnalytics(user: any): Promise<{
        testsAttempted: number;
        totalScore: any;
        avgAccuracy: number;
        avgSecondsPerQuestion: number;
        subjectBreakdown: {
            subject: string;
            accuracy: number;
            totalAnswered: number;
        }[];
        topicBreakdown: {
            topic: string;
            subject: string;
            accuracy: number;
            totalAnswered: number;
        }[];
        weakTopics: {
            topic: string;
            subject: string;
            accuracy: number;
            totalAnswered: number;
        }[];
        scoreHistory: {
            title: any;
            score: any;
            maxScore: any;
            date: any;
        }[];
        spacedRepetition: {
            priority_weight: any;
            mastery_level: any;
            questions: {
                subject: any;
                topic: any;
                question_text: any;
            }[];
        }[];
        predictions: {
            subject: any;
            topic: any;
            predicted_score: any;
            risk_flag: any;
            computed_at: any;
        }[];
    }>;
    getDueQuestions(user: any, query: RevisionQueryDto): Promise<{
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
    getCohort(query: CohortQueryDto): Promise<{
        totalStudents: number;
        avgScore: number;
        atRiskCount: number;
        totalAttempts: number;
    }>;
    getStudentAnalytics(id: string): Promise<{
        testsAttempted: number;
        totalScore: any;
        avgAccuracy: number;
        avgSecondsPerQuestion: number;
        subjectBreakdown: {
            subject: string;
            accuracy: number;
            totalAnswered: number;
        }[];
        topicBreakdown: {
            topic: string;
            subject: string;
            accuracy: number;
            totalAnswered: number;
        }[];
        weakTopics: {
            topic: string;
            subject: string;
            accuracy: number;
            totalAnswered: number;
        }[];
        scoreHistory: {
            title: any;
            score: any;
            maxScore: any;
            date: any;
        }[];
        spacedRepetition: {
            priority_weight: any;
            mastery_level: any;
            questions: {
                subject: any;
                topic: any;
                question_text: any;
            }[];
        }[];
        predictions: {
            subject: any;
            topic: any;
            predicted_score: any;
            risk_flag: any;
            computed_at: any;
        }[];
    }>;
}
export {};

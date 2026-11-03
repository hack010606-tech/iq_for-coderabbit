import { CacheService } from '../../common/cache/cache.service';
export declare class AnalyticsService {
    private readonly cache;
    constructor(cache: CacheService);
    getStudentAnalytics(studentId: string): Promise<{
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
    getCohortAnalytics(batchId?: string): Promise<{
        totalStudents: number;
        avgScore: number;
        atRiskCount: number;
        totalAttempts: number;
    }>;
    private computeCohortAnalytics;
    getStudentAnalyticsForTeacher(studentId: string): Promise<{
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
    invalidateCohortCache(): Promise<void>;
}

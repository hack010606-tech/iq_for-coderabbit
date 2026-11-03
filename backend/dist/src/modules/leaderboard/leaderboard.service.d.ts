import { CacheService } from '../../common/cache/cache.service';
export interface RankedStudent {
    rank: number;
    id: string;
    name: string;
    totalScore: number;
    testCount: number;
    bestScore: number;
}
export declare class LeaderboardService {
    private readonly cache;
    constructor(cache: CacheService);
    private buildRanking;
    getGlobal(page?: number, limit?: number): Promise<{
        data: RankedStudent[];
        total: number;
        page: number;
        limit: number;
    }>;
    assertCanViewBatch(batchId: string, user: {
        id: string;
        role?: string;
    }): Promise<void>;
    getBatch(batchId: string): Promise<{
        rank: number;
        id: string;
        name: string;
        totalScore: number;
        testCount: number;
        bestScore: number;
    }[]>;
    getMyRank(studentId: string): Promise<{
        rank: null;
        totalStudents: number;
        neighbors: never[];
        totalScore?: undefined;
    } | {
        rank: number;
        totalScore: number;
        totalStudents: number;
        neighbors: {
            isMe: boolean;
            rank: number;
            id: string;
            name: string;
            totalScore: number;
            testCount: number;
            bestScore: number;
        }[];
    }>;
    invalidate(): Promise<void>;
}

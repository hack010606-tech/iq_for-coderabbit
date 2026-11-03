import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getGlobal(page?: number, limit?: number): Promise<{
        data: import("./leaderboard.service").RankedStudent[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMyRank(user: any): Promise<{
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
    getBatch(batchId: string, user: any): Promise<{
        rank: number;
        id: string;
        name: string;
        totalScore: number;
        testCount: number;
        bestScore: number;
    }[]>;
}

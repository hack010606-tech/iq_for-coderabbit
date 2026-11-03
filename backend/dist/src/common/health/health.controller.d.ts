export declare class HealthController {
    private readonly startedAt;
    liveness(): {
        status: string;
        uptimeSeconds: number;
    };
}

import { OnModuleDestroy } from '@nestjs/common';
export declare class CacheService implements OnModuleDestroy {
    private readonly logger;
    private readonly memory;
    private redis;
    private redisHealthy;
    private readonly inFlight;
    private readonly memoryLocks;
    constructor();
    onModuleDestroy(): Promise<void>;
    get isDistributed(): boolean;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
    invalidate(prefix: string): Promise<void>;
    wrap<T>(key: string, ttlSeconds: number, produce: () => Promise<T>): Promise<T>;
    withLock<T>(key: string, ttlSeconds: number, task: () => Promise<T>): Promise<T | null>;
    private acquire;
    private release;
    private pruneMemory;
}

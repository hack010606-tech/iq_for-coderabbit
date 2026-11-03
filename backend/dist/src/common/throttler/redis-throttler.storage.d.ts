import { OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import type { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
export declare class RedisThrottlerStorage implements ThrottlerStorage, OnModuleDestroy {
    private readonly logger;
    private readonly memory;
    private redis;
    private healthy;
    constructor();
    onModuleDestroy(): Promise<void>;
    increment(key: string, ttl: number, limit: number, blockDuration: number, throttlerName: string): Promise<ThrottlerStorageRecord>;
    private incrementInRedis;
}

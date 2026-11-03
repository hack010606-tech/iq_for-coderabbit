import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { CacheService } from '../../common/cache/cache.service';
export declare class AttemptsSweeperService implements OnModuleInit, OnModuleDestroy {
    private readonly attemptsService;
    private readonly cache;
    private readonly logger;
    private timer;
    private running;
    constructor(attemptsService: AttemptsService, cache: CacheService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    sweep(): Promise<number>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AttemptsSweeperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptsSweeperService = void 0;
const common_1 = require("@nestjs/common");
const attempts_service_1 = require("./attempts.service");
const cache_service_1 = require("../../common/cache/cache.service");
let AttemptsSweeperService = AttemptsSweeperService_1 = class AttemptsSweeperService {
    attemptsService;
    cache;
    logger = new common_1.Logger(AttemptsSweeperService_1.name);
    timer = null;
    running = false;
    constructor(attemptsService, cache) {
        this.attemptsService = attemptsService;
        this.cache = cache;
    }
    onModuleInit() {
        if (process.env.ATTEMPT_SWEEP_DISABLED === 'true') {
            this.logger.log('Attempt sweeper disabled via ATTEMPT_SWEEP_DISABLED.');
            return;
        }
        const intervalMs = Number(process.env.ATTEMPT_SWEEP_INTERVAL_MS) || 60_000;
        this.timer = setInterval(() => void this.sweep(), intervalMs);
        this.timer.unref?.();
        this.logger.log(`Attempt sweeper started (every ${intervalMs}ms).`);
    }
    onModuleDestroy() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = null;
    }
    async sweep() {
        if (this.running)
            return 0;
        this.running = true;
        try {
            const lockTtl = Math.max(30, Math.ceil((Number(process.env.ATTEMPT_SWEEP_INTERVAL_MS) || 60_000) / 1000) * 2);
            const swept = await this.cache.withLock('attempt-sweeper', lockTtl, () => this.attemptsService.autoSubmitExpiredAttempts());
            return swept ?? 0;
        }
        catch (e) {
            this.logger.error(`Sweep failed: ${e?.message}`);
            return 0;
        }
        finally {
            this.running = false;
        }
    }
};
exports.AttemptsSweeperService = AttemptsSweeperService;
exports.AttemptsSweeperService = AttemptsSweeperService = AttemptsSweeperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attempts_service_1.AttemptsService,
        cache_service_1.CacheService])
], AttemptsSweeperService);
//# sourceMappingURL=attempts-sweeper.service.js.map
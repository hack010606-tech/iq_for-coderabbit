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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const exam_auth_guard_1 = require("./auth/exam-auth.guard");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    health() {
        return { status: 'ok' };
    }
    startSession(examId, user) {
        return this.appService.startSession(examId, user.id);
    }
    getQuestions(sessionId, user) {
        return this.appService.getQuestions(sessionId, user.id);
    }
    heartbeat(sessionId, user) {
        return this.appService.heartbeat(sessionId, user.id);
    }
    saveResponse(sessionId, user, body) {
        return this.appService.saveResponse(sessionId, user.id, body);
    }
    logViolation(sessionId, user, body) {
        return this.appService.logViolation(sessionId, user.id, body);
    }
    submitSession(sessionId, user, body) {
        return this.appService.submitSession(sessionId, user.id, body?.autoSubmitted);
    }
    getResult(sessionId, user) {
        return this.appService.getResult(sessionId, user.id);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "health", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Post)(':examId/start'),
    __param(0, (0, common_1.Param)('examId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "startSession", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Get)('session/:sessionId/questions'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Get)('session/:sessionId/heartbeat'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "heartbeat", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Post)('session/:sessionId/response'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "saveResponse", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Post)('session/:sessionId/violation'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "logViolation", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Post)('session/:sessionId/submit'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "submitSession", null);
__decorate([
    (0, common_1.UseGuards)(exam_auth_guard_1.ExamAuthGuard),
    (0, common_1.Get)('session/:sessionId/result'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, exam_auth_guard_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getResult", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api/exam'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map
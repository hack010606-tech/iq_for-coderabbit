"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.ExamAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const supabase_jwt_1 = require("./supabase-jwt");
let ExamAuthGuard = class ExamAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'] || '';
        if (!authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing or invalid Authorization header.');
        }
        try {
            const identity = await (0, supabase_jwt_1.verifySupabaseToken)(authHeader.slice('Bearer '.length));
            request.user = { id: identity.userId, email: identity.email };
            return true;
        }
        catch (e) {
            throw new common_1.UnauthorizedException(e instanceof supabase_jwt_1.TokenVerificationError ? e.message : 'Invalid or malformed token.');
        }
    }
};
exports.ExamAuthGuard = ExamAuthGuard;
exports.ExamAuthGuard = ExamAuthGuard = __decorate([
    (0, common_1.Injectable)()
], ExamAuthGuard);
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    return ctx.switchToHttp().getRequest().user;
});
//# sourceMappingURL=exam-auth.guard.js.map
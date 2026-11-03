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
exports.LecturesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lectures_service_1 = require("./lectures.service");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const lecture_dto_1 = require("./dto/lecture.dto");
let LecturesController = class LecturesController {
    lecturesService;
    constructor(lecturesService) {
        this.lecturesService = lecturesService;
    }
    findAll(query) {
        return this.lecturesService.findAll(query);
    }
    getSyllabus(subject) {
        return this.lecturesService.getSyllabus(subject);
    }
    create(body, user) {
        return this.lecturesService.create(body, user.id);
    }
    remove(id, user) {
        return this.lecturesService.remove(id, user);
    }
};
exports.LecturesController = LecturesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List lectures (filterable by subject/topic)' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lecture_dto_1.LectureQueryDto]),
    __metadata("design:returntype", void 0)
], LecturesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ordered syllabus for a subject' }),
    (0, common_1.Get)('syllabus/:subject'),
    __param(0, (0, common_1.Param)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LecturesController.prototype, "getSyllabus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '[Teacher] Add a lecture' }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('teacher', 'admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lecture_dto_1.CreateLectureDto, Object]),
    __metadata("design:returntype", void 0)
], LecturesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '[Teacher] Delete a lecture you uploaded' }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('teacher', 'admin'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LecturesController.prototype, "remove", null);
exports.LecturesController = LecturesController = __decorate([
    (0, swagger_1.ApiTags)('Lectures'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Controller)('api/lectures'),
    __metadata("design:paramtypes", [lectures_service_1.LecturesService])
], LecturesController);
//# sourceMappingURL=lectures.controller.js.map
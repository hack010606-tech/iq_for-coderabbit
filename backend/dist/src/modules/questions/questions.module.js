"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsModule = void 0;
const common_1 = require("@nestjs/common");
const questions_controller_1 = require("./questions.controller");
const questions_service_1 = require("./questions.service");
const pdf_processor_service_1 = require("./pdf-processor.service");
const uploads_gateway_1 = require("./uploads.gateway");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let QuestionsModule = class QuestionsModule {
};
exports.QuestionsModule = QuestionsModule;
exports.QuestionsModule = QuestionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.memoryStorage)(),
                limits: { fileSize: 15 * 1024 * 1024 },
            }),
        ],
        controllers: [questions_controller_1.QuestionsController],
        providers: [questions_service_1.QuestionsService, pdf_processor_service_1.PdfProcessorService, uploads_gateway_1.UploadsGateway],
    })
], QuestionsModule);
//# sourceMappingURL=questions.module.js.map
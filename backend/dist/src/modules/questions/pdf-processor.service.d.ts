import { OnModuleInit } from '@nestjs/common';
import { UploadsGateway } from './uploads.gateway';
export declare class PdfProcessorService implements OnModuleInit {
    private readonly uploadsGateway;
    private readonly logger;
    private readonly scriptsDir;
    private readonly pythonBin;
    constructor(uploadsGateway: UploadsGateway);
    onModuleInit(): Promise<void>;
    processPdf(fileBuffer: Buffer, teacherId: string, examType?: string): Promise<{
        success: boolean;
        processed: number;
        inserted: number;
        byType: Record<string, number>;
        runId: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    private resolveExamType;
    private looksLikePdf;
    private resolveQuestionType;
    private buildCorrectAnswer;
    private runScript;
    private readManifest;
    private resolveInside;
    private exists;
}

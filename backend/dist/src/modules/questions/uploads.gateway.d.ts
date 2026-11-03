import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export type UploadStage = 'queued' | 'extracting' | 'classifying' | 'uploading-images' | 'saving' | 'complete' | 'failed';
export interface UploadProgress {
    runId: string;
    stage: UploadStage;
    message: string;
    percent: number;
    processed?: number;
    inserted?: number;
    error?: string;
}
export declare class UploadsGateway implements OnGatewayConnection {
    private readonly logger;
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    subscribe(client: Socket): Promise<void>;
    unsubscribe(client: Socket): Promise<void>;
    emitProgress(userId: string, progress: UploadProgress): void;
}

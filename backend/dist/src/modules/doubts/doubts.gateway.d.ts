import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DoubtsService } from './doubts.service';
export declare class DoubtsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly doubtsService;
    server: Server;
    constructor(doubtsService: DoubtsService);
    handleConnection(client: Socket): Promise<void>;
    private authenticate;
    handleDisconnect(client: Socket): void;
    private isAuthenticated;
    private readDoubtId;
    private getGrant;
    private withinRateLimit;
    handleJoinRoom(data: any, client: Socket): Promise<void>;
    handleLeaveRoom(data: any, client: Socket): Promise<void>;
    handleMessage(data: any, client: Socket): Promise<void>;
    handleTypingStart(data: any, client: Socket): Promise<void>;
    handleTypingStop(data: any, client: Socket): Promise<void>;
    broadcastMessage(doubtId: string, message: any, sender: {
        id: string;
        full_name: string;
        role: string;
    }): void;
    notifyStatusChange(doubtId: string, status: string): void;
}

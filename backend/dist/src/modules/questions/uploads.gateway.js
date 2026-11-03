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
var UploadsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const supabase_config_1 = require("../../config/supabase.config");
const supabase_jwt_1 = require("../../common/auth/supabase-jwt");
let UploadsGateway = UploadsGateway_1 = class UploadsGateway {
    logger = new common_1.Logger(UploadsGateway_1.name);
    server;
    async handleConnection(client) {
        const ready = (async () => {
            try {
                const identity = await (0, supabase_jwt_1.verifySupabaseToken)(client.handshake.auth?.token ?? '');
                const { data: profile } = await supabase_config_1.supabase
                    .from('users')
                    .select('role')
                    .eq('id', identity.userId)
                    .single();
                if (!profile) {
                    client.disconnect();
                    return;
                }
                client.data.userId = identity.userId;
                client.data.role = profile.role;
            }
            catch {
            }
        })();
        client.data.uploadReady = ready;
        await ready;
    }
    async subscribe(client) {
        await client.data?.uploadReady?.catch(() => undefined);
        const userId = client.data?.userId;
        if (!userId) {
            client.emit('uploads:error', { message: 'Not authenticated.' });
            return;
        }
        client.join(`upload:${userId}`);
        client.emit('uploads:subscribed', { ok: true });
    }
    async unsubscribe(client) {
        const userId = client.data?.userId;
        if (userId)
            client.leave(`upload:${userId}`);
    }
    emitProgress(userId, progress) {
        this.server?.to(`upload:${userId}`).emit('uploads:progress', progress);
    }
};
exports.UploadsGateway = UploadsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], UploadsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('uploads:subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], UploadsGateway.prototype, "subscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('uploads:unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], UploadsGateway.prototype, "unsubscribe", null);
exports.UploadsGateway = UploadsGateway = UploadsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)()
], UploadsGateway);
//# sourceMappingURL=uploads.gateway.js.map
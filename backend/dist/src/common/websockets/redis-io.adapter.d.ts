import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export declare class RedisIoAdapter extends IoAdapter {
    private readonly allowList;
    private readonly isProd;
    private readonly logger;
    private adapterConstructor;
    private clients;
    constructor(app: INestApplicationContext, allowList: string[], isProd: boolean);
    connectToRedis(): Promise<void>;
    createIOServer(port: number, options?: ServerOptions): any;
    close(server: any): Promise<void>;
}

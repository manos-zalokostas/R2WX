// src/core/event/event.gateway.ts
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as process from "node:process";

@WebSocketGateway({
    cors: { origin: process.env.ENV_WSHOST },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('EventGateway');

    emitUploadProgress(sessionId: string, progressData: any) {
        this.server.to(sessionId).emit('uploadProgress', progressData);
    }

    @SubscribeMessage('subscribeToProgress')
    handleSubscription(client: Socket, sessionId: string): void {
        this.logger.log(`Client ${client.id} subscribing to session: ${sessionId}`);
        client.join(sessionId);
    }

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway Initialized');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
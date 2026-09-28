// src/core/event/event.module.ts
import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
    providers: [EventGateway],
    exports: [EventGateway], // <-- Export the gateway
})
export class EventModule {}
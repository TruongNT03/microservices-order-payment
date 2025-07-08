import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventService } from './event.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [EventsGateway, EventService, JwtService],
})
export class EventsModule {}

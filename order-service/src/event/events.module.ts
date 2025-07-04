import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventService } from './event.service';

@Module({
  providers: [EventsGateway, EventService],
})
export class EventsModule {}

import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventService } from './event.service';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [EventsGateway, EventService, JwtService, CacheService],
  exports: [EventsGateway],
})
export class EventsModule {}

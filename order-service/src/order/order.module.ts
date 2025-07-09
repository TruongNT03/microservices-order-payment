import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthenMiddleware } from 'src/commom/middleware/authen.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';
import { EventsModule } from 'src/event/events.module';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    EventsModule,
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 8088 },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService, CacheService],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenMiddleware)
      .exclude({ path: 'order', method: RequestMethod.GET })
      .forRoutes(OrderController);
  }
}

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
import { EventsGateway } from 'src/event/events.gateway';
import { AuthenMiddleware } from 'src/commom/middleware/authen.middleware';

@Module({
  imports: [
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
  providers: [OrderService, EventsGateway],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenMiddleware)
      .exclude({ path: 'order', method: RequestMethod.GET })
      .forRoutes(OrderController);
  }
}

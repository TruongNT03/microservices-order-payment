import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';
import { EventsModule } from 'src/event/events.module';
import { Constant } from './order.contanst';
import { MailService } from 'src/nodemailer/mail.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    EventsModule,
    TypeOrmModule.forFeature([Order, User]),
    ClientsModule.register([
      {
        name: Constant.PaymentServiceName,
        transport: Transport.TCP,
        options: {
          host: Constant.PaymentServiceHost,
          port: Constant.PaymentServicePort,
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService, CacheService, MailService],
})
export class OrderModule {}

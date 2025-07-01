import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  async handlePayment(data: { PIN: string }) {
    const PIN = Number.parseInt(data.PIN);
    return PIN % 2 ? { status: 'declined' } : { status: 'confirmed' };
  }
}

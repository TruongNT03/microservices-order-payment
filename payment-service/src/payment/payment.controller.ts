import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payment')
  handlePayment(@Payload() data: { PIN: string }) {
    return this.paymentService.handlePayment(data);
  }
}

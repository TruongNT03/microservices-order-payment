import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payment')
  handlePayment() {
    return this.paymentService.handlePayment();
  }
}

import { Injectable, Res } from '@nestjs/common';

@Injectable()
export class PaymentService {
  async handlePayment() {
    const ramdomNumber = Math.ceil(Math.random() * 100);
    // return ramdomNumber % 2 ? { status: 'declined' } : { status: 'confirmed' };
    return { status: 'confirmed' };
  }
}

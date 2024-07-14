import { Injectable, BadRequestException } from '@nestjs/common';
import * as Paystack from 'paystack';
import { PaystackCongig } from 'src/config/paystack.config';

@Injectable()
export class PaystackService {
  private paystack;
  constructor() {
    this.paystack = Paystack(PaystackCongig.secretKey);
  }

  async initializePayment(email: string, amount: number) {
    const response = await this.paystack.transaction.initialize({
      email,
      amount: amount * 100,
    });
    if (!response.status) {
      throw new BadRequestException('Payment initialization failed');
    }
    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await this.paystack.transaction.verify(reference);
    if (!response.status) {
      throw new BadRequestException('Payment verification failed');
    }
    return response.data;
  }
}

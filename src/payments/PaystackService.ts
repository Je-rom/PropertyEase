import { Injectable, BadRequestException } from '@nestjs/common';
import * as Paystack from 'paystack';

@Injectable()
export class PaystackService {
  private paystack;
  private SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  constructor() {
    this.paystack = Paystack(this.SECRET_KEY);
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await this.paystack.transaction.verify(reference);
      if (!response.status || response.data.status !== 'success') {
        throw new Error('Payment verification failed');
      }
      return response.data;
    } catch (error) {
      console.error('Error during payment verification:', error);
      throw new BadRequestException('Payment verification failed');
    }
  }
}

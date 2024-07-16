import { Injectable, BadRequestException } from '@nestjs/common';
import * as Paystack from 'paystack';
import { PaystackConfig } from 'src/config/paystack.config';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private paystack;
  private SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  constructor() {
    this.paystack = Paystack(this.SECRET_KEY);
  }

  async initializePayment(
    email: string,
    amount: number,
    reference: string,
    method: string,
    booking: string,
  ) {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          booking,
          method,
          amount: amount * 100,
          reference,
          callback_url:
            'https://cda2bf5d1dfdd144211520251672ca94.serveo.net/payment/callback',
        },
        {
          headers: {
            Authorization: `Bearer ${this.SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status !== 200 || !response.data.status) {
        console.error('Paystack initialization response:', response.data);
        throw new BadRequestException('Payment initialization failed');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error during payment initialization:', error);
      throw new BadRequestException('Payment initialization failed');
    }
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

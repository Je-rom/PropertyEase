import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Payment } from 'src/schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payments.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.initializePayment(createPaymentDto);
  }

  @Patch(':reference/verify')
  async verify(@Param('reference') reference: string): Promise<Payment> {
    return this.paymentService.verifyPayment(reference);
  }

  @Post('webhook')
  async handlePaymentWebhook(@Body() body: any): Promise<any> {
    const result = await this.paymentService.processPaymentCallback(body);
    return { message: 'Webhook received', result };
  }

  @Get('/')
  handleCallback(
    @Query('trxref') trxref: string,
    @Query('reference') reference: string,
  ): string {
    return `Payment completed for transaction reference ${trxref}`;
  }
}

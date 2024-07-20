import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Payment } from 'src/schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async initializePayment(@Body() createPaymentDto: CreatePaymentDto) {
    const result =
      await this.paymentService.initializePayment(createPaymentDto);
    return {
      message: 'Payment initialized successfully',
      payment: result.payment,
      authorization_url: result.paystack.authorization_url,
      access_code: result.paystack.access_code,
      reference: result.paystack.reference,
      propertyOwner: result.propertyOwner,
    };
  }

  @Patch(':reference/verify')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Tenant)
  async verify(@Param('reference') reference: string): Promise<Payment> {
    return this.paymentService.verifyPayment(reference);
  }

  @Post('webhook')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Tenant)
  async handlePaymentWebhook(@Body() body: any): Promise<any> {
    const result = await this.paymentService.processPaymentCallback(body);
    return { message: 'Webhook received', result };
  }

  @Get('callback')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Tenant)
  async handleCallback(
    @Query('trxref') trxref: string,
    @Query('reference') reference: string,
  ): Promise<any> {
    const result = await this.paymentService.processPaymentCallback(trxref, reference);
    return { message: 'Callback received', result };
  }
}

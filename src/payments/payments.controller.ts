import { Body, Controller, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { Payment } from "src/schemas/payment.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaymentService } from "./payments.service";


@Controller('payment')
export class PaymentController{
    constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Patch(':reference/verify')
  async verify(@Param('reference') reference: string): Promise<Payment> {
    return this.paymentService.verifyPayment(reference);
  }

  @Get('callback')
  async handlePaymentCallback(
    @Query('trxref') trxref: string,
    @Query('reference') reference: string,
  ): Promise<any> {
    const result = await this.paymentService.processPaymentCallback(trxref, reference);
    return { message: 'Callback received', result };
  }
}
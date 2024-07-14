import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking } from "src/schemas/booking.schema";
import { Payment } from "src/schemas/payment.schema";
import { PaystackService } from "./PaystackService";
import { CreatePaymentDto } from "./dto/create-payment.dto";


@Injectable()
export class PaymentService{
    constructor(@InjectModel (Payment.name) private PaymentModel: Model<Payment>,@InjectModel (Booking.name) private BookingModel: Model<Booking>,
    private readonly paystackService: PaystackService){}

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const booking = await this.BookingModel.findById(createPaymentDto.booking);
        if (!booking) {
          throw new NotFoundException('Booking not found');
        }
        if (booking.status !== 'Approved') {
          throw new BadRequestException('Booking is not approved');
        }
    
        const paymentData = await this.paystackService.initializePayment(
          createPaymentDto.email,
          createPaymentDto.amount
        );
        
        const payment = new this.PaymentModel({
          ...createPaymentDto,
          status: 'Pending',
          date: new Date(),
          method: paymentData.authorization_url,
        });
    
        const savedPayment = await payment.save();
        booking.payment = savedPayment._id;
        await booking.save();
    
        return savedPayment;
      }

      async verifyPayment(reference: string): Promise<Payment> {
        const paymentData = await this.paystackService.verifyPayment(reference);
        
        const payment = await this.PaymentModel.findOne({ reference });
        if (!payment) {
          throw new NotFoundException('Payment not found');
        }
        if (paymentData.status === 'success') {
          payment.status = 'Completed';
        } else {
          payment.status = 'Failed';
        }
        return payment.save();
      }
}
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
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
      try {
        const booking = await this.BookingModel.findById(createPaymentDto.booking);
        if (!booking) {
          throw new NotFoundException('Booking not found');
        }
        if (booking.status !== 'Approved') {
          throw new BadRequestException('Booking is not approved');
        }
        
        const reference = `ref_${Date.now()}`;
        const paymentData = await this.paystackService.initializePayment(
          createPaymentDto.email,
          createPaymentDto.amount,
          createPaymentDto.booking,
          createPaymentDto.method,
          reference
        );
        
        const payment = new this.PaymentModel({
          ...createPaymentDto,
          status: 'Pending',
          date: new Date(),
          method: createPaymentDto.method,
          currency: 'NGN',
        });
    
        const savedPayment = await payment.save();
        booking.payment = savedPayment._id;
        await booking.save();
    
        return savedPayment;
        
      } catch (error) {
        Logger.error(`Error creating payment: ${error.message}`, error.stack, 'PaymentService');
        throw new BadRequestException('Failed to create payment');
      }
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

      async updatePaymentStatus(reference: string, status: string): Promise<Payment> {
        const payment = await this.PaymentModel.findOneAndUpdate(
          { reference },
          { $set: { status: status === 'success' ? 'Completed' : 'Failed' } },
          { new: true },
        );
        if (!payment) {
          throw new NotFoundException('Payment not found');
        }
        return payment;
      }

      async processPaymentCallback(trxref: string, reference: string): Promise<any> {
        try {
          const paymentData = await this.paystackService.verifyPayment(reference);
          const updatedPayment = await this.updatePaymentStatus(reference, paymentData.status);
          const payment = await this.PaymentModel.findOne({ reference });
          if (!payment) {
            throw new NotFoundException('Payment not found in database');
          }
          return { message: 'Callback processed successfully', payment: updatedPayment };
        } catch (error) {
          console.error('Error processing payment callback:', error);
          throw new BadRequestException('Error processing payment callback');
        }
      }
}
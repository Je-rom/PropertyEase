import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from 'src/schemas/booking.schema';
import { Payment } from 'src/schemas/payment.schema';
import { PaystackService } from './PaystackService';
import { CreatePaymentDto } from './dto/create-payment.dto';
import axios from 'axios';
import * as Paystack from 'paystack';
import { Property, PropertyDocument } from 'src/schemas/property.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class PaymentService {
  private paystack;
  private readonly SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  constructor(
    @InjectModel(Payment.name) private PaymentModel: Model<Payment>,
    @InjectModel(Booking.name) private BookingModel: Model<Booking>,
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly paystackService: PaystackService,
  ) {
    this.paystack = Paystack(this.SECRET_KEY);
  }

  async getPayments() {
    return this.PaymentModel.find();
  }

  async initializePayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      //find booking id
      const booking = await this.BookingModel.findById(
        createPaymentDto.booking,
      );
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      if (booking.status !== 'Approved') {
        throw new BadRequestException('Booking is not approved');
      }

      //check if a payment already exists for this booking
      const existingPayment = await this.PaymentModel.findOne({
        booking: createPaymentDto.booking,
        status: { $in: ['Pending', 'Completed'] },
      });

      if (existingPayment) {
        throw new BadRequestException(
          'Payment already exists for this booking',
        );
      }

      //check if the property still exists
      const property = await this.propertyModel.findById(booking.property);
      if (!property) {
        throw new NotFoundException('Property not found');
      }

      //check if the owner still exists
      const owner = await this.userModel.findById(property.owner);
      if (!owner) {
        throw new NotFoundException('Property owner not found');
      }

      const reference = `ref_${Date.now()}`;
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: createPaymentDto.email,
          amount: createPaymentDto.amount * 100,
          reference,
          callback_url:
            'https://3b8a-102-89-34-236.ngrok-free.app/payment/callback',
        },
        {
          headers: {
            Authorization: `Bearer ${this.SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status !== 200 || !response.data.status) {
        Logger.error('Paystack initialization response:', response.data);
        throw new BadRequestException('Payment initialization failed');
      }

      Logger.log(
        `Payment initialized with Paystack: ${JSON.stringify(response.data.data)}`,
        'PaystackService',
      );
      const payment = new this.PaymentModel({
        ...createPaymentDto,
        status: 'Pending',
        date: new Date(),
        method: createPaymentDto.method,
        currency: 'NGN',
        reference: reference,
      });

      const savedPayment = await payment.save();
      booking.payment = savedPayment._id;
      await booking.save();

      return {
        payment: savedPayment,
        paystack: response.data.data,
        propertyOwner: {
          name: `${owner.firstName} ${owner.lastName}`,
          email: owner.email,
        },
      };
    } catch (error) {
      Logger.error(
        `Error initializing payment: ${error.message}`,
        error.stack,
        'PaymentService',
      );
      throw new BadRequestException('Failed to initialize payment');
    }
  }

  async disburseFunds(bookingId: string): Promise<void> {
    const booking =
      await this.BookingModel.findById(bookingId).populate('property');
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const property = await this.propertyModel.findById(booking.property);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const owner = await this.userModel.findById(property.owner);
    if (!owner) {
      throw new NotFoundException('Property owner not found');
    }

    const bankDetails = {
      account_number: owner.bankAccountNumber,
      bank_code: owner.bankCode,
      amount: booking.amount * 100, //convert to kobo
    };

    const transferResponse = await axios.post(
      'https://api.paystack.co/transfer',
      bankDetails,
      {
        headers: {
          Authorization: `Bearer ${this.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (transferResponse.status !== 200 || !transferResponse.data.status) {
      throw new BadRequestException('Fund disbursement failed');
    }

    Logger.log(
      `Funds disbursed to property owner: ${owner.firstName}`,
      'PaymentService',
    );
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.SECRET_KEY}`,
          },
        },
      );

      if (response.status !== 200 || !response.data.status) {
        throw new BadRequestException('Payment verification failed');
      }

      const payment = await this.PaymentModel.findOne({ reference });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (response.data.data.status === 'success') {
        payment.status = 'Completed';
        await payment.save();

        // Disburse funds to property owner
        await this.disburseFunds(payment.booking.toString());
      } else {
        payment.status = 'Failed';
        await payment.save();
      }

      return {
        message: 'Payment verification completed',
        payment,
      };
    } catch (error) {
      Logger.error(
        `Error verifying payment: ${error.message}`,
        error.stack,
        'PaymentService',
      );
      throw new BadRequestException('Failed to verify payment');
    }
  }

  async updatePaymentStatus(
    reference: string,
    status: string,
  ): Promise<Payment> {
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

  async processPaymentCallback(data: any): Promise<any> {
    try {
      const { event, data: eventData } = data;
      if (event !== 'charge.success' || !eventData) {
        throw new BadRequestException('Invalid webhook event or data');
      }

      const reference = eventData.reference;

      // Verify payment status with Paystack
      const paymentData = await this.paystackService.verifyPayment(reference);

      // Update payment status based on verification result
      const updatedPayment = await this.updatePaymentStatus(
        reference,
        paymentData.status,
      );

      if (!updatedPayment) {
        throw new NotFoundException('Payment not found in database');
      }

      return {
        message: 'Callback processed successfully',
        payment: updatedPayment,
      };
    } catch (error) {
      console.error('Error processing payment callback:', error);
      throw new BadRequestException('Error processing payment callback');
    }
  }
}

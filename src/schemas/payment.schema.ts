import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

@Schema()
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  method: 'Card' | 'BankTransfer' | 'USSD' | 'MobileMoney' | 'QR';

  @Prop({ required: true })
  status: 'Pending' | 'Completed' | 'Failed';

  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true, default: 'NGN' })
  currency: string;

  @Prop({ required: true })
  email: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

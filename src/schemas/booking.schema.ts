import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./user.schema";
import { Ref } from "@typegoose/typegoose";
import { Property } from "./property.schema";
import { Payment } from "./payment.schema";


@Schema()
export class Booking{
  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  tenant: Ref<User>

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property: Ref<Property>;

  @Prop({ type: Types.ObjectId, ref: 'Payment', required: false })
  payment?: Ref<Payment>;

  @Prop()
  checkInDate?: Date;

  @Prop()
  checkOutDate?: Date;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] })
  status: string;

  @Prop({ required: true, enum: ['Rent', 'Purchase'] })
  transactionType: string;

  @Prop({ default: Date.now })
  dateRequested: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";
import { User } from "./user.schema";
import { Ref } from "@typegoose/typegoose";

export type PropertyDocument = Property & Document;

@Schema()
export class Property{
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    owner: Ref<User>;

    @Prop({required: true})
    title: string

    @Prop({required: true})
    description: string

    @Prop({required: true})
    price: number

    @Prop()
    discount: number

    @Prop({type:[String], required: true})
    amenities: string[]

    @Prop({required: true})
    location: string

    @Prop({ required: true })
    type: 'Rent' | 'Sale';

    @Prop({required: true})
    coverImage: string

    @Prop({type:[String], required: true})
    image: string[]

    @Prop({ required: true, default: true })
    isAvailable: boolean;

    // @Prop({})
    // geolocation: {latitude: number; longitude: number};

    @Prop({ required: true, default: Date.now })
    dateListed: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property)
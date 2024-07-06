import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking } from "src/schemas/booking.schema";
import { Property, PropertyDocument } from "src/schemas/property.schema";


@Injectable()
export class BookingService{
    constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>, @InjectModel(Property.name) private propertyModel: Model<PropertyDocument> ){}
}
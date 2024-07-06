import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Booking, BookingSchema } from "src/schemas/booking.schema";
import { Property, PropertySchema } from "src/schemas/property.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Booking.name, schema: BookingSchema}]),
        MongooseModule.forFeature([{name: Property.name, schema: PropertySchema}])
    ]

})
export class BookingModule{};
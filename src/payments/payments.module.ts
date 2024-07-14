import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schemas/booking.schema";
import { Payment, PaymentSchema } from "src/schemas/payment.schema";
import { PaystackService } from "./PaystackService";
import { PaymentService } from "./payments.service";
import { PaymentController } from "./payments.controller";


@Module({
    imports:[
        MongooseModule.forFeature([{name: Payment.name, schema: PaymentSchema}]),
        MongooseModule.forFeature([{name: Booking.name, schema: BookingSchema}])
    ],
    controllers:[PaymentController],
    providers:[PaystackService, PaymentService]

})
export class PaymentModule{}
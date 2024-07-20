import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schemas/booking.schema";
import { Payment, PaymentSchema } from "src/schemas/payment.schema";
import { PaystackService } from "./PaystackService";
import { PaymentService } from "./payments.service";
import { PaymentController } from "./payments.controller";
import { AuthService } from "src/auth/auth.service";
import { TokenService } from "src/token/token.service";
import { UserModule } from "src/user/user.module";
import { PropertyModule } from "src/property/property.module";


@Module({
    imports:[
        MongooseModule.forFeature([{name: Payment.name, schema: PaymentSchema}]),
        MongooseModule.forFeature([{name: Booking.name, schema: BookingSchema}]),
        PropertyModule,
        UserModule,
    ],
    controllers:[PaymentController],
    providers:[PaystackService, PaymentService, AuthService, TokenService]

})
export class PaymentModule{}
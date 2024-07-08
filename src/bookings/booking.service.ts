import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking } from "src/schemas/booking.schema";
import { Property, PropertyDocument } from "src/schemas/property.schema";
import { BookingRequestDto } from "./dto/BookingRequest.dto";
import { UserDocument } from "src/schemas/user.schema";


@Injectable()
export class BookingService{
    constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>, @InjectModel(Property.name) private propertyModel: Model<PropertyDocument> ){}

  //create booking request
  async createBooking(
    createBookingDto: BookingRequestDto,
    tenant: UserDocument,
  ): Promise<Booking> {
    const { property, startDate, endDate, transactionType } = createBookingDto;

    //check if the property exists and is available
    const propertyDoc = await this.propertyModel.findById(property);
    if (!propertyDoc) {
      throw new BadRequestException('Property does not exist');
    }

    if (!propertyDoc.isAvailable) {
      throw new BadRequestException('Property is unavailable');
    }

    //check if the property type matches the transaction type
    if (
      (transactionType === 'Rent' && propertyDoc.type !== 'Rent') ||
      (transactionType === 'Purchase' && propertyDoc.type !== 'Sale')
    ) {
      throw new BadRequestException(
        'Invalid transaction type for this property',
      );
    }

    //validate dates for rental transactions
    if (transactionType === 'Rent') {
      if (!startDate || !endDate) {
        throw new BadRequestException(
          'Start date and end date are required for rentals',
        );
      }
    }

    //check if the tenant already has a booking for this property
    const existingBooking = await this.bookingModel.findOne({
      tenant: tenant._id,
      property,
    });

    if (existingBooking) {
      throw new BadRequestException(
        'You have already requested to rent or purchase this property',
      );
    }

    //create booking
    const booking = new this.bookingModel({
      tenant: tenant._id,
      property,
      startDate,
      endDate,
      transactionType,
      status: 'Pending',
      dateRequested: new Date(),
    });

    await booking.save();

    return booking;
  }

    //get all booking request
  async getAllProperty(){
    return await this.propertyModel.find()
  }
}

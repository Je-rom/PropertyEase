import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { Booking } from 'src/schemas/booking.schema';
import { Property, PropertyDocument } from 'src/schemas/property.schema';
import { BookingRequestDto } from './dto/BookingRequest.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { updateBookingDto } from 'src/bookings/dto/UpdateBookingRequest.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  //create booking request
  async createBooking(
    createBookingDto: BookingRequestDto,
    tenant: UserDocument,
  ): Promise<Booking> {
    const { property, checkInDate, checkOutDate, transactionType } = createBookingDto;

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
      if (!checkInDate || !checkOutDate) {
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
      checkInDate,
      checkOutDate,
      transactionType,
      status: 'Pending',
      dateRequested: new Date(),
    });

    await booking.save();

    return booking;
  }

  //get all booking request
  getAllBookings(): Query<Booking[], Booking> {
    return this.bookingModel.find();
  }

  //get bookings for a user
  getBookingsForUser(userId: string): Query<Booking[], Booking> {
    console.log(userId)
    const booking = this.bookingModel.find({
      tenant: new Types.ObjectId(userId),
    });
    return booking;
  }

  //delete bookings
  async deleteBookingForUser(bookingId: string, userId: string) {
    //check for booking Id
    const tenantBookingId = await this.bookingModel.findById(bookingId);
    if (!tenantBookingId) {
      throw new NotFoundException('Booking not found');
    }

    if (tenantBookingId.tenant.toString() !== userId) {
      throw new UnauthorizedException(
        'This is not your booking, You do not have permission to delete this booking',
      );
    }

    await this.bookingModel.findByIdAndDelete(tenantBookingId);
    return { message: 'Booking deleted successfully' };
  }

  //update bookings
  async updateBookingsForUser(
    updateBookingDto: updateBookingDto,
    bookingId: string,
    userId: string,
  ): Promise<Booking> {
    //check for booking Id
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.tenant.toString() !== userId) {
      throw new UnauthorizedException(
        'This is not your booking, You do not have permission to update this booking',
      );
    }

    //fetch the associated property
    const property = await this.propertyModel.findById(booking.property);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    //validate the transactionType
    if (updateBookingDto.transactionType) {
      if (
        (updateBookingDto.transactionType === 'Rent' &&
          property.type !== 'Rent') ||
        (updateBookingDto.transactionType === 'Purchase' &&
          property.type !== 'Sale')
      ) {
        throw new BadRequestException(
          'Invalid transaction type for this property',
        );
      }
    }

    //update the property fields with the provided data
    Object.assign(booking, updateBookingDto);
    await booking.save();
    return booking;
  }

  async approveBooking(bookingId: string): Promise<Booking> {
    console.log(`Approving booking with ID: ${bookingId}`);
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      console.error('Booking not found');
      throw new NotFoundException('Booking not found');
    }
    if (booking.status !== 'Pending') {
      console.error('Booking is not pending');
      throw new BadRequestException('Booking is not pending');
    }
    booking.status = 'Approved';
    console.log('Booking status set to Approved');
    const savedBooking = await booking.save();
    console.log('Booking saved:', savedBooking);
    return savedBooking;
  }

  async rejectBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.status !== 'Pending') {
      throw new BadRequestException('Booking is not pending');
    }
    booking.status = 'Rejected';
    return booking.save();
  }
}

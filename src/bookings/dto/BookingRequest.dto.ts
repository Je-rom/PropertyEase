import { Types } from 'mongoose';
import { IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class BookingRequestDto {
  @IsNotEmpty()
  propertyId: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  checkInDate: Date;

  @IsOptional()
  @IsDateString()
  checkOutDate: Date;

  @IsNotEmpty()
  @IsEnum(['Rent', 'Purchase'])
  transactionType: string;

  @IsNotEmpty({ message: 'An Amount is required' })
  amount: number;
}

import { Types } from 'mongoose';
import { IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class BookingRequestDto {
  @IsNotEmpty()
  property: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsEnum(['Rent', 'Purchase'])
  transactionType: string;
}

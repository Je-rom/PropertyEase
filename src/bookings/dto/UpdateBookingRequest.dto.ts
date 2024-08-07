import { Types } from 'mongoose';
import { IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class updateBookingDto {
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(['Rent', 'Purchase'])
  transactionType: string;
}

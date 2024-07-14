import { IsEnum, IsMongoId, IsNumber, IsNotEmpty, IsEmail } from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  booking: string;

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(['Card','BankTransfer', 'USSD', 'MobileMoney', 'QR'])
  @IsNotEmpty()
  method: string;
}

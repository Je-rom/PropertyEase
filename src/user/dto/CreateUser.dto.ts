import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please input a name' })
  @Length(5, 50, { message: 'Name must be between 5 and 50 characters' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Please input your email address' })
  @IsEmail({}, { message: 'Please input a valid email' })
  @IsString()
  email: string;

  @IsEnum(['PropertyOwner', 'Tenant'], {
    message: 'You can be either a PropertyOwner or a Tenant',
  })
  @IsString()
  role: string;

  @IsPhoneNumber()
  phoneNumber: number;

  @IsNotEmpty({ message: 'Please input your password' })
  @Length(8, undefined, { message: 'Password must be at least 8 characters' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Confirm Password is required' })
  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Bank account number is required for PropertyOwner' })
  bankAccountNumber?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Bank code is required for PropertyOwner' })
  bankCode?: number;
}

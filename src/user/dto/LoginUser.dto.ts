import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Please input your email address' })
  @IsEmail({}, { message: 'Please input a valid email' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Please input your password' })
  @Length(8, undefined, { message: 'Password must be at least 8 characters' })
  @IsString()
  password: string;
}

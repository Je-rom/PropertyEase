import { Prop } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';

export class updatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}

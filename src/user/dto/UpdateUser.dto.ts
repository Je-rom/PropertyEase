import { Prop } from '@nestjs/mongoose';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class updateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phoneNumber: number;

  @Prop()
  profilePicture: string;
}

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Please input the property title' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Please give the property a description' })
  description: string;

  @IsNotEmpty({
    message: 'Please specify whether the property is for Rent or Sale',
  })
  @IsEnum(['Rent', 'Sale'])
  type: 'Rent' | 'Sale';

  @IsNotEmpty({ message: 'Please add the price of the property' })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discount?: number;

  @IsArray({ message: 'Amenities must be an array of strings' })
  @IsNotEmpty({
    message: 'Please input the various amenities of your property',
  })
  @IsString({ each: true })
  amenities: string[];

  @IsString()
  @IsNotEmpty({ message: 'Please input the location of the property' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add a cover image of the property' })
  coverImage: string;

  @ArrayMaxSize(8, { message: 'You can add up to 8 images' })
  image: string;

  @IsNotEmpty({ message: 'Please give a availability status of the property' })
  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  geolocation: { latitude: number; longitude: number };

  @Type(() => Date)
  dateListed: Date;
}

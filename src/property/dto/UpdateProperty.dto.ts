import { Type } from 'class-transformer';
import {
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

export class UpdatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Please input the property title' })
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Please give the property a description' })
  @IsOptional()
  description: string;

  @IsNotEmpty({
    message: 'Please specify whether the property is for Rent or Sale',
  })
  @IsEnum(['Rent', 'Sale'])
  @IsOptional()
  type: 'Rent' | 'Sale';

  @IsNotEmpty({ message: 'Please add the price of the property' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @IsOptional()
  discount: number;

  @IsArray({ message: 'Amenities must be an array of strings' })
  @IsNotEmpty({
    message: 'Please input the various amenities of your property',
  })
  @IsString({ each: true })
  @IsOptional()
  amenities: string[];

  @IsString()
  @IsNotEmpty({ message: 'Please input the location of the property' })
  @IsOptional()
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add a cover image of the property' })
  @IsOptional()
  coverImage: string;

  @IsArray({ message: 'Images must be an array of strings' })
  @IsNotEmpty({ message: 'Please add an image or images of the property' })
  @IsString({ each: true })
  @IsOptional()
  image: string[];

  @IsNotEmpty({ message: 'Please give a availability status of the property' })
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsOptional()
  geolocation: { latitude: number; longitude: number };

  @IsNotEmpty({ message: 'Please input the available date ' })
  @Type(() => Date)
  @IsOptional()
  dateListed: Date;
}

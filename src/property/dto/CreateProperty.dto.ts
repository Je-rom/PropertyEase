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

  export class CreatePropertyDto{
    @IsString()
    @IsNotEmpty({ message: 'Please input the property title' })
    title: string

    @IsString()
    @IsNotEmpty({ message: 'Please give the property a description' })
    description: string

    @IsNotEmpty({ message: 'Please specify whether the property is for Rent or Sale' })
    @IsEnum(['Rent', 'Sale'])
    type: 'Rent' | 'Sale';

    @IsNotEmpty({ message: 'Please add the price of the property' })
    @IsNumber()
    @Type(() => Number)
    price: number
    
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    discount: number

    @IsArray({ message: 'Amenities must be an array of strings' })  // Use IsArray decorator
    @IsNotEmpty({ message: 'Please input the various amenities of your property' })
    @IsString({ each: true })  // Validate each item in the array as string
    amenities: string[];

    @IsString()
    @IsNotEmpty({ message: 'Please input the location of the property' })
    location: string

    @IsString()
    @IsNotEmpty({ message: 'Please add a cover image of the property' })
    coverImage: string

    @IsArray({ message: 'Images must be an array of strings' })  // Use IsArray decorator
    @IsNotEmpty({ message: 'Please add an image or images of the property' })
    @IsString({ each: true })  // Validate each item in the array as string
    image: string[];

    @IsNotEmpty({ message: 'Please give a availability status of the property' })
    @IsBoolean()
    isAvailable: boolean;

    @IsOptional()
    geolocation: {latitude: number; longitude: number};

    @IsNotEmpty({ message: 'Please input the available date ' })
    @Type(() => Date)
    dateListed: Date;
  }
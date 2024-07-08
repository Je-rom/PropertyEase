import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from 'src/schemas/property.schema';
import { CreatePropertyDto } from './dto/CreateProperty.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { UpdatePropertyDto } from './dto/UpdateProperty.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  //create properties
  async createProperty(
    createPropertyDto: CreatePropertyDto,
    user: UserDocument,
  ): Promise<Property> {
    if (user.role !== 'PropertyOwner') {
      throw new UnauthorizedException(
        'Only property owners can create properties',
      );
    }
    const newProperty = await new this.propertyModel({
      ...createPropertyDto,
      owner: user._id,
    });
    return newProperty.save();
  }

  //update propeties
  async updateProperty(
    propertyId: string,
    UpdatePropertyDto: UpdatePropertyDto,
    user: UserDocument,
  ): Promise<Property> {
    if (user.role !== 'PropertyOwner') {
      throw new UnauthorizedException(
        'Only property owners can update properties',
      );
    }

    //find property by ID
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner.toString() !== user._id.toString()) {
      throw new UnauthorizedException('You are not the owner of this property');
    }

    //update the property fields with the  data
    Object.assign(property, UpdatePropertyDto);

    await property.save();

    return property;
  }

  //get all properties
  async getProperties() {
    return await this.propertyModel.find();
  }

  //delete property
  async deleteProperty(propertyId: string) {
    return await this.propertyModel.findByIdAndDelete(propertyId);
  }

  //delete property by user id
  // async deletePropertiesByUserId(userId: string) {
  //   return await this.propertyModel.deleteMany({ userId });
  // }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
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
  getProperties(): Query<PropertyDocument[], PropertyDocument> {
    return this.propertyModel.find();
  }

  //get properties for a user
  async getPropertyForUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      console.error('Invalid ObjectId:', userId);
      return [];
    }
    const property = await this.propertyModel.find({
      owner: new Types.ObjectId(userId),
    });
    if (!property || property.length === 0) {
      throw new NotFoundException('No Property found for this user');
    } else {
      return property;
    }
  }

  //delete property
  async deleteProperty(propertyId: string) {
    return await this.propertyModel.findByIdAndDelete(propertyId);
  }

  //delete property for a user
  async deletePropertyForUser(userId: string, propertyId: string) {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(propertyId)
    ) {
      throw new Error('Invalid ObjectId');
    }

    const result = await this.propertyModel.deleteOne({
      _id: new Types.ObjectId(propertyId),
      propertyowner: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new Error('Property not found or not owned by user');
    }

    return { message: 'Property deleted successfully' };
  }
}

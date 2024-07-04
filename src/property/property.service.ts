import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Property, PropertyDocument } from "src/schemas/property.schema";
import { CreatePropertyDto } from "./dto/CreateProperty.dto";
import { UserDocument } from "src/schemas/user.schema";


@Injectable()
export class PropertyService{
    constructor(@InjectModel(Property.name) private propertyModel: Model<PropertyDocument>){}

    async createProperty(createPropertyDto: CreatePropertyDto, user: UserDocument): Promise<Property> {
        if (user.role !== 'PropertyOwner') {
          throw new UnauthorizedException('Only property owners can create properties');
        }
        const newProperty = new this.propertyModel({
          ...createPropertyDto,
          owner: user._id,
        });
        return newProperty.save();
      }
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document; //typeScript type that combines the properties of your User class with those of Mongoose's Document interface

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: number;

  @Prop({
    required: true,
    enum: ['PropertyOwner', 'Tenant'],
    default: 'Tenant',
  })
  role: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ select: false })
  confirmPassword: string;

  @Prop()
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function (next) {
  const user = this as UserDocument;
  if (user.isModified('password') || user.isNew) {
    if (user.password !== user.confirmPassword) {
      console.log('Passwords do not match');
      return next(new Error('Passwords do not match.'));
    }
  }
  user.confirmPassword = undefined;
  next();
});

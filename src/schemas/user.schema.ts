import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';

export interface UserDocument extends Document {
  name: string;
  email: string;
  phoneNumber: number;
  role: string;
  password: string;
  confirmPassword: string;
  photo?: string;
  correctPassword(
    enteredPassword: string,
    userPassword: string,
  ): Promise<boolean>;
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: number;

  @Prop({
    enum: ['PropertyOwner', 'Tenant'],
    default: 'Tenant',
  })
  role: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    required: true,
    select: false,
    validate: {
      validator: function (e: string) {
        return e === this.password;
      },
      message: 'Confirm password does not match with the password',
    },
  })
  confirmPassword: string;

  @Prop()
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//hash password
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

//check if password correct when singing in
UserSchema.methods.correctPassword = async function (
  enteredPassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, userPassword);
};

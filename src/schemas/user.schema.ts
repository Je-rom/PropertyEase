import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';
import * as crypto from 'crypto';

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
  changedPasswordAfter(JWTTimestamp: number): boolean;
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
    enum: ['PropertyOwner', 'Tenant'], required:true
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
  profilePicture: string;

  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;
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

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});


//check if password was changed after the token was issued
UserSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

//create password reset token
UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
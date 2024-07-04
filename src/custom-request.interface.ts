import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';

export interface CustomRequest extends Request {
  user: UserDocument;
}

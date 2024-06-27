import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  signToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  createSendToken(user: any, statusCode: number, res: any): void {
    const jwtToken = this.signToken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
      cookieOptions['secure'] = true;
    }
    res.cookie('jwt', jwtToken, cookieOptions);

    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      jwtToken,
      data: {
        user,
      },
    });
  }
}

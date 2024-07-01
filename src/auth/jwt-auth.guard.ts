import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    let decodedToken;
    try {
      decodedToken = this.authService.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.id;
    //check if the user with the token still exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //check if user changed password after the token was issued
    if(user.changedPasswordAfter(decodedToken.iat)){
      throw new UnauthorizedException('User recently changed password! Please log in again.')
    }
  
    request.user = user
  }

  private extractJwtFromRequest(request: any): string | null {
    if (
      request.headers.authorization &&
      request.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return request.headers.authorization.split(' ')[1];
    }
    return null;
  }
}

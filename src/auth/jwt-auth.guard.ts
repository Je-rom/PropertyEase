import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: userService,
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
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //check if user changed password after the token was issued
    

    return user;
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

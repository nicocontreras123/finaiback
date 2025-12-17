import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    console.log('🔐 Auth header:', authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : 'No auth header');

    if (!authHeader) {
      console.error('❌ No authorization header');
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const user = await this.authService.verifyToken(token);

      if (!user) {
        console.error('❌ Invalid token - user is null');
        throw new UnauthorizedException('Invalid token');
      }

      console.log('✅ User authenticated:', user.email);
      request.user = user;
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthRequest } from '../types/auth-request.type';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // Ensure user is authenticated and has "admin" role
    if (request.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can perform this action');
    }

    return true;
  }
}

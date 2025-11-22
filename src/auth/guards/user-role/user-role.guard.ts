import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUTH_ERROR_MESSAGES, META_ROLES } from 'src/auth/constants';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<{ user: User }>();

    if (!req.user)
      throw new BadRequestException(AUTH_ERROR_MESSAGES.USER_NOT_FOUND_GUARD);
    //Para acceder a la meta data del controlador
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (!validRoles.includes(req.user.role))
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.VALID_ROLE);

    return true;
  }
}

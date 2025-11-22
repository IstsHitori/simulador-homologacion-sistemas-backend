import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AUTH_ERROR_MESSAGES } from '../constants';

//Decorador de parametro
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user: User }>();

  if (!req.user)
    throw new InternalServerErrorException(
      AUTH_ERROR_MESSAGES.USER_NOT_FOUND_GUARD,
    );
  if (data) {
    return { email: req.user.email };
  }

  return req.user;
});

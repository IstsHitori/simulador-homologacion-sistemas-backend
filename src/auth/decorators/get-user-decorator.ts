import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AUTH_ERROR_MESSAGES } from '../constants';
import { User } from 'src/user/entities/user.entity';

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

import { IsString, MinLength } from 'class-validator';
import { AUTH_MESSAGES } from '../constants';

export class LoginUserDto {
  @IsString({ message: AUTH_MESSAGES.USERNAME_IS_STRING })
  @MinLength(1, { message: AUTH_MESSAGES.USERNAME_MIN_LENGTH })
  userName: string;
  @IsString({ message: AUTH_MESSAGES.PASSWORD_IS_STRING })
  @MinLength(1, { message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH })
  password: string;
}

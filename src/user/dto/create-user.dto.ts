import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ROLE } from '../constants/role';
import { USER_MESSAGES } from '../constants';
export class CreateUserDto {
  @IsString({ message: USER_MESSAGES.NAME_IS_STRING })
  @MinLength(3, { message: USER_MESSAGES.NAME_MIN_LENGTH })
  @MaxLength(40, { message: USER_MESSAGES.NAME_MAX_LENGTH })
  fullName: string;

  @IsString({ message: USER_MESSAGES.USERNAME_IS_STRING })
  @MinLength(4, { message: USER_MESSAGES.USERNAME_MIN_LENGTH })
  @MaxLength(10, { message: USER_MESSAGES.USERNAME_MAX_LENGTH })
  userName: string;

  @IsString({ message: USER_MESSAGES.PASSWORD_IS_STRING })
  @MinLength(6, { message: USER_MESSAGES.PASSWORD_MIN_LENGTH })
  @MaxLength(20, { message: USER_MESSAGES.PASSWORD_MAX_LENGTH })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/, {
    message: USER_MESSAGES.PASSWORD_MATCH,
  })
  password: string;

  @IsEmail({}, { message: USER_MESSAGES.EMAIL_IS_EMAIL })
  @MaxLength(100, { message: USER_MESSAGES.EMAIL_MAX_LENGTH })
  email: string;

  @IsEnum(ROLE, { message: USER_MESSAGES.ROLE_IS_ENUM })
  role: ROLE;
}

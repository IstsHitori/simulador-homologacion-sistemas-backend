import { PartialType } from '@nestjs/mapped-types';

import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { USER_MESSAGES } from 'src/user/constants';

class ProfileDto {
  @IsString({ message: USER_MESSAGES.NAME_IS_STRING })
  @MinLength(3, { message: USER_MESSAGES.NAME_MIN_LENGTH })
  @MaxLength(40, { message: USER_MESSAGES.NAME_MAX_LENGTH })
  fullName: string;

  @IsString({ message: USER_MESSAGES.USERNAME_IS_STRING })
  @MinLength(4, { message: USER_MESSAGES.USERNAME_MIN_LENGTH })
  @MaxLength(10, { message: USER_MESSAGES.USERNAME_MAX_LENGTH })
  userName: string;

  @IsEmail({}, { message: USER_MESSAGES.EMAIL_IS_EMAIL })
  @MaxLength(100, { message: USER_MESSAGES.EMAIL_MAX_LENGTH })
  email: string;
}

export class UpdateProfileDto extends PartialType(ProfileDto) {}

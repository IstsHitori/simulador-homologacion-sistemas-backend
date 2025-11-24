import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { USER_MESSAGES } from 'src/user/constants';

export class PasswordDto {
  @IsString({ message: USER_MESSAGES.PASSWORD_IS_STRING })
  @MinLength(6, { message: USER_MESSAGES.PASSWORD_MIN_LENGTH })
  @MaxLength(20, { message: USER_MESSAGES.PASSWORD_MAX_LENGTH })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/, {
    message: USER_MESSAGES.PASSWORD_MATCH,
  })
  password: string;
}

export class UpdatePasswordDto extends PartialType(PasswordDto) {}

import {
  IsOptional,
  IsString,
  Length,
  IsEmail,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { META_GENDERS } from '../constants';
import { VALIDATION_MESSAGES } from '../constants/error-messages';

export class UpdateStudentDataDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.IDENTIFICATION_STRING })
  @Length(1, 11, { message: VALIDATION_MESSAGES.IDENTIFICATION_LENGTH })
  identification?: string;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_VALID })
  @Length(1, 100, { message: VALIDATION_MESSAGES.EMAIL_LENGTH })
  email?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.NAMES_STRING })
  @Length(1, 40, { message: VALIDATION_MESSAGES.NAMES_LENGTH })
  names?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.LASTNAMES_STRING })
  @Length(1, 40, { message: VALIDATION_MESSAGES.LASTNAMES_LENGTH })
  lastNames?: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.SEMESTER_NUMBER })
  @Min(1, { message: VALIDATION_MESSAGES.SEMESTER_MIN })
  @Max(10, { message: VALIDATION_MESSAGES.SEMESTER_MAX })
  semester: number;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.CITY_STRING })
  @Length(1, 20, { message: VALIDATION_MESSAGES.CITY_LENGTH })
  cityResidence?: string;

  @IsOptional()
  @IsEnum(META_GENDERS, { message: VALIDATION_MESSAGES.GENDER_VALID })
  gender?: META_GENDERS;
}

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { META_GENDERS } from '../constants';
import { VALIDATION_MESSAGES } from '../constants/error-messages';

export class CreateStudentDto {
  @IsString({ message: VALIDATION_MESSAGES.IDENTIFICATION_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IDENTIFICATION_REQUIRED })
  @Length(1, 11, { message: VALIDATION_MESSAGES.IDENTIFICATION_LENGTH })
  identification: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_VALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  @Length(1, 100, { message: VALIDATION_MESSAGES.EMAIL_LENGTH })
  email: string;

  @IsString({ message: VALIDATION_MESSAGES.NAMES_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.NAMES_REQUIRED })
  @Length(1, 40, { message: VALIDATION_MESSAGES.NAMES_LENGTH })
  names: string;

  @IsString({ message: VALIDATION_MESSAGES.LASTNAMES_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.LASTNAMES_REQUIRED })
  @Length(1, 40, { message: VALIDATION_MESSAGES.LASTNAMES_LENGTH })
  lastNames: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.SEMESTER_REQUIRED })
  @IsNumber({}, { message: VALIDATION_MESSAGES.SEMESTER_NUMBER })
  @Min(1, { message: VALIDATION_MESSAGES.SEMESTER_MIN })
  @Max(10, { message: VALIDATION_MESSAGES.SEMESTER_MAX })
  semester: number;

  @IsString({ message: VALIDATION_MESSAGES.CITY_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.CITY_REQUIRED })
  @Length(1, 20, { message: VALIDATION_MESSAGES.CITY_LENGTH })
  cityResidence: string;

  @IsString({ message: VALIDATION_MESSAGES.ADDRESS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.ADDRESS_REQUIRED })
  @Length(1, 20, { message: VALIDATION_MESSAGES.ADDRESS_LENGTH })
  address: string;

  @IsString({ message: VALIDATION_MESSAGES.TELEPHONE_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.TELEPHONE_REQUIRED })
  @Length(1, 10, { message: VALIDATION_MESSAGES.TELEPHONE_LENGTH })
  telephone: string;

  @IsEnum(META_GENDERS, { message: VALIDATION_MESSAGES.GENDER_VALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.GENDER_REQUIRED })
  gender: META_GENDERS;
}

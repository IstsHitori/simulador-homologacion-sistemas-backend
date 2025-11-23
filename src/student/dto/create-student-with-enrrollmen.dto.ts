import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CreateStudentDto } from './create-student.dto';
import { VALIDATION_MESSAGES } from '../constants/error-messages';
import { Type } from 'class-transformer';

export class ApprovedSubjecItemtDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.APPROVED_SUBJECTS_ID_NUMBER })
  approvedSubjectVersionId: number;
}

export class CreateStudentWithEnrollmentDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.STUDENT_DATA_REQUIRED })
  @ValidateNested({ message: VALIDATION_MESSAGES.STUDENT_DATA_INCORRECT })
  @Type(() => CreateStudentDto)
  studentData: CreateStudentDto;

  @ValidateNested({ each: true })
  @Type(() => ApprovedSubjecItemtDto)
  @IsArray({ message: VALIDATION_MESSAGES.APPROVED_SUBJECTS_ARRAY })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.APPROVED_SUBJECTS_REQUIRED })
  approvedSubjects: ApprovedSubjecItemtDto[];
}

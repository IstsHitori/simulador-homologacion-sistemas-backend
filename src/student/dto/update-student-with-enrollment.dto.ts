import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION_MESSAGES } from '../constants/error-messages';
import { UpdateStudentDataDto } from '.';

export class UpdateApprovedSubjectDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.APPROVED_SUBJECTS_ID_NUMBER })
  approvedSubjectVersionId: number;
}

export class UpdateStudentWithEnrollmentDto {
  @IsOptional()
  @ValidateNested({ message: VALIDATION_MESSAGES.STUDENT_DATA_INCORRECT })
  @Type(() => UpdateStudentDataDto)
  studentData?: UpdateStudentDataDto;

  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGES.APPROVED_SUBJECTS_ARRAY })
  @ValidateNested({ each: true })
  @Type(() => UpdateApprovedSubjectDto)
  @ArrayMinSize(0)
  approvedSubjects?: UpdateApprovedSubjectDto[];
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentApprovedSubject } from './entities/student-approved-subject.entity';
import { SubjectVersion } from 'src/curriculum/entities';

@Module({
  imports: [TypeOrmModule.forFeature([StudentApprovedSubject, SubjectVersion])],
})
export class EnrollmentModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentApprovedSubject } from './entities/student-approved-subject.entity';
import { SubjectVersion } from 'src/curriculum/entities';
import { StudentApprovedSubjectService } from './services/student-approved-subject.service';
import { CurriculumModule } from 'src/curriculum/curriculum.module';

@Module({
  providers: [StudentApprovedSubjectService],
  imports: [
    TypeOrmModule.forFeature([StudentApprovedSubject, SubjectVersion]),
    CurriculumModule,
  ],
  exports: [StudentApprovedSubjectService],
})
export class EnrollmentModule {}

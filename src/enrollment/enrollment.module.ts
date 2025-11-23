import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentApprovedSubject } from './entities/student-approved-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentApprovedSubject])],
})
export class EnrollmentModule {}

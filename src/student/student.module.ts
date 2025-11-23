import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { HomologationModule } from 'src/homologation/homologation.module';
import { CurriculumModule } from 'src/curriculum/curriculum.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    TypeOrmModule.forFeature([Student]),
    EnrollmentModule,
    HomologationModule,
    CurriculumModule,
  ],
})
export class StudentModule {}

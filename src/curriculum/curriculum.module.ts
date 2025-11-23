import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area, Equivalence, Plan, SubjectVersion } from './entities';
import { SubjectVersionService } from './services/subject-version.service';

@Module({
  providers: [SubjectVersionService],
  imports: [
    TypeOrmModule.forFeature([Plan, Area, Equivalence, SubjectVersion]),
  ],
  exports: [SubjectVersionService],
})
export class CurriculumModule {}

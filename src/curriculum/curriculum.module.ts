import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area, Equivalence, Plan, SubjectVersion } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, Area, Equivalence, SubjectVersion]),
  ],
})
export class CurriculumModule {}

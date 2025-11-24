import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area, Equivalence, Plan, SubjectVersion } from './entities';
import { SubjectVersionService } from './services/subject-version.service';

import { AuthModule } from 'src/auth/auth.module';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';

@Module({
  controllers: [PlanController],
  providers: [SubjectVersionService, PlanService],
  imports: [
    TypeOrmModule.forFeature([Plan, Area, Equivalence, SubjectVersion]),
    AuthModule,
  ],
  exports: [SubjectVersionService],
})
export class CurriculumModule {}

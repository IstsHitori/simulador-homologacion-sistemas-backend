import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area, Equivalence, Plan, SubjectVersion } from './entities';
import { SubjectVersionService } from './services/subject-version.service';
import { SubjectVersionController } from './controllers/subject-version.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SubjectVersionController],
  providers: [SubjectVersionService],
  imports: [
    TypeOrmModule.forFeature([Plan, Area, Equivalence, SubjectVersion]),
    AuthModule,
  ],
  exports: [SubjectVersionService],
})
export class CurriculumModule {}

import { Module } from '@nestjs/common';
import { HomologationService } from './homologation.service';
import { Equivalence, Plan, SubjectVersion } from 'src/curriculum/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [HomologationService],
  exports: [HomologationService],
  imports: [TypeOrmModule.forFeature([Equivalence, Plan, SubjectVersion])],
})
export class HomologationModule {}

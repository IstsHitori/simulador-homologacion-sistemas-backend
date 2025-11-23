import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import {
  Area,
  Equivalence,
  Plan,
  SubjectVersion,
} from 'src/curriculum/entities';

@Module({
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([User, Plan, Area, SubjectVersion, Equivalence]),
    ConfigModule,
    CommonModule,
  ],
})
export class SeedModule {}

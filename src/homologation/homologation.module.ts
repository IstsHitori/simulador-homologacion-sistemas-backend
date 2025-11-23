import { Module } from '@nestjs/common';
import { HomologationService } from './homologation.service';

@Module({
  providers: [HomologationService],
  exports: [HomologationService],
})
export class HomologationModule {}

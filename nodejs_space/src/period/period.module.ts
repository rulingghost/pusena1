import { Module } from '@nestjs/common';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';
import { FertilityService } from './fertility.service';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService, FertilityService],
  exports: [PeriodService, FertilityService],
})
export class PeriodModule {}

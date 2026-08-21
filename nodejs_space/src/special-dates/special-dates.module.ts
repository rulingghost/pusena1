import { Module } from '@nestjs/common';
import { SpecialDatesController } from './special-dates.controller';
import { SpecialDatesService } from './special-dates.service';

@Module({
  controllers: [SpecialDatesController],
  providers: [SpecialDatesService],
})
export class SpecialDatesModule {}

import { Module } from '@nestjs/common';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { PartnerGuideService } from './partner-guide.service';
import { CoupleLiveService } from './couple-live.service';

@Module({
  controllers: [RelationshipController],
  providers: [RelationshipService, PartnerGuideService, CoupleLiveService],
  exports: [RelationshipService, PartnerGuideService, CoupleLiveService],
})
export class RelationshipModule {}

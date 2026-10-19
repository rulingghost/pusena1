import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { RelationshipService } from './relationship.service';
import { PartnerGuideService } from './partner-guide.service';
import { CoupleLiveService } from './couple-live.service';
import { CreateRelationshipDto, UpdateRelationshipDto, RelationshipResponseDto, PairPartnerDto, PartnerInfoDto, AnswerCoupleQuestionDto, LocationUpdateDto, SendNudgeDto, CoupleChatDto } from './dto/relationship.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Relationship')
@Controller('api/relationship')
@UseGuards(JwtAuthGuard)
export class RelationshipController {
  constructor(
    private readonly relationshipService: RelationshipService,
    private readonly partnerGuideService: PartnerGuideService,
    private readonly coupleLive: CoupleLiveService,
  ) {}

  @Get('partner-guide')
  async getPartnerGuide(@Req() req: Request) {
    return this.partnerGuideService.getPartnerGuide((req as any).user.id);
  }

  @Get('live/location')
  async getLocation(@Req() req: Request) {
    return this.coupleLive.getLocation((req as any).user.id);
  }

  @Post('live/location')
  async upsertLocation(@Req() req: Request, @Body() dto: LocationUpdateDto) {
    return this.coupleLive.upsertLocation((req as any).user.id, dto);
  }

  @Get('live/nudges')
  async listNudges(@Req() req: Request) {
    return this.coupleLive.listNudges((req as any).user.id);
  }

  @Post('live/nudges')
  async sendNudge(@Req() req: Request, @Body() dto: SendNudgeDto) {
    return this.coupleLive.sendNudge((req as any).user.id, dto.type, dto.comment);
  }

  @Post('live/nudges/:nudgeId/to-chat')
  async transferNudgeToChat(@Req() req: Request, @Param('nudgeId') nudgeId: string) {
    return this.coupleLive.transferNudgeToChat((req as any).user.id, nudgeId);
  }

  @Post('live/nudges/:nudgeId/reply')
  async replyNudge(@Req() req: Request, @Param('nudgeId') nudgeId: string, @Body() dto: CoupleChatDto) {
    return this.coupleLive.replyNudge((req as any).user.id, nudgeId, dto.body);
  }

  @Delete('live/nudges/:nudgeId')
  async deleteNudge(@Req() req: Request, @Param('nudgeId') nudgeId: string) {
    return this.coupleLive.deleteNudge((req as any).user.id, nudgeId);
  }

  @Get('live/messages')
  async listMessages(@Req() req: Request) {
    return this.coupleLive.listMessages((req as any).user.id);
  }

  @Post('live/messages')
  async sendMessage(@Req() req: Request, @Body() dto: CoupleChatDto) {
    return this.coupleLive.sendMessage((req as any).user.id, dto.body, dto.nudgeId, dto.kind);
  }

  @Get('couple-questions')
  async getCoupleQuestions(@Req() req: Request) {
    return this.relationshipService.getCoupleQuestions((req as any).user.id);
  }

  @Post('couple-questions/:questionId')
  async saveCoupleAnswer(
    @Req() req: Request,
    @Param('questionId') questionId: string,
    @Body() dto: AnswerCoupleQuestionDto,
  ) {
    return this.relationshipService.saveCoupleAnswer((req as any).user.id, questionId, dto.answer);
  }

  @Get('partner-info')
  async getPartnerInfo(@Req() req: Request): Promise<PartnerInfoDto> {
    return this.relationshipService.getPartnerInfo((req as any).user.id);
  }

  @Post('lookup')
  async lookupPartner(@Req() req: Request, @Body() dto: PairPartnerDto) {
    return this.relationshipService.lookupPartner((req as any).user.id, dto.partnerCode);
  }

  @Post('pair')
  async pairPartner(@Req() req: Request, @Body() dto: PairPartnerDto): Promise<PartnerInfoDto> {
    return this.relationshipService.pairPartner((req as any).user.id, dto.partnerCode);
  }

  @Post('unpair')
  async unpair(@Req() req: Request) {
    return this.relationshipService.unpair((req as any).user.id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateRelationshipDto): Promise<RelationshipResponseDto> {
    return this.relationshipService.create((req as any).user.id, dto.startDate, dto.partnerName);
  }

  @Get()
  async get(@Req() req: Request): Promise<RelationshipResponseDto> {
    return this.relationshipService.get((req as any).user.id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateRelationshipDto): Promise<RelationshipResponseDto> {
    return this.relationshipService.update((req as any).user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<SuccessResponseDto> {
    return this.relationshipService.remove((req as any).user.id, id);
  }
}

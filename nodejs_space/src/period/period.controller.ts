import { Controller, Get, Post, Patch, Body, Req, Query, UseGuards, ParseIntPipe, DefaultValuePipe, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PeriodService } from './period.service';
import { FertilityService } from './fertility.service';
import { PeriodSetupDto, PeriodLogDto, StartPeriodDto, EndPeriodDto, PeriodSetupResponseDto, PeriodResponseDto, PeriodDayResponseDto, CalendarResponseDto, PeriodHistoryResponseDto, StartPeriodResponseDto, EndPeriodResponseDto } from './dto/period.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { localDateKey } from '../common/dates';

@ApiTags('Period')
@Controller('api/period')
@UseGuards(JwtAuthGuard)
export class PeriodController {
  constructor(
    private readonly periodService: PeriodService,
    private readonly fertilityService: FertilityService,
  ) {}

  @Get('fertility')
  async fertility(@Req() req: Request) {
    return this.fertilityService.getFertilityOverview((req as any).user.id);
  }

  @Post('setup')
  async setup(@Req() req: Request, @Body() dto: PeriodSetupDto): Promise<PeriodSetupResponseDto> {
    return this.periodService.setup((req as any).user.id, dto.lastPeriodStart, dto.cycleLength, dto.periodLength);
  }

  @Get()
  async get(@Req() req: Request): Promise<PeriodResponseDto> {
    return this.periodService.getPeriod((req as any).user.id);
  }

  @Post('log')
  async log(@Req() req: Request, @Body() dto: PeriodLogDto): Promise<PeriodDayResponseDto> {
    return this.periodService.logDay((req as any).user.id, dto.date, dto.flowLevel, dto.notes);
  }

  @Get('calendar')
  async calendar(
    @Req() req: Request,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  ): Promise<CalendarResponseDto> {
    const now = new Date();
    return this.periodService.getCalendar((req as any).user.id, month ?? now.getMonth() + 1, year ?? now.getFullYear());
  }

  @Get('history')
  async history(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<PeriodHistoryResponseDto> {
    return this.periodService.getHistory((req as any).user.id, page, limit);
  }

  @Post('start')
  async start(@Req() req: Request, @Body() dto: StartPeriodDto): Promise<StartPeriodResponseDto> {
    return this.periodService.startPeriod((req as any).user.id, dto.date);
  }

  @Post('end')
  async end(@Req() req: Request, @Body() dto: EndPeriodDto): Promise<EndPeriodResponseDto> {
    return this.periodService.endPeriod((req as any).user.id, dto.date);
  }

  @Patch('cycles/:cycleId/end')
  async endCycle(
    @Req() req: Request,
    @Param('cycleId') cycleId: string,
    @Body() dto: EndPeriodDto,
  ) {
    return this.periodService.endCycleById((req as any).user.id, cycleId, dto.date ?? localDateKey());
  }
}

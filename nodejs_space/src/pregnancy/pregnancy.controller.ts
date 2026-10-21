import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { PregnancyService } from './pregnancy.service';
import {
  CreatePregnancyDto,
  UpdatePregnancyDto,
  PregnancyResponseDto,
  CreatePregnancyResponseDto,
  WeekContentResponseDto,
  AllWeeksResponseDto,
  BabyNamesResponseDto,
  SetBabyNameDto,
} from './dto/pregnancy.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Pregnancy')
@Controller('api/pregnancy')
@UseGuards(JwtAuthGuard)
export class PregnancyController {
  constructor(private readonly pregnancyService: PregnancyService) {}

  @Post()
  @ApiOperation({ summary: 'Gebelik kaydı oluştur' })
  @ApiOkResponse({ type: CreatePregnancyResponseDto })
  async create(@Req() req: Request, @Body() dto: CreatePregnancyDto): Promise<CreatePregnancyResponseDto> {
    return this.pregnancyService.createPregnancy((req as any).user.id, dto.lastMenstrualPeriod, dto.babyName);
  }

  @Put()
  @ApiOperation({ summary: 'Gebelik kaydı güncelle' })
  @ApiOkResponse({ type: PregnancyResponseDto })
  async update(@Req() req: Request, @Body() dto: UpdatePregnancyDto): Promise<PregnancyResponseDto> {
    return this.pregnancyService.updatePregnancy((req as any).user.id, dto.lastMenstrualPeriod, dto.babyName);
  }

  @Post('baby-name')
  @ApiOperation({ summary: 'Bebek ismi belirle' })
  @ApiOkResponse({ type: PregnancyResponseDto })
  async setBabyName(@Req() req: Request, @Body() dto: SetBabyNameDto): Promise<PregnancyResponseDto> {
    return this.pregnancyService.setBabyName((req as any).user.id, dto.babyName);
  }

  @Get('baby-names')
  @ApiOperation({ summary: 'Bebek isimleri listesini getir' })
  @ApiQuery({ name: 'gender', required: false, enum: ['girl', 'boy', 'unisex', 'all'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ type: BabyNamesResponseDto })
  async getBabyNames(
    @Query('gender') gender?: string,
    @Query('search') search?: string,
  ): Promise<BabyNamesResponseDto> {
    return this.pregnancyService.getBabyNames(gender, search);
  }

  @Get()
  @ApiOperation({ summary: 'Mevcut aktif gebelik detaylarını getir' })
  @ApiOkResponse({ type: PregnancyResponseDto })
  async get(@Req() req: Request): Promise<PregnancyResponseDto | null> {
    return this.pregnancyService.getPregnancy((req as any).user.id);
  }

  @Post('postpartum/reminders')
  async postpartumReminders(@Req() req: Request, @Body() body: { birthDate?: string }) {
    return this.pregnancyService.syncPostpartumReminders((req as any).user.id, body?.birthDate || '');
  }

  @Delete()
  async remove(@Req() req: Request): Promise<SuccessResponseDto> {
    return this.pregnancyService.deletePregnancy((req as any).user.id);
  }

  @Get('weeks')
  async getAllWeeks(): Promise<AllWeeksResponseDto> {
    return this.pregnancyService.getAllWeeks();
  }

  @Get('weeks/:weekNumber')
  async getWeekContent(
    @Req() req: Request,
    @Param('weekNumber', ParseIntPipe) weekNumber: number,
  ): Promise<WeekContentResponseDto> {
    return this.pregnancyService.getWeekContent(weekNumber, (req as any).user?.id);
  }
}

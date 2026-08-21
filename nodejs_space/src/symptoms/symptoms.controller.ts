import { Controller, Get, Post, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { SymptomsService } from './symptoms.service';
import { CreateSymptomsDto, SymptomsResponseDto, SymptomTypesResponseDto, SymptomHistoryResponseDto } from './dto/symptoms.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Symptoms')
@Controller('api/symptoms')
@UseGuards(JwtAuthGuard)
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateSymptomsDto): Promise<SymptomsResponseDto> {
    return this.symptomsService.createSymptoms((req as any).user.id, dto.date, dto.symptoms);
  }

  @Get()
  async get(@Req() req: Request, @Query('date') date: string): Promise<SymptomsResponseDto> {
    return this.symptomsService.getSymptoms((req as any).user.id, date);
  }

  @Get('history')
  async getHistory(@Req() req: Request): Promise<SymptomHistoryResponseDto> {
    return this.symptomsService.getHistory((req as any).user.id);
  }

  @Delete(':id')
  async deleteSymptom(@Req() req: Request, @Param('id') id: string): Promise<SuccessResponseDto> {
    return this.symptomsService.deleteSymptom((req as any).user.id, id);
  }

  @Get('types')
  async getTypes(): Promise<SymptomTypesResponseDto> {
    return this.symptomsService.getSymptomTypes();
  }
}

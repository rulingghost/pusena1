import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { SpecialDatesService } from './special-dates.service';
import { CreateSpecialDateDto, UpdateSpecialDateDto, SpecialDateResponseDto, SpecialDatesListResponseDto } from './dto/special-dates.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Special Dates')
@Controller('api/special-dates')
@UseGuards(JwtAuthGuard)
export class SpecialDatesController {
  constructor(private readonly specialDatesService: SpecialDatesService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateSpecialDateDto): Promise<SpecialDateResponseDto> {
    return this.specialDatesService.create((req as any).user.id, dto);
  }

  @Get()
  async getAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<SpecialDatesListResponseDto> {
    return this.specialDatesService.getAll((req as any).user.id, page, limit);
  }

  @Get(':id')
  async getById(@Req() req: Request, @Param('id') id: string): Promise<SpecialDateResponseDto> {
    return this.specialDatesService.getById((req as any).user.id, id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateSpecialDateDto): Promise<SpecialDateResponseDto> {
    return this.specialDatesService.update((req as any).user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<SuccessResponseDto> {
    return this.specialDatesService.remove((req as any).user.id, id);
  }
}

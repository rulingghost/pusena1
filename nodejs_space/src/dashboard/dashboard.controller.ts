import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { DashboardService } from './dashboard.service';
import { InsightsService } from './insights.service';
import { DashboardResponseDto } from './dto/dashboard.dto';
import { InsightsResponseDto } from './dto/insights.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly insightsService: InsightsService,
  ) {}

  @Get()
  async getDashboard(@Req() req: Request): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard((req as any).user.id);
  }

  @Get('insights')
  async getInsights(@Req() req: Request): Promise<InsightsResponseDto> {
    return this.insightsService.getInsights((req as any).user.id);
  }
}

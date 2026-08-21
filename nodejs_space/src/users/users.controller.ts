import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { UsersService } from './users.service';
import {
  UpdateProfileDto, UserProfileResponseDto, PublicUserResponseDto,
  UpdateLanguageDto, SaveAssessmentDto, UpsertMemoryDto,
} from './dto/users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto): Promise<UserProfileResponseDto> {
    return this.usersService.updateProfile((req as any).user.id, dto);
  }

  @Patch('language')
  async setLanguage(@Req() req: Request, @Body() dto: UpdateLanguageDto) {
    return this.usersService.setLanguage((req as any).user.id, dto.language);
  }

  @Get('assessment')
  async getAssessment(@Req() req: Request) {
    return this.usersService.getAssessment((req as any).user.id);
  }

  @Post('assessment')
  async saveAssessment(@Req() req: Request, @Body() dto: SaveAssessmentDto) {
    return this.usersService.saveAssessment((req as any).user.id, dto);
  }

  @Get('memories')
  async getMemories(@Req() req: Request) {
    return this.usersService.getMemories((req as any).user.id);
  }

  @Post('memories')
  async createMemory(@Req() req: Request, @Body() dto: UpsertMemoryDto) {
    return this.usersService.createMemory((req as any).user.id, dto);
  }

  @Patch('memories/:memoryId')
  async updateMemory(@Req() req: Request, @Param('memoryId') memoryId: string, @Body() dto: UpsertMemoryDto) {
    return this.usersService.updateMemory((req as any).user.id, memoryId, dto);
  }

  @Delete('memories/:memoryId')
  async deleteMemory(@Req() req: Request, @Param('memoryId') memoryId: string) {
    return this.usersService.deleteMemory((req as any).user.id, memoryId);
  }

  @Get('doctor-summary')
  async getDoctorSummary(@Req() req: Request) {
    return this.usersService.getDoctorSummary((req as any).user.id);
  }

  @Get(':userId/public')
  async getPublicProfile(@Param('userId') userId: string): Promise<PublicUserResponseDto> {
    return this.usersService.getPublicProfile(userId);
  }
}

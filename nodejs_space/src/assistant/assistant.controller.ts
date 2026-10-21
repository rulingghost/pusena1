import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatAssistantDto, ReportAssistantResponseDto, AssistantResponseDto } from './dto/assistant.dto';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Assistant')
@Controller('api/assistant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('daily-insight')
  @ApiOperation({ summary: 'Günlük sağlık asistanı içgörüsü ve başlangıç kartı' })
  async getDailyInsight(@Request() req: any) {
    return this.assistantService.getDailyInsight(req.user.id);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Yapay zekâ sağlık asistanı ile sohbet' })
  @ApiOkResponse({ type: AssistantResponseDto })
  async chat(@Request() req: any, @Body() dto: ChatAssistantDto): Promise<AssistantResponseDto> {
    return this.assistantService.respondToUser(req.user.id, dto.question || '', dto.history || []) as Promise<AssistantResponseDto>;
  }

  @Post('report')
  @ApiOperation({ summary: 'Hatalı veya uygunsuz yapay zekâ yanıtını şikayet et' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async reportResponse(@Request() req: any, @Body() dto: ReportAssistantResponseDto): Promise<SuccessResponseDto> {
    return this.assistantService.reportAssistantResponse(req.user.id, dto);
  }
}


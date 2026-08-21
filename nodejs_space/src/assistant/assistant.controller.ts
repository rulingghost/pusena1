import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Assistant')
@Controller('api/assistant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('daily-insight')
  @ApiOperation({ summary: 'Get daily health assistant insights and prompt card' })
  async getDailyInsight(@Request() req: any) {
    return this.assistantService.getDailyInsight(req.user.id);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Interact with the health assistant chat' })
  async chat(@Request() req: any, @Body() body: { question: string; history?: Array<{ sender?: string; text?: string }> }) {
    return this.assistantService.respondToUser(req.user.id, body.question || '', body.history || []);
  }
}

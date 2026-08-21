import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  @Header('Cache-Control', 'private, max-age=86400')
  async get(@Param('id') id: string, @Res() res: Response) {
    const file = await this.mediaService.getObject(id);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(Buffer.from(file.bytes));
  }
}

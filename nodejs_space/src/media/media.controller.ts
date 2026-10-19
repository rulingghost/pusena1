import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    // Görsel içeriği hiç değişmez (id = içerik). ETag ile 304 dönerek
    // avatarların her açılışta yeniden indirilmesini engelliyoruz.
    const etag = `"m-${id}"`;
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    const file = await this.mediaService.getObject(id);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(Buffer.from(file.bytes));
  }
}

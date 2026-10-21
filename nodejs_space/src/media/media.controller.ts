import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('api/media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  async get(
    @Param('id') id: string,
    @Query('token') queryToken: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let token = queryToken;
    const authHeader = req.headers['authorization'];
    if (!token && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    let userId: string | null = null;
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        userId = payload.sub || payload.userId || payload.id || null;
      } catch {
        // Token geçersizse veya süresi dolmuşsa userId null kalır;
        // genel/kamusal medya dışındakilerde assertCanAccess 401/403 fırlatır.
      }
    }

    const file = await this.mediaService.assertCanAccess(id, userId);

    // Görsel içeriği hiç değişmez (id = içerik). ETag ile 304 dönerek
    // avatarların her açılışta yeniden indirilmesini engelliyoruz.
    // Erişim denetiminden SONRA yapılmalıdır.
    const etag = `"m-${id}"`;
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(Buffer.from(file.bytes));
  }
}

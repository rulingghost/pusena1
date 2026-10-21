import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Uptime pinger buraya vurur; veritabanına dokunmaz. */
  @Get(['health', 'api/health'])
  getHealth() {
    return { status: 'ok', time: new Date().toISOString() };
  }

  @Get('delete-account')
  getDeleteAccount(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'public', 'delete-account.html'));
  }

  @Get('privacy')
  getPrivacy(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'public', 'privacy.html'));
  }
}

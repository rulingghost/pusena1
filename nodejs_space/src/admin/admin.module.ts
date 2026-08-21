import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [PrismaModule, ArticlesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

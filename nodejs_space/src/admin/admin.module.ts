import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticlesModule } from '../articles/articles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, ArticlesModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

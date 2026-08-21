import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { PregnancyModule } from './pregnancy/pregnancy.module';
import { PeriodModule } from './period/period.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { RelationshipModule } from './relationship/relationship.module';
import { SpecialDatesModule } from './special-dates/special-dates.module';
import { CommunityModule } from './community/community.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { ArticlesModule } from './articles/articles.module';
import { AssistantModule } from './assistant/assistant.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    SettingsModule,
    PregnancyModule,
    PeriodModule,
    SymptomsModule,
    RelationshipModule,
    SpecialDatesModule,
    CommunityModule,
    NotificationsModule,
    DashboardModule,
    AdminModule,
    ArticlesModule,
    AssistantModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

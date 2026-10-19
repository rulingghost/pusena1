import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { config as loadEnv } from 'dotenv';
import { AppModule } from './app.module';
import { hydrateSecretsFromSupabase } from './secrets/hydrate-secrets';

loadEnv();

async function bootstrap() {
  await hydrateSecretsFromSupabase();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'public'));

  app.use(json({ limit: '12mb' }));
  app.use(urlencoded({ extended: true, limit: '12mb' }));

  const corsOrigins = process.env.CORS_ORIGINS;
  app.enableCors({
    origin: corsOrigins
      ? corsOrigins.split(',').map((o) => o.trim())
      : true,
    credentials: !!corsOrigins,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerPath = 'api-docs';
  const swaggerOn =
    process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production';

  if (swaggerOn) {

  // Prevent caching of swagger docs
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Pusena API')
    .setDescription('Pusena - Kadın Yaşam Asistanı API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customCss = `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #8B5CF6; }
  `;

  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Pusena API',
    customCss,
  });
  }

  // Barındırma sağlayıcıları (Render, Koyeb, Fly) portu PORT ile bildirir.
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error('Uygulama başlatılamadı', err);
  process.exit(1);
});

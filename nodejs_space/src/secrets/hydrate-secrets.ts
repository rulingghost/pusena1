import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const VAULT_KEYS = [
  'JWT_SECRET',
  'GROQ_API_KEY',
  'GROQ_MODEL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'CRON_SECRET',
  'PUBLIC_API_URL',
] as const;

const PLACEHOLDER = /^(YOUR_|changeme|TODO|dev-|test-)/i;

export function isUsable(value?: string | null): value is string {
  return !!value && value.trim().length > 0 && !PLACEHOLDER.test(value.trim());
}

export function validateSecrets(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const jwtSecret = process.env.JWT_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const databaseUrl = process.env.DATABASE_URL;

  // In production, enforce strict secrets policy
  if (isProduction) {
    const errors: string[] = [];

    if (!databaseUrl || databaseUrl.trim().length === 0) {
      errors.push('DATABASE_URL ortam değişkeni zorunludur.');
    }

    if (!isUsable(jwtSecret)) {
      errors.push('JWT_SECRET tanımlı değil veya geçersiz (placeholder kullanılamaz).');
    } else if (jwtSecret.length < 32) {
      errors.push('JWT_SECRET en az 32 karakter uzunluğunda olmalıdır.');
    }

    if (!isUsable(cronSecret)) {
      errors.push('CRON_SECRET tanımlı değil veya geçersiz (placeholder kullanılamaz).');
    } else if (cronSecret.length < 32) {
      errors.push('CRON_SECRET en az 32 karakter uzunluğunda olmalıdır.');
    }

    if (jwtSecret && cronSecret && jwtSecret === cronSecret) {
      errors.push('JWT_SECRET ile CRON_SECRET birbirinden farklı olmalıdır; aynı gizli anahtar paylaşılamaz.');
    }

    if (errors.length > 0) {
      console.error('================================================================');
      console.error('CANLI ORTAM GÜVENLİK HATASI: Eksik veya yetersiz ortam değişkenleri:');
      for (const err of errors) {
        console.error(`- ${err}`);
      }
      console.error('================================================================');
      process.exit(1);
    }
  } else {
    // Non-production (development / test)
    if (!isUsable(process.env.CRON_SECRET)) {
      // Never fallback to JWT_SECRET! Generate a secure random key
      process.env.CRON_SECRET = crypto.randomBytes(32).toString('hex');
    }

    if (process.env.JWT_SECRET && process.env.CRON_SECRET && process.env.JWT_SECRET === process.env.CRON_SECRET) {
      // Disallow equal secrets even in development
      process.env.CRON_SECRET = crypto.randomBytes(32).toString('hex');
    }
  }
}

/**
 * Copies stealable server secrets into the Supabase `AppSecret` table,
 * then hydrates process.env from that table so the Nest process does not
 * depend on a committed .env for JWT / Groq / Google.
 */
export async function hydrateSecretsFromSupabase(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL gerekli (Supabase Postgres).');
    }
    validateSecrets();
    return;
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AppSecret" (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MediaObject" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        kind TEXT NOT NULL,
        "mimeType" TEXT NOT NULL,
        bytes BYTEA NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MediaObject_userId_kind_idx" ON "MediaObject" ("userId", kind)
    `);

    for (const key of VAULT_KEYS) {
      const fromEnv = process.env[key];
      if (!isUsable(fromEnv)) continue;
      await prisma.$executeRaw`
        INSERT INTO "AppSecret" (key, value, "updatedAt")
        VALUES (${key}, ${fromEnv}, NOW())
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, "updatedAt" = NOW()
      `;
    }

    const rows = await prisma.$queryRaw<Array<{ key: string; value: string }>>`
      SELECT key, value FROM "AppSecret"
    `;
    for (const row of rows) {
      if (isUsable(row.value)) {
        process.env[row.key] = row.value;
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    // In dev / offline environments, log warning and continue with process.env
    console.warn('Supabase secret hydration atlandı veya bağlanılamadı, mevcut ortam değişkenleri kullanılacak.');
  } finally {
    await prisma.$disconnect().catch(() => {});
    validateSecrets();
  }
}

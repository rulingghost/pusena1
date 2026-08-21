import { PrismaClient } from '@prisma/client';

const VAULT_KEYS = [
  'JWT_SECRET',
  'GROQ_API_KEY',
  'GROQ_MODEL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'CRON_SECRET',
  'PUBLIC_API_URL',
] as const;

const PLACEHOLDER = /^(YOUR_|changeme|TODO)/i;

function isUsable(value?: string | null): value is string {
  return !!value && value.trim().length > 0 && !PLACEHOLDER.test(value.trim());
}

/**
 * Copies stealable server secrets into the Supabase `AppSecret` table,
 * then hydrates process.env from that table so the Nest process does not
 * depend on a committed .env for JWT / Groq / Google.
 */
export async function hydrateSecretsFromSupabase(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL gerekli (Supabase Postgres).');
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

    if (!isUsable(process.env.CRON_SECRET) && isUsable(process.env.JWT_SECRET)) {
      process.env.CRON_SECRET = process.env.JWT_SECRET;
    }
  } finally {
    await prisma.$disconnect();
  }
}

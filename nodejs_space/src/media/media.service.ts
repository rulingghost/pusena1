import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MAX_BYTES = 2.5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Göreli yol saklanır. Mutlak URL saklamak, geliştirme makinesinin yerel IP'sini
   * kalıcı olarak veritabanına yazıp başka ağdaki kullanıcılarda görselleri
   * bozuyordu; istemci adresi kendi API tabanıyla çözüyor.
   */
  publicUrl(id: string): string {
    return `/api/media/${id}`;
  }

  async persistDataUri(userId: string, kind: string, value?: string | null): Promise<string | null> {
    if (value == null || value === '') return null;
    const trimmed = value.trim();
    const mediaId = trimmed.match(/\/api\/media\/([a-zA-Z0-9-]+)/)?.[1];
    if (mediaId) return `/api/media/${mediaId}`;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const parsed = parseDataUri(trimmed);
    if (!parsed) {
      throw new BadRequestException('Geçersiz görsel. JPEG, PNG veya WebP yükleyin.');
    }
    const saved = await this.prisma.mediaObject.create({
      data: {
        userId,
        kind,
        mimeType: parsed.mimeType,
        bytes: parsed.bytes,
      },
    });
    return this.publicUrl(saved.id);
  }

  async persistMany(userId: string, kind: string, values?: string[]): Promise<string[]> {
    if (!values?.length) return [];
    const saved = await Promise.all(values.map((value) => this.persistDataUri(userId, kind, value)));
    return saved.filter((url): url is string => !!url);
  }

  async getObject(id: string) {
    const row = await this.prisma.mediaObject.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Dosya bulunamadı');
    return row;
  }
}

function parseDataUri(raw: string): { mimeType: string; bytes: Buffer } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(raw);
  if (!match) return null;
  let mimeType = match[1].toLowerCase();
  if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
  if (!ALLOWED.has(mimeType)) return null;
  const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  if (!bytes.length || bytes.length > MAX_BYTES) {
    throw new BadRequestException('Görsel en fazla 2.5 MB olabilir');
  }
  return { mimeType, bytes };
}

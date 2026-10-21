import { ArticlesService } from './articles.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ArticlesService (Persistence & Updates)', () => {
  let service: ArticlesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      appSecret: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({ key: 'ADMIN_CONTENT_OVERRIDES', value: '{}' }),
      },
    };
    service = new ArticlesService(mockPrisma as PrismaService);
  });

  it('returns articles with default content', async () => {
    const res = await service.getArticles();
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items[0].id).toBe('art-1');
  });

  it('updates article and persists overrides to database', async () => {
    const updated = await service.adminUpdateArticle('art-1', {
      title: 'Güncellenmiş Foliküler Evre Başlığı',
    });
    expect(updated.title).toBe('Güncellenmiş Foliküler Evre Başlığı');
    expect(mockPrisma.appSecret.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'ADMIN_CONTENT_OVERRIDES' },
      }),
    );

    const check = await service.getArticleById('art-1');
    expect(check.title).toBe('Güncellenmiş Foliküler Evre Başlığı');
  });

  it('loads saved overrides from database on module init', async () => {
    const overridesJson = JSON.stringify({
      articles: {
        'art-1': { title: 'Veritabanından Yüklenen Başlık' },
      },
      faqs: {
        'faq-1': { question: 'Veritabanından Gelen Soru?' },
      },
    });

    mockPrisma.appSecret.findUnique.mockResolvedValue({
      key: 'ADMIN_CONTENT_OVERRIDES',
      value: overridesJson,
    });

    await service.onModuleInit();

    const art = await service.getArticleById('art-1');
    expect(art.title).toBe('Veritabanından Yüklenen Başlık');

    const faqs = await service.getFaqs();
    const faq1 = faqs.items.find((f: any) => f.id === 'faq-1');
    expect(faq1?.question).toBe('Veritabanından Gelen Soru?');
  });

  it('updates FAQ and Myth and persists to database', async () => {
    await service.adminUpdateFaq('faq-1', { answer: 'Güncel SSS cevabı' });
    expect(mockPrisma.appSecret.upsert).toHaveBeenCalled();

    await service.adminUpdateMyth('myth-1', { explanation: 'Güncel Mit açıklaması' });
    expect(mockPrisma.appSecret.upsert).toHaveBeenCalledTimes(2);
  });
});

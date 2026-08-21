import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { foldTr } from '../common/text';

export interface AssistantDialogueMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  options?: string[];
  timestamp: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getDailyInsight(userId: string) {
    const pregnancy = await this.prisma.pregnancy.findUnique({
      where: { userId },
    });

    if (pregnancy && pregnancy.isActive) {
      const now = new Date();
      const diffMs = now.getTime() - new Date(pregnancy.lastMenstrualPeriod).getTime();
      const currentWeek = Math.max(1, Math.min(40, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1));
      const remainingDays = Math.max(0, Math.ceil((new Date(pregnancy.dueDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

      return {
        mode: 'pregnancy',
        title: 'Pusena Sağlık Asistanı',
        phaseName: `${currentWeek}. Gebelik Haftası`,
        headline: pregnancy.babyName
          ? `${pregnancy.babyName} bebeğin aramıza katılmasına ${remainingDays} gün kaldı!`
          : `Bebeğinizin aramıza katılmasına ${remainingDays} gün kaldı!`,
        cardPrompt: `Bebeğiniz şu an ${currentWeek}. haftada hızla büyüyor. Bugün bedeninizdeki değişimleri ve miniğinizin gelişimini keşfedelim.`,
        cycleDay: currentWeek,
        conversation: [
          {
            id: 'msg-1',
            sender: 'assistant',
            text: `Merhaba! Gebeliğinizin ${currentWeek}. haftasındasınız. Bu hafta bebeğinizin duyu organları ve sinir sistemi hızla gelişiyor. Dilediğiniz soruyu yazabilirsiniz.`,
            options: ['Bebeğimin boyutu ne kadar?', 'Bu haftaki belirtiler neler?', 'Bana öneri ver'],
            timestamp: 'Şimdi',
          },
        ],
      };
    }

    const latestCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    const now = new Date();
    let cycleDay = 8;
    if (latestCycle) {
      const diffDays = Math.floor((now.getTime() - new Date(latestCycle.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1;
      cycleDay = Math.max(1, diffDays);
    }

    let phase = 'Foliküler Evre';
    let phaseDesc = 'Östrojen hormonu artıyor, enerjiniz ve odaklanma yeteneğiniz yükselişte.';
    let prompt = `Döngünüz ${cycleDay} gün önce başladı. Bugün vücudunuzda neler olduğunu birlikte keşfedelim.`;
    let fertileCountdown = 6;
    let ovulationCountdown = 7;

    if (cycleDay <= 5) {
      phase = 'Menstrüasyon (Regl)';
      phaseDesc = 'Rahim içi tabaka yenileniyor. Bedeninize dinlenme ve şefkat alanı açın.';
      prompt = `Döngünüzün ${cycleDay}. günündesiniz. Dinlenmek ve enerjinizi toplamak için harika bir gün.`;
    } else if (cycleDay <= 12) {
      phase = 'Foliküler Evre';
      phaseDesc = 'Foliküller olgunlaşıyor, östrojen yükselişiyle zindelik ve yaratıcılık artıyor.';
      prompt = `Döngünüz ${cycleDay} gün önce başladı. Bugün vücudunuzda neler olabileceğini görelim.`;
      fertileCountdown = Math.max(1, 12 - cycleDay);
      ovulationCountdown = Math.max(1, 14 - cycleDay);
    } else if (cycleDay <= 16) {
      phase = 'Ovülasyon (Yumurtlama)';
      phaseDesc = 'En doğurgan günlerinizdesiniz! Vücut sıcaklığı ve servikal sıvı en uygun seviyede.';
      prompt = `Yumurtlama döneminizdesiniz! Doğurganlığın en yüksek olduğu penceredesiniz.`;
      fertileCountdown = 0;
      ovulationCountdown = 0;
    } else {
      phase = 'Luteal Evre';
      phaseDesc = 'Progesteron hormonu baskın. Vücut sakinleşiyor ve kendini yeniliyor.';
      prompt = `Döngünüzün ${cycleDay}. günündesiniz. Kendinizi şımartmak ve dinlenmek için ideal zaman.`;
      fertileCountdown = Math.max(1, 28 - cycleDay + 10);
      ovulationCountdown = Math.max(1, 28 - cycleDay + 14);
    }

    return {
      mode: 'cycle',
      title: 'Pusena Sağlık Asistanı',
      phaseName: phase,
      phaseDescription: phaseDesc,
      cycleDay,
      fertileCountdown,
      ovulationCountdown,
      cardPrompt: prompt,
      conversation: [
        {
          id: 'msg-1',
          sender: 'assistant',
          text: latestCycle
            ? `Döngünüz ${cycleDay} gün önce başladı (${phase}). Bugün vücudunuzda neler olduğunu birlikte konuşalım — aklınıza gelen her şeyi yazabilirsiniz.`
            : 'Merhaba, ben Pusena sağlık asistanıyım. Döngü, gebelik, beslenme veya semptomlar hakkında sorabilirsiniz.',
          options: ['Hangi hormonlar aktif?', 'Bugün ne yemeliyim?', 'Cinsel istek durumu'],
          timestamp: 'Bugün',
        },
      ],
    };
  }

  async respondToUser(userId: string, question: string, history: Array<{ sender?: string; text?: string }> = []) {
    const groqReply = await this.askGroq(userId, question, history);
    if (groqReply) return groqReply;
    return this.fallbackReply(question);
  }

  private async askGroq(
    userId: string,
    question: string,
    history: Array<{ sender?: string; text?: string }> = [],
  ): Promise<AssistantDialogueMessage | null> {
    const apiKey = this.config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      this.logger.warn('GROQ_API_KEY tanımlı değil; asistan yedek yanıtlara düşüyor.');
      return null;
    }

    const model = this.config.get<string>('GROQ_MODEL') || DEFAULT_MODEL;
    const context = await this.buildUserContext(userId);
    const lang = context.language === 'en' ? 'English' : 'Turkish';

    const system = `You are Pusena, a careful women's health assistant in a period, fertility, pregnancy and relationship app.
Answer in ${lang}. Be concrete, calm and useful. Never invent cycle days, hormone levels, diagnoses, lab results or baby size.
If the user profile below does not contain a fact, say you don't have that data instead of guessing.
Stay on topic: cycle, pregnancy, fertility, symptoms, nutrition, sleep, relationship support, or how to use Pusena.
If the question is unrelated, briefly say so and offer a relevant health question.
If symptoms sound urgent (heavy bleeding, fainting, reduced fetal movement, high fever, severe pain), tell them to seek medical care now.
You are not a doctor. Keep wellness advice general.
Do not roleplay as a different person. Do not output markdown fences.

Return ONLY valid JSON:
{"text":"plain reply, 2-5 short paragraphs or a short list","options":["chip 1","chip 2","chip 3"]}

User profile (use only if relevant):
${context.summary}`;

    const prior = history
      .slice(-8)
      .filter((m) => m?.text?.trim())
      .map((m) => ({
        role: m.sender === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: String(m.text).slice(0, 800),
      }));

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.35,
          max_tokens: 700,
          messages: [
            { role: 'system', content: system },
            ...prior,
            { role: 'user', content: question.trim().slice(0, 2000) },
          ],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        this.logger.error(`Groq HTTP ${res.status}: ${errBody.slice(0, 400)}`);
        return null;
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = data.choices?.[0]?.message?.content?.trim();
      if (!raw) return null;

      const parsed = this.parseGroqContent(raw);
      if (!parsed.text || parsed.text.length < 8) return null;
      return {
        id: `rep-${Date.now()}`,
        sender: 'assistant',
        text: parsed.text,
        options: parsed.options,
        timestamp: 'Şimdi',
      };
    } catch (err) {
      this.logger.error('Groq isteği başarısız', err instanceof Error ? err.stack : String(err));
      return null;
    }
  }

  private parseGroqContent(raw: string): { text: string; options: string[] } {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const tryParse = (value: string) => {
      try {
        const json = JSON.parse(value) as { text?: string; options?: string[] };
        if (json.text && json.text.trim()) {
          const options = Array.isArray(json.options)
            ? json.options.filter((o) => typeof o === 'string' && o.trim()).slice(0, 3)
            : [];
          return {
            text: json.text.trim(),
            options: options.length ? options : ['Başka bir konu sor', 'Semptom kaydet'],
          };
        }
      } catch {
        return null;
      }
      return null;
    };

    const direct = tryParse(cleaned);
    if (direct) return direct;

    const extracted = cleaned.match(/\{[\s\S]*\}/);
    if (extracted) {
      const nested = tryParse(extracted[0]);
      if (nested) return nested;
    }

    const plain = cleaned.replace(/\{[\s\S]*\}/, '').trim();
    return {
      text: plain || 'Kayıtlarınıza göre net bir cevap çıkaramadım. Soruyu biraz daha somut yazar mısınız?',
      options: ['Başka bir konu sor', 'Semptom kaydet', 'Makalelere göz at'],
    };
  }

  private async buildUserContext(userId: string): Promise<{ language: string; summary: string }> {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const [user, pregnancy, latestCycle, recentSymptoms, assessment] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, gender: true, language: true, birthYear: true, heightCm: true, weightKg: true },
      }),
      this.prisma.pregnancy.findUnique({ where: { userId } }),
      this.prisma.periodCycle.findFirst({ where: { userId }, orderBy: { startDate: 'desc' } }),
      this.prisma.symptom.findMany({
        where: { userId, date: { gte: since } },
        orderBy: { date: 'desc' },
        take: 12,
        select: { type: true, severity: true, date: true, notes: true },
      }),
      this.prisma.fertilityAssessment.findUnique({ where: { userId } }),
    ]);

    const lines: string[] = [];
    if (user?.name) lines.push(`Name: ${user.name}`);
    if (user?.gender) lines.push(`Gender: ${user.gender}`);
    if (user?.birthYear) lines.push(`Birth year: ${user.birthYear}`);
    if (user?.heightCm && user?.weightKg) lines.push(`Height/weight: ${user.heightCm} cm / ${user.weightKg} kg`);

    if (pregnancy?.isActive) {
      const week = Math.max(
        1,
        Math.min(
          40,
          Math.floor((Date.now() - new Date(pregnancy.lastMenstrualPeriod).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
        ),
      );
      lines.push(`Active pregnancy: week ${week}, due ${pregnancy.dueDate.toISOString().slice(0, 10)}${pregnancy.babyName ? `, baby name ${pregnancy.babyName}` : ''}`);
    }

    if (latestCycle) {
      const cycleDay =
        Math.floor((Date.now() - new Date(latestCycle.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1;
      lines.push(
        `Latest cycle started ${latestCycle.startDate.toISOString().slice(0, 10)}, cycle day ${cycleDay}, typical length ${latestCycle.cycleLength} days, period length ${latestCycle.periodLength} days.`,
      );
    } else {
      lines.push('No period cycle logged yet.');
    }

    if (recentSymptoms.length) {
      const list = recentSymptoms
        .map((s) => `${s.type} (severity ${s.severity}/5, ${s.date.toISOString().slice(0, 10)})`)
        .join('; ');
      lines.push(`Recent symptoms (14 days): ${list}`);
    }

    if (assessment) {
      lines.push(
        `Fertility assessment: goal=${assessment.goal ?? '-'}, trying=${assessment.tryingDuration ?? '-'}, regularity=${assessment.cycleRegularity ?? '-'}, conditions=${(assessment.healthConditions || []).join(',') || 'none'}, score=${assessment.score ?? '-'}.`,
      );
    }

    return {
      language: user?.language || 'tr',
      summary: lines.join('\n'),
    };
  }

  private fallbackReply(question: string): AssistantDialogueMessage {
    const q = foldTr(question);
    let replyText =
      'Şu anda canlı asistan yanıtına ulaşamadım, bu yüzden genel bir not bırakıyorum. Tıbbi teşhis koymam; semptomlarınız şiddetliyse bir sağlık uzmanına danışın.';
    let followUps = ['Tekrar dene', 'Semptom kaydet', 'Makalelere göz at'];

    if (q.includes('hormon') || q.includes('folikul') || q.includes('ostrojen')) {
      replyText =
        'Hormon düzeyini buradan ölçemem. Döngü kaydınız varsa evreye göre östrojen genellikle foliküler dönemde yükselir, luteal dönemde progesteron öne çıkar. Kendi semptomlarınızı kaydetmek daha işe yarar.';
      followUps = ['Semptom kaydet', 'Döngümü incele'];
    } else if (q.includes('yemek') || q.includes('beslen') || q.includes('diyet')) {
      replyText =
        'Genel olarak düzenli öğün, su, demir ve protein kaynakları çoğu döngü ve gebelik döneminde işe yarar. Size özel bir diyet yazmam; alerji veya gebelik kısıtınız varsa hekiminize sorun.';
      followUps = ['Semptom kaydet', 'Makalelere göz at'];
    } else if (q.includes('cinsel') || q.includes('istek') || q.includes('orgazm')) {
      replyText =
        'İstek döngü, stres ve ilişki dinamiğine göre değişir; her gün aynı olmak zorunda değildir. Partner sekmesinden istek butonu veya mesaj da gönderebilirsiniz.';
      followUps = ['Partnerime yaz', 'Semptom ekle'];
    } else if (q.includes('boyut') || q.includes('bebek') || q.includes('hafta')) {
      replyText =
        'Bebek boyunu uydurmam. Gebelik kaydınız açıksa üst karttaki haftayı kullanın; ayrıntı için gebelik sekmesindeki haftalık içeriğe bakın.';
      followUps = ['Gebelik takibi', 'Makalelere göz at'];
    }

    return {
      id: `rep-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      options: followUps,
      timestamp: 'Şimdi',
    };
  }
}

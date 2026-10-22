import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { foldTr } from '../common/text';
import { calculatePregnancyProgress, calculateCycleProgress } from '../common/dates';
import { ReportAssistantResponseDto } from './dto/assistant.dto';
import * as fs from 'fs';
import { join } from 'path';

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
    const [settings, pregnancy] = await Promise.all([
      this.prisma.userSettings.findUnique({ where: { userId } }),
      this.prisma.pregnancy.findUnique({ where: { userId } }),
    ]);

    const isPregnancyActive = Boolean(
      settings?.activeModules?.includes('pregnancy') && pregnancy && pregnancy.isActive,
    );

    if (isPregnancyActive && pregnancy) {
      const prog = calculatePregnancyProgress(pregnancy.lastMenstrualPeriod, pregnancy.dueDate);
      const currentWeek = prog.week;
      const remainingDays = prog.daysRemaining;

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
            options: [],
            timestamp: 'Şimdi',
          },
        ],
      };
    }

    const latestCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    let cycleDay = 8;
    if (latestCycle) {
      const cycleProg = calculateCycleProgress(latestCycle.startDate, latestCycle.cycleLength, latestCycle.periodLength);
      cycleDay = cycleProg.currentCycleDay;
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
          options: [],
          timestamp: 'Bugün',
        },
      ],
    };
  }

  async respondToUser(userId: string, question: string, history: Array<{ sender?: string; text?: string }> = []) {
    // Intent check: if user says they are not pregnant or ended pregnancy, deactivate in DB immediately
    await this.handlePregnancyTerminationIntent(userId, question);

    const groqReply = await this.askGroq(userId, question, history);
    if (groqReply) return groqReply;
    return this.fallbackReply(question);
  }

  private async handlePregnancyTerminationIntent(userId: string, question: string) {
    const q = foldTr(question).toLowerCase();
    const triggers = [
      'gebe degilim',
      'hamile degilim',
      'gebelik bitti',
      'gebeligi bitirdim',
      'gebeligimi bitirdim',
      'gebelik sonlandi',
      'gebeligi sonlandirdim',
      'gebeligimi sonlandirdim',
      'dusuk yaptim',
      'bebegi kaybettim',
      'bebegimi kaybettim',
      'kurtaj oldum',
      'dogum yaptim',
      'bebegim dogdu',
      'bebek dogdu',
    ];

    if (triggers.some((t) => q.includes(t))) {
      this.logger.log(`Pregnancy termination intent detected from user ${userId}: "${question}"`);
      await this.prisma.pregnancy.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });
      const settings = await this.prisma.userSettings.findUnique({ where: { userId } });
      if (settings?.activeModules?.includes('pregnancy')) {
        const nextModules = settings.activeModules.filter((m) => m !== 'pregnancy');
        if (!nextModules.includes('period')) nextModules.push('period');
        await this.prisma.userSettings.update({
          where: { userId },
          data: { activeModules: nextModules },
        });
      }
    }
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

CRITICAL PREGNANCY STATUS ENFORCEMENT:
Check the PREGNANCY STATUS in the user profile below:
- If PREGNANCY STATUS is 'NOT PREGNANT': The user is definitely NOT pregnant right now. Even if older messages in the conversation history mention being pregnant or a baby, you MUST NOT treat them as pregnant, do NOT talk about 'your pregnancy' or 'your baby', and do NOT assume active gestation. Treat them strictly under menstrual cycle / general wellness.
- If PREGNANCY STATUS is 'ACTIVELY PREGNANT': You may address active pregnancy guidance according to the active week listed.

Stay on topic: cycle, pregnancy, fertility, symptoms, nutrition, sleep, relationship support, or how to use Pusena.
If the question is unrelated, briefly say so and offer a relevant health question.
If symptoms sound urgent (heavy bleeding, fainting, reduced fetal movement, high fever, severe pain), tell them to seek medical care now.
You are not a doctor. Keep wellness advice general.
Do not roleplay as a different person. Do not output markdown fences.

Return ONLY valid JSON:
{"text":"plain reply, 2-5 short paragraphs or a short list"}

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
        this.logger.error(`Groq servisi HTTP ${res.status} durum kodu ile başarısız oldu.`);
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
        options: [],
        timestamp: 'Şimdi',
      };
    } catch {
      this.logger.error('Groq servisine erişim sırasında bir bağlantı hatası oluştu.');
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
          return {
            text: json.text.trim(),
            options: [],
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
      options: [],
    };
  }

  private async buildUserContext(userId: string): Promise<{ language: string; summary: string }> {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const [user, settings, pregnancy, latestCycle, recentSymptoms, assessment] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, gender: true, language: true, birthYear: true, heightCm: true, weightKg: true },
      }),
      this.prisma.userSettings.findUnique({ where: { userId } }),
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

    const isPregnancyActive = Boolean(
      settings?.activeModules?.includes('pregnancy') && pregnancy && pregnancy.isActive,
    );

    const lines: string[] = [];
    lines.push('User profile: Anonymous adult woman');
    if (user?.heightCm && user?.weightKg) {
      const bmi = (user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1);
      lines.push(`Body Mass Index: approx ${bmi}`);
    }

    if (isPregnancyActive && pregnancy) {
      const prog = calculatePregnancyProgress(pregnancy.lastMenstrualPeriod, pregnancy.dueDate);
      lines.push(`PREGNANCY STATUS: ACTIVELY PREGNANT (Week ${prog.week}, approximately ${prog.daysRemaining} days remaining until estimated due date).`);
    } else {
      lines.push(
        'PREGNANCY STATUS: NOT PREGNANT. The user is currently NOT pregnant (she is not in pregnancy mode; any prior pregnancy has ended, is inactive, or not present). CRITICAL RULES: 1. NEVER address the user as pregnant. 2. NEVER mention fetal development, baby size, trimesters, or due dates. 3. Treat all questions strictly from the perspective of non-pregnant women\'s health, menstrual cycle, and wellness. 4. Even if prior chat messages in the history mentioned pregnancy or baby, completely ignore that past context because the pregnancy is now ended/inactive.',
      );
    }

    if (latestCycle) {
      const cycleProg = calculateCycleProgress(latestCycle.startDate, latestCycle.cycleLength, latestCycle.periodLength);
      lines.push(
        `Latest cycle: cycle day ${cycleProg.currentCycleDay}, typical cycle length ${latestCycle.cycleLength} days, period length ${latestCycle.periodLength} days.`,
      );
    } else {
      lines.push('No period cycle logged yet.');
    }

    if (recentSymptoms.length) {
      const list = recentSymptoms
        .map((s) => `${s.type} (severity ${s.severity}/5)`)
        .join('; ');
      lines.push(`Recent logged symptoms: ${list}`);
    }

    if (assessment) {
      lines.push(
        `Fertility assessment context: regularity=${assessment.cycleRegularity ?? '-'}, conditions=${(assessment.healthConditions || []).join(',') || 'none'}.`,
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

    if (
      q.includes('gebe degil') ||
      q.includes('hamile degil') ||
      q.includes('dusuk') ||
      q.includes('sonlandi') ||
      q.includes('bitti')
    ) {
      replyText =
        'Bilgilendirmeniz için teşekkür ederim. Kayıtlarınız güncellendi; şu anda döngü ve genel kadın sağlığı modundasınız. Bedeninizi dinlemek, döngünüz veya genel sağlığınız hakkında merak ettiğiniz her şeyi sorabilirsiniz.';
      followUps = ['Döngümü incele', 'Semptom kaydet'];
    } else if (q.includes('hormon') || q.includes('folikul') || q.includes('ostrojen')) {
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
        'Bebek gelişim detayları yalnızca aktif bir gebelik takibiniz açık olduğunda sunulur. Eğer gebeyseniz Kurulum ekranından Gebelik modunu etkinleştirebilirsiniz; aksi halde döngü takibiniz üzerinden devam etmekteyiz.';
      followUps = ['Döngümü incele', 'Makalelere göz at'];
    }

    return {
      id: `rep-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      options: [],
      timestamp: 'Şimdi',
    };
  }

  // AI Moderation & Flagging
  async reportAssistantResponse(userId: string, dto: ReportAssistantResponseDto) {
    if (!dto.responseText || !dto.reason) {
      throw new BadRequestException('Yanıt metni ve şikayet nedeni zorunludur.');
    }

    const reportItem = {
      id: `ai-rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      messageId: dto.messageId || null,
      question: dto.question?.slice(0, 1000) || null,
      responseText: dto.responseText.slice(0, 2000),
      reason: dto.reason.slice(0, 500),
      createdAt: new Date().toISOString(),
    };

    const current = await this.getReportedAiResponses();
    const updated = [reportItem, ...current.slice(0, 199)]; // Keep latest 200 reports
    await this.persistReportedAiResponses(updated);

    return { success: true, message: 'Şikayetiniz incelenmek üzere moderasyon kuyruğuna iletildi.' };
  }

  async getReportedAiResponses(): Promise<any[]> {
    try {
      const secret = await this.prisma.appSecret.findUnique({ where: { key: 'REPORTED_AI_RESPONSES' } });
      if (secret?.value) {
        const parsed = JSON.parse(secret.value);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return this.readReportedAiFromFile();
  }

  async dismissReportedAiResponse(reportId: string) {
    const current = await this.getReportedAiResponses();
    const updated = current.filter((r) => r.id !== reportId);
    await this.persistReportedAiResponses(updated);
    return { success: true };
  }

  private async persistReportedAiResponses(reports: any[]) {
    const json = JSON.stringify(reports);
    try {
      await this.prisma.appSecret.upsert({
        where: { key: 'REPORTED_AI_RESPONSES' },
        update: { value: json },
        create: { key: 'REPORTED_AI_RESPONSES', value: json },
      });
    } catch (err) {
      this.logger.warn(`Could not save reported AI responses to AppSecret: ${(err as any)?.message}`);
    }

    try {
      const dir = join(process.cwd(), 'storage');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(join(dir, 'reported_ai_responses.json'), json, 'utf8');
    } catch (err) {
      this.logger.warn(`Could not save reported AI responses to file: ${(err as any)?.message}`);
    }
  }

  private readReportedAiFromFile(): any[] {
    try {
      const filePath = join(process.cwd(), 'storage', 'reported_ai_responses.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }
}

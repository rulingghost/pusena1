import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface GuideTip {
  icon: string;
  title: string;
  body: string;
}

export interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  tips: GuideTip[];
}

@Injectable()
export class PartnerGuideService {
  constructor(private readonly prisma: PrismaService) {}

  async getPartnerGuide(userId: string) {
    const [user, settings, pregnancy, cycles] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, gender: true, name: true, nickname: true, pairedUserId: true },
      }),
      this.prisma.userSettings.findUnique({ where: { userId } }),
      this.prisma.pregnancy.findUnique({ where: { userId } }),
      this.prisma.periodCycle.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 3 }),
    ]);

    let partner: { name: string; nickname: string | null; gender: string | null } | null = null;
    let partnerPregnancy: { lastMenstrualPeriod: Date } | null = null;
    let partnerCycles: Array<{ startDate: Date; cycleLength: number; periodLength: number }> = [];

    if (user?.pairedUserId) {
      const [p, pp, pc] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: user.pairedUserId },
          select: { name: true, nickname: true, gender: true },
        }),
        this.prisma.pregnancy.findUnique({ where: { userId: user.pairedUserId } }),
        this.prisma.periodCycle.findMany({ where: { userId: user.pairedUserId }, orderBy: { startDate: 'desc' }, take: 3 }),
      ]);
      partner = p;
      partnerPregnancy = pp;
      partnerCycles = pc;
    }

    const viewerGender = user?.gender ?? null;
    const trackedPregnancy = partnerPregnancy ?? (viewerGender === 'male' ? null : pregnancy);
    const trackedCycles = partnerCycles.length > 0 ? partnerCycles : (viewerGender === 'male' ? [] : cycles);
    const partnerName = partner?.nickname || partner?.name || null;
    const partnerSettings = user?.pairedUserId
      ? await this.prisma.userSettings.findUnique({ where: { userId: user.pairedUserId } })
      : null;
    const bodyModules = partnerSettings?.activeModules?.length
      ? partnerSettings.activeModules
      : (viewerGender === 'male' ? [] : (settings?.activeModules ?? []));

    const week = trackedPregnancy
      ? Math.max(1, Math.min(42, Math.floor((Date.now() - trackedPregnancy.lastMenstrualPeriod.getTime()) / DAY_MS / 7) + 1))
      : null;

    let cyclePhase: string | null = null;
    let cycleDay: number | null = null;
    if (trackedCycles.length > 0) {
      const latest = trackedCycles[0];
      cycleDay = Math.floor((Date.now() - latest.startDate.getTime()) / DAY_MS) + 1;
      const ovulationDay = latest.cycleLength - 14;
      if (cycleDay <= latest.periodLength) cyclePhase = 'menstrual';
      else if (cycleDay < ovulationDay - 5) cyclePhase = 'follicular';
      else if (cycleDay <= ovulationDay) cyclePhase = 'fertile';
      else if (cycleDay <= latest.cycleLength) cyclePhase = 'luteal';
      else cyclePhase = 'late';
    }

    const perspective = this.resolvePerspective(viewerGender);
    const sections: GuideSection[] = [];

    if (week && (bodyModules.includes('pregnancy') || !!trackedPregnancy)) {
      sections.push(this.pregnancySection(week, perspective, partnerName));
      sections.push(this.birthSection(week, perspective));
    }
    if (cyclePhase && (bodyModules.includes('period') || trackedCycles.length > 0)) {
      sections.push(this.cycleSection(cyclePhase, cycleDay!, perspective, partnerName));
    }
    sections.push(this.visibilitySection(perspective, partnerName, !!user?.pairedUserId));
    sections.push(this.communicationSection(perspective, partnerName));
    sections.push(this.intimacySection(perspective, cyclePhase, week));

    return {
      viewerGender,
      perspective: perspective.key,
      partnerName,
      isPaired: !!user?.pairedUserId,
      pregnancyWeek: week,
      cyclePhase,
      cycleDay,
      headline: this.headline(perspective, partnerName, week, cyclePhase),
      sections,
    };
  }

  private resolvePerspective(gender: string | null) {
    if (gender === 'male') {
      return {
        key: 'male',
        you: 'Sen',
        partnerWord: 'eşin',
        intro: 'Erkek partner olarak destek rehberin',
      };
    }
    if (gender === 'female') {
      return {
        key: 'female',
        you: 'Sen',
        partnerWord: 'partnerin',
        intro: 'Kadın partner olarak destek rehberin',
      };
    }
    return {
      key: 'neutral',
      you: 'Sen',
      partnerWord: 'partnerin',
      intro: 'Partner destek rehberin',
    };
  }

  private headline(
    p: { key: string; partnerWord: string },
    partnerName: string | null,
    week: number | null,
    cyclePhase: string | null,
  ) {
    const who = partnerName ?? (p.key === 'male' ? 'Eşin' : 'Partnerin');
    if (week) return `${who} gebeliğinin ${week}. haftasında — bugün nasıl destek olabilirsin?`;
    if (cyclePhase === 'menstrual') return `${who} regl döneminde — bugün biraz daha fazla şefkat iyi gelir.`;
    if (cyclePhase === 'fertile') return `${who} doğurganlık penceresinde — bu günler planlarınız için önemli.`;
    if (cyclePhase === 'luteal') return `${who} luteal evrede — PMS belirtileri artabilir.`;
    return `${who} için kişisel destek rehberin`;
  }

  private pregnancySection(week: number, p: { key: string; partnerWord: string }, partnerName: string | null): GuideSection {
    const who = partnerName ?? p.partnerWord;
    const male = p.key === 'male';

    if (week <= 13) {
      return {
        id: 'pregnancy',
        title: `${week}. hafta — 1. trimester`,
        subtitle: 'Bulantı, yorgunluk ve duygusal dalgalanmalar dönemi',
        tips: [
          { icon: '🤢', title: 'Sabah bulantısını hafiflet', body: male
            ? `${who} yataktan kalkmadan önce yatağının yanına kuru bir bisküvi ve su bırak. Boş mideye kalkmak bulantıyı şiddetlendirir.`
            : `${who} yataktan kalkmadan önce hafif bir atıştırmalık hazırla. Boş mideye kalkmak bulantıyı artırır.` },
          { icon: '😴', title: 'Yorgunluğu kişilik sanma', body: `Progesteron bu haftalarda tavan yapar ve ciddi uyku ihtiyacı yaratır. ${who} tembel değil; bedeni plasentayı inşa ediyor.` },
          { icon: '👃', title: 'Koku hassasiyetine dikkat', body: male
            ? 'Parfümünü, tıraş losyonunu ve yemek kokularını bir süre azalt. Bu dönemde koku alma duyusu belirgin keskinleşir.'
            : 'Yoğun kokulu ürünleri ve ağır yemek kokularını azalt; bu dönemde koku duyusu keskinleşir.' },
          { icon: '💊', title: 'Folik asidi birlikte hatırla', body: 'Nöral tüp gelişimi bu haftalarda tamamlanır. Günlük 400 mcg folik asit için ortak bir hatırlatıcı kur.' },
        ],
      };
    }
    if (week <= 27) {
      return {
        id: 'pregnancy',
        title: `${week}. hafta — 2. trimester`,
        subtitle: 'Altın dönem: enerji geri geliyor',
        tips: [
          { icon: '🎧', title: 'Bebekle konuşmaya başla', body: `Bebeğin işitme duyusu ${week >= 18 ? 'gelişti' : 'gelişiyor'}. Karına yaklaşıp konuşman doğumdan sonra sesini tanımasını sağlar.` },
          { icon: '📸', title: 'Anomali taramasına birlikte git', body: '20. hafta detaylı ultrasonu gebeliğin en önemli kontrollerinden biri. Bu randevuya birlikte gitmek büyük anlam taşır.' },
          { icon: '🍽️', title: 'Şeker yükleme testini takvime al', body: '24-28. hafta arasında gestasyonel diyabet taraması yapılmalı. Randevuyu sen ayarlarsan bir yükü omuzlarından almış olursun.' },
          { icon: '💃', title: 'Enerjiyi birlikte kullanın', body: 'Bu dönem tatil, bebek odası hazırlığı ve doğum kursu için en uygun zaman. 3. trimesterde hareket etmek zorlaşacak.' },
        ],
      };
    }
    return {
      id: 'pregnancy',
      title: `${week}. hafta — 3. trimester`,
      subtitle: 'Son düzlük: hazırlık ve tetikte olma zamanı',
      tips: [
        { icon: '🦵', title: 'Fiziksel yükü üstlen', body: `Bu haftalarda ayakkabı bağlamak bile zorlaşır. ${who} istemeden önce sen devral.` },
        { icon: '🎒', title: 'Hastane çantasını sen hazırla', body: '36. haftadan itibaren çanta arabada veya kapının yanında hazır beklemeli. Listeyi uygulamadan takip edebilirsin.' },
        { icon: '⚠️', title: 'Acil belirtileri ezberle', body: 'Şiddetli baş ağrısı, görme bulanıklığı, ani şişlik, bebek hareketlerinde azalma veya kanama → beklemeden hastane.' },
        { icon: '🛣️', title: 'Rotayı önceden dene', body: 'Hastaneye giden yolu bir kez trafik saatinde dene. Doğum başladığında düşünmek zorunda kalmazsın.' },
      ],
    };
  }

  private birthSection(week: number, p: { key: string }): GuideSection {
    return {
      id: 'birth',
      title: 'Doğum anı',
      subtitle: week >= 34 ? 'Yakında — şimdiden hazırlan' : 'İleride ihtiyacın olacak',
      tips: [
        { icon: '⏱️', title: 'Kasılmaları sen say', body: 'Kasılma başlangıçları arasındaki süreyi ölç. 5 dakikada bir gelen, 1 dakika süren ve 1 saattir devam eden kasılmalar hastane zamanı demektir.' },
        { icon: '🗣️', title: 'Sözcüsü ol', body: 'Doğum planınızı sen biliyorsun. Sancı sırasında sağlık ekibiyle iletişimi üstlenmek büyük bir yük alır.' },
        { icon: '🤲', title: 'Fiziksel destek ver', body: 'Bel masajı, sıcak kompres ve nefes eşliği ağrıyı ölçülebilir şekilde azaltır. Sessizce yanında durmak da bir destektir.' },
        { icon: '❤️', title: 'İlk saati koru', body: 'Doğumdan sonraki ilk saat ten tene temas için ayrılmalı. Ziyaretçileri ve telefonları sen yönet.' },
      ],
    };
  }

  private cycleSection(phase: string, day: number, p: { key: string; partnerWord: string }, partnerName: string | null): GuideSection {
    const who = partnerName ?? p.partnerWord;
    const male = p.key === 'male';

    const byPhase: Record<string, GuideSection> = {
      menstrual: {
        id: 'cycle',
        title: `Regl evresi — ${day}. gün`,
        subtitle: 'Hormonlar en düşük seviyede, enerji sınırlı',
        tips: [
          { icon: '🔥', title: 'Sıcaklık ağrıyı azaltır', body: 'Sıcak su torbası kramplarda ibuprofene yakın etki gösterir. Sormadan hazırlaman fark yaratır.' },
          { icon: '🥩', title: 'Demir kaybını telafi et', body: `Kanama demir kaybı demek. ${who} için demirden zengin bir öğün hazırla; C vitamini emilimi artırır.` },
          { icon: '🛋️', title: 'Planları hafiflet', body: male
            ? 'Bu günlerde yoğun sosyal programlar yerine evde sakin bir akşam öner. Reddetmek zorunda kalmaması rahatlatır.'
            : 'Yoğun programlar yerine sakin bir gün önerin; ikinizin de temposu düşebilir.' },
        ],
      },
      follicular: {
        id: 'cycle',
        title: `Foliküler evre — ${day}. gün`,
        subtitle: 'Östrojen yükseliyor, enerji ve motivasyon artıyor',
        tips: [
          { icon: '⚡', title: 'Enerjiyi birlikte kullanın', body: 'Bu evre yeni şeylere başlamak için en uygun dönem. Spor, gezi veya proje planlarını buraya kaydırın.' },
          { icon: '🗓️', title: 'Zor konuşmaları buraya al', body: 'Duygusal dayanıklılığın en yüksek olduğu evre. Bütçe, taşınma gibi konuları bu günlerde konuşmak daha verimli.' },
        ],
      },
      fertile: {
        id: 'cycle',
        title: `Doğurganlık penceresi — ${day}. gün`,
        subtitle: 'Gebe kalma şansının en yüksek olduğu günler',
        tips: [
          { icon: '💗', title: 'Baskıya dönüştürme', body: 'Bu günleri "görev" gibi ele almak ilişkiyi yıpratır. Planlı ama doğal kalmaya çalışın.' },
          { icon: '🚭', title: 'Sperm kalitesi 3 ayda yenilenir', body: male
            ? 'Sigara, aşırı alkol, sıcak küvet ve kucakta dizüstü bilgisayar sperm kalitesini düşürür. Katkı iki taraflı.'
            : 'Sperm üretimi 3 ayda yenilenir; partnerinizin sigara, alkol ve aşırı sıcaktan kaçınması sonucu doğrudan etkiler.' },
          { icon: '📅', title: 'Gün aşırı yeterli', body: 'Her gün ilişki gerekli değil; gün aşırı ilişki sperm yoğunluğunu en iyi seviyede tutar.' },
        ],
      },
      luteal: {
        id: 'cycle',
        title: `Luteal evre — ${day}. gün`,
        subtitle: 'Progesteron yüksek, PMS belirtileri başlayabilir',
        tips: [
          { icon: '🧠', title: 'Tepkiyi kişisel algılama', body: 'Progesteron düşüşü serotonini etkiler. Sinirlilik ilişkinizle değil hormonlarla ilgili olabilir.' },
          { icon: '🍫', title: 'Magnezyum işe yarar', body: 'Bitter çikolata, badem ve muz magnezyum kaynağıdır ve PMS belirtilerini hafifletir.' },
          { icon: '🤐', title: 'Çözmeye değil dinlemeye odaklan', body: 'Bu dönemde "şöyle yapsan" demek yerine "yanındayım" demek çok daha etkilidir.' },
        ],
      },
      late: {
        id: 'cycle',
        title: 'Regl gecikmesi',
        subtitle: 'Beklenen tarih geçildi',
        tips: [
          { icon: '🧪', title: 'Test için sabahı bekleyin', body: 'Sabah ilk idrarda hCG yoğunluğu en yüksektir; sonuç daha güvenilir olur.' },
          { icon: '😌', title: 'Gecikme her zaman gebelik değil', body: 'Stres, seyahat, uyku düzensizliği ve kilo değişimi de gecikmeye yol açar. Baskı yaratmadan destek olun.' },
        ],
      },
    };

    return byPhase[phase] ?? byPhase.follicular;
  }

  private visibilitySection(
    p: { key: string; partnerWord: string },
    partnerName: string | null,
    isPaired: boolean,
  ): GuideSection {
    const who = partnerName ?? p.partnerWord;
    const male = p.key === 'male';
    if (male) {
      return {
        id: 'visibility',
        title: 'Siz ve partneriniz ne görür?',
        subtitle: isPaired ? `${who} ile eşleşmiş durumdasınız` : 'Eşleşince iki ekran da ayrılır',
        tips: [
          { icon: '👨', title: 'Sizin ana ekranınız ilişki', body: 'Regl ve gebelik takibi sizin uygulamanızda açılmaz. Bugün, sohbet, istekler, konum ve çift soruları sizin alanınızdır.' },
          { icon: '👩', title: `${who} sizin neyinizi görür?`, body: 'Konumunuzu (açarsanız), isteklerinizi, sohbeti, aşk notlarınızı ve çift sorusu cevaplarınızı görür. Sizin adınıza bir döngü takvimi oluşturulmaz.' },
          { icon: '🌸', title: 'Siz onun neyini görürsünüz?', body: `Eşleşince ${who} paylaştığı döngü evresini, doğurganlık penceresini veya gebelik haftasını özet olarak görürsünüz. Detaylı semptom günlüğü gizlidir.` },
          { icon: '🔒', title: 'Mahremiyet', body: 'Konum varsayılan olarak kapalıdır. Sohbet ve istekler yalnızca eşleşmiş iki hesapta görünür.' },
        ],
      };
    }
    return {
      id: 'visibility',
      title: 'Partneriniz neler görür?',
      subtitle: isPaired ? `${who} sizin özetinizi görür` : 'Eşleşince bunlar paylaşılır',
      tips: [
        { icon: '👀', title: 'Döngü özeti, detay değil', body: `${who} regl evrenizi ve doğurganlık penceresini görür. Semptom notlarınız, kilo ve özel sağlık kayıtlarınız ona açılmaz.` },
        { icon: '🤰', title: 'Gebelik haftası', body: 'Gebelik takibi açıksa hafta, tahmini doğum ve bebek boyutu karşılaştırması paylaşılır. Hastane çantası ve kişisel notlar size özel kalır.' },
        { icon: '💬', title: 'İlişki alanı ortak', body: 'Çift soruları, sohbet, istekler ve konum (açarsanız) ikinizde de aynıdır.' },
        { icon: '🛡️', title: 'Ne görmez?', body: 'Topluluk mesajlarınız, kişisel değerlendirme skorunuz ve bildirim ayarlarınız partner ekranında yoktur.' },
      ],
    };
  }

  private communicationSection(p: { key: string }, partnerName: string | null): GuideSection {
    const male = p.key === 'male';
    return {
      id: 'communication',
      title: 'İletişim',
      subtitle: male ? 'Erkeklerin en sık düştüğü tuzaklar ve çözümleri' : 'Bağı güçlü tutan iletişim alışkanlıkları',
      tips: male
        ? [
            { icon: '🛠️', title: 'Önce sor, sonra çöz', body: '"Çözüm mü istersin, dinlememi mi?" diye sormak en sık yaşanan yanlış anlaşılmayı ortadan kaldırır.' },
            { icon: '👂', title: 'Sessizlik de destektir', body: 'Her duyguya cevap vermek zorunda değilsin. Yanında oturmak çoğu zaman en etkili karşılıktır.' },
            { icon: '📝', title: 'Görünmez yükü paylaş', body: 'Randevu almak, ilaç takibi, market listesi gibi işler görünmez yüktür. Bir kalemi tamamen üstlenmen büyük fark yaratır.' },
            { icon: '🙏', title: '"Abartıyorsun" deme', body: 'Bu cümle güveni doğrudan zedeler. Onun yerine "zor olmalı, anlıyorum" cümlesini kullan.' },
          ]
        : [
            { icon: '💬', title: 'İhtiyacını açıkça söyle', body: 'Partneriniz aklınızı okuyamaz. "Bugün sadece dinlenmeye ihtiyacım var" demek beklentileri netleştirir.' },
            { icon: '🤝', title: 'Görevleri birlikte listeleyin', body: 'Haftalık 10 dakikalık bir planlama sohbeti, biriken görünmez yükü ikiye böler.' },
            { icon: '🌱', title: 'Takdiri dile getirin', body: 'Yapılan küçük şeylerin fark edildiğini söylemek, davranışın tekrarlanma olasılığını belirgin artırır.' },
            { icon: '⏸️', title: 'Tartışmaya mola koyun', body: 'Gerilim yükseldiğinde 20 dakikalık mola vermek fizyolojik olarak sakinleşmeyi sağlar.' },
          ],
    };
  }

  private intimacySection(p: { key: string }, cyclePhase: string | null, week: number | null): GuideSection {
    const tips: GuideTip[] = [];

    if (week) {
      tips.push({ icon: '🤍', title: 'Gebelikte yakınlık güvenlidir', body: 'Riskli gebelik veya hekim kısıtlaması yoksa cinsel yakınlık gebelik boyunca güvenlidir. Rahatsızlık verirse pozisyon değiştirmek yeterli olur.' });
      if (week >= 28) {
        tips.push({ icon: '🛏️', title: 'Pozisyon önemli', body: '3. trimesterde sırtüstü pozisyon ana damara baskı yapabilir. Yan yatış daha rahat ve güvenlidir.' });
      }
    }
    if (cyclePhase === 'menstrual') {
      tips.push({ icon: '🌙', title: 'Regl döneminde yakınlık', body: 'Tıbbi bir engeli yoktur ve kramp ağrısını hafifletebilir. Tamamen ikinizin konforuna bağlı.' });
    }

    tips.push({ icon: '🫂', title: 'Yakınlık sadece cinsellik değil', body: 'Günde 20 saniyelik sarılma oksitosin salgılatır ve stres hormonunu ölçülebilir şekilde düşürür.' });
    tips.push({ icon: '📵', title: 'Ekransız 30 dakika', body: 'Günde yarım saatlik telefonsuz ortak zaman, ilişki memnuniyetini en çok artıran alışkanlıklardan biridir.' });

    return {
      id: 'intimacy',
      title: 'Yakınlık ve bağ',
      subtitle: 'Fiziksel ve duygusal bağı korumak',
      tips,
    };
  }
}

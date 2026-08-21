export interface PostpartumTask {
  id: string;
  dayFrom: number;
  dayTo: number;
  title: string;
  body: string;
  notifyTitle: string;
}

/** 0 = doğum günü. Tıbbi kırmızı bayraklar dahil, gün gün yapılması gerekenler. */
export const POSTPARTUM_TASKS: PostpartumTask[] = [
  { id: 'd0-rest', dayFrom: 0, dayTo: 1, title: 'Ten tene ve dinlenme', body: 'Bebeği çıplak göğsünüze alın. Ziyaretçi sınırlayın. Kanama pedini her değişimde kontrol edin: 1 saatte bir pedi dolduran kanama acildir.', notifyTitle: 'Lohusalık: ten tene ve kanama kontrolü' },
  { id: 'd0-latch', dayFrom: 0, dayTo: 2, title: 'İlk emzirme / süt colostrum', body: 'İlk 1 saatte emzirme idealdir. Süt gelmese de emme prolaktini uyarır. Bebek 24 saatte en az 8 kez emmeli. Islak bez sayısı 2. günden itibaren artsın.', notifyTitle: 'Emzirme: ilk 48 saat colostrum' },
  { id: 'd1-pee', dayFrom: 1, dayTo: 2, title: 'İdrar ve gaz çıkışı', body: 'Doğumdan sonra 6 saat içinde idrar yapamazsanız bildirin (kateter / ödem). Sezaryende gaz çıkışı yürüyüşle hızlanır. Ateş >38°C hekime.', notifyTitle: 'İdrar yapabildiğinizi kontrol edin' },
  { id: 'd3-milk', dayFrom: 3, dayTo: 5, title: 'Süt dolması (engorjman)', body: '3–5. günde süt artar, göğüsler sertleşebilir. Sık emzirme, ılık duş, doğru kavrama. Tek tarafta kızarıklık+ateş = mastit şüphesi, gecikmeyin.', notifyTitle: 'Süt geliyor: göğüs bakımı günü' },
  { id: 'd3-jaundice', dayFrom: 3, dayTo: 5, title: 'Bebek sarılığı tarama', body: 'Yüz ve göz beyazında sarılaşma 3. günden sonra artabilir. Uyandırılmayan, az emen, ıslak bezi az bebek için aynı gün hekim. Topuk kanı çoğu yerde 24–48 saatte alınır; alınmadıysa takip edin.', notifyTitle: 'Bebek sarılığı ve ıslak bez takibi' },
  { id: 'd5-umbilical', dayFrom: 5, dayTo: 10, title: 'Göbek ve yara bakımı', body: 'Göbek kordonu kuru kalsın, idrarla ıslanırsa kurulayın. Kötü koku, kızarıklık, ateş acildir. Sezaryen/epizyotomi dikişi kuru ve temiz; tampon yok, ped var.', notifyTitle: 'Göbek kordonu ve dikiş kontrolü' },
  { id: 'd7-blues', dayFrom: 7, dayTo: 14, title: 'Baby blues penceresi', body: 'İlk 2 hafta ağlama, kaygı, uykusuzluk yaygındır. 2 haftayı geçen umutsuzluk, bebeğe zarar verme düşüncesi, iştahsızlık postpartum depresyon belirtisidir — 112 / hekim / yakın destek.', notifyTitle: 'Ruh halinizi 2 haftalık pencereyle izleyin' },
  { id: 'd10-walk', dayFrom: 10, dayTo: 21, title: 'Kısa yürüyüş, pelvik istirahat', body: 'Hekim izin verdiyse 10–15 dk düz yürüyüş dolaşımı açar. Cinsel ilişki, tampon, havuz genelde 6. hafta kontrole kadar bekler. Ağır kaldırmayın.', notifyTitle: 'Kısa yürüyüş; ağır yok' },
  { id: 'd15-bleeding', dayFrom: 14, dayTo: 21, title: 'Löşi rengi değişmeli', body: 'Kanama kırmızıdan pembe-kahveye, sonra sarı-beyaza döner. Ani parlak kırmızı geri dönüş, pıhtı > golf topu, kötü koku: aynı gün kadın doğum.', notifyTitle: 'Lohusia kanaması azalmalı' },
  { id: 'd21-support', dayFrom: 21, dayTo: 28, title: 'Yardım isteyin, uyku penceresi', body: 'Gece bakımı paylaşın. İlaç (ağrı kesici, demir, tiroid) reçeteye uyun. Emzirme ağrısı 3. haftada hâlâ şiddetliyse dil bağı / kavrama için danışman.', notifyTitle: 'Destek ağı ve ilaç saatleri' },
  { id: 'd28-baby', dayFrom: 28, dayTo: 35, title: '1. ay bebek izlemi', body: 'Kilo alımı (doğum kilosunu 10–14 günde yakalamak hedeflenir), aşı takvimi 2. ay BCG/karma için randevu alın. Sizin 6. hafta lohusa muayenenizi şimdiden yazın.', notifyTitle: '1. ay kontrol ve 2. ay aşı randevusu' },
  { id: 'd40-lohusa', dayFrom: 40, dayTo: 42, title: '40. gün ve 6. hafta muayene', body: 'Kültürel 40 gün dinlenme tıbbi 6 haftalık involüsyonla örtüşür. Kadın doğum: yara, kanama, tansiyon, duygu durumu, aile planlaması. Bebek: büyüme, aşı. Cinsel ilişki onayı bu vizitte konuşulur.', notifyTitle: '6. hafta lohusa ve bebek muayenesi' },
];

export function tasksForDay(day: number): PostpartumTask[] {
  return POSTPARTUM_TASKS.filter((t) => day >= t.dayFrom && day <= t.dayTo);
}

export function upcomingTasks(day: number): PostpartumTask[] {
  return POSTPARTUM_TASKS.filter((t) => t.dayFrom > day && t.dayFrom <= day + 7);
}

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useDoctorSummary, type DoctorSummary } from '@/src/api/bloomClient';
import { loadMedications } from '@/src/notifications/bloomAlerts';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { BrandLogo } from '@/src/components/BrandLogo';

const DISCLAIMER =
  'SORUMLULUK REDDİ: Bu belge Pusena uygulamasında kullanıcının kendi girdiği kayıtlardan üretilmiştir. ' +
  'Eksik, hatalı veya güncel olmayan veri içerebilir. Pusena ve geliştiricileri tıbbi teşhis, tedavi veya ' +
  'acil durum kararı vermez; hekim muayenesinin yerine geçmez. Sunulan özet yalnızca görüşmeye hazırlık ' +
  'içindir. Tıbbi kararlar yalnızca sağlık profesyoneline aittir. Kullanıcı, paylaştığı verinin doğruluğundan ' +
  'kendisi sorumludur.';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHtml(data: DoctorSummary, meds: { name: string; dosage: string; times: string[] }[]) {
  const p = data.profile;
  const age = p.birthYear ? new Date().getFullYear() - p.birthYear : null;
  const preg = data.pregnancy;
  const cycles = data.cycle.lastCycles
    .map((c) => `<tr><td>${esc(c.startDate)}</td><td>${c.endDate || '—'}</td><td>${c.cycleLength}</td><td>${c.periodLength}</td></tr>`)
    .join('');
  const symptoms = data.symptoms.recent
    .map((s) => `<tr><td>${esc(s.date)}</td><td>${esc(s.type)}</td><td>${s.severity}/5</td><td>${esc(s.notes || '')}</td></tr>`)
    .join('');
  const top = data.symptoms.top
    .map((s) => `<li>${esc(s.type)} — ${s.count} kayıt, son: ${esc(s.lastDate)}</li>`)
    .join('');
  const medRows = meds.length
    ? meds.map((m) => `<li>${esc(m.name)} (${esc(m.dosage)}) — saatler: ${esc(m.times.join(', '))}</li>`).join('')
    : '<li>Uygulamada ilaç kaydı yok.</li>';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1f2937; padding: 28px; font-size: 12px; }
    h1 { color: #E11D74; font-size: 20px; margin: 0 0 4px; }
    h2 { font-size: 14px; margin: 18px 0 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    .muted { color: #6b7280; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #e5e7eb; padding: 6px; text-align: left; font-size: 11px; }
    th { background: #fdf2f8; }
    .box { background: #f9fafb; padding: 10px; border-radius: 8px; margin: 8px 0; }
    .legal { margin-top: 28px; font-size: 9px; color: #6b7280; line-height: 1.45; border-top: 1px solid #ddd; padding-top: 10px; }
  </style></head><body>
  <h1>Pusena sağlık özeti</h1>
  <p class="muted">Oluşturma: ${esc(new Date(data.generatedAt).toLocaleString('tr-TR'))} · Hasta adı (uygulama): ${esc(p.name)}</p>
  <div class="box">
    ${age ? `Tahmini yaş (doğum yılından): ${age}. ` : 'Doğum yılı girilmemiş. '}
    ${p.heightCm ? `Boy: ${p.heightCm} cm. ` : ''}
    ${p.weightKg ? `Kilo: ${p.weightKg} kg.` : ''}
  </div>
  <h2>Gebelik</h2>
  ${preg
    ? `<p>${preg.currentWeek}. hafta + ${preg.currentDay} gün. TAHMİNİ doğum: ${esc(preg.dueDate)}.
       Son adet (LMP): ${esc(preg.lastMenstrualPeriod)}. Kalan gün (hesap): ${preg.daysRemaining}.
       ${preg.babyName ? 'Bebek adı (kullanıcı): ' + esc(preg.babyName) + '.' : ''}</p>`
    : '<p>Aktif gebelik kaydı yok.</p>'}
  <h2>Döngü kayıtları</h2>
  <p>Girilen döngü sayısı: ${data.cycle.totalLogged}.
     Ortalama döngü: ${data.cycle.averageCycleLength ?? '—'} gün.
     Ortalama kanama: ${data.cycle.averagePeriodLength ?? '—'} gün.</p>
  ${cycles
    ? `<table><tr><th>Başlangıç</th><th>Bitiş</th><th>Döngü (gün)</th><th>Kanama (gün)</th></tr>${cycles}</table>`
    : '<p>Döngü satırı yok.</p>'}
  <h2>Semptomlar (son 90 gün)</h2>
  <p>Toplam kayıt: ${data.symptoms.totalLast90Days}</p>
  ${top ? `<ul>${top}</ul>` : '<p>Semptom kaydı yok.</p>'}
  ${symptoms
    ? `<table><tr><th>Tarih</th><th>Semptom</th><th>Şiddet</th><th>Not</th></tr>${symptoms}</table>`
    : ''}
  <h2>İlaç / vitamin (telefon kaydı)</h2>
  <ul>${medRows}</ul>
  <h2>Kullanıcı değerlendirmesi</h2>
  ${data.assessment
    ? `<p>Hedef: ${esc(data.assessment.goal || '—')}. Döngü düzeni: ${esc(data.assessment.cycleRegularity || '—')}.
       Koşullar: ${esc((data.assessment.healthConditions || []).join(', ') || '—')}.</p>`
    : '<p>Değerlendirme formu doldurulmamış.</p>'}
  <p class="legal">${esc(DISCLAIMER)}</p>
  </body></html>`;
}

export default function HealthReportScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useDoctorSummary();
  const [busy, setBusy] = useState(false);

  const exportPdf = async () => {
    if (!data) return;
    setBusy(true);
    try {
      const meds = await loadMedications();
      const html = buildHtml(data, meds);
      const Print = await import('expo-print');
      const Sharing = await import('expo-sharing');
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const can = await Sharing.isAvailableAsync();
      if (can) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Doktor özeti PDF' });
      } else {
        await Print.printAsync({ html });
      }
    } catch {
      Alert.alert(
        'PDF oluşturulamadı',
        'Cihazda yazdırma/paylaşım kullanılamıyor olabilir. Özeti ekrandan hekiminize gösterebilirsiniz.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (isLoading && !data) return <LoadingScreen />;

  const preg = data?.pregnancy;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Doktor muayene özeti</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Pusena · yalnızca sizin girdiğiniz veriler</Text>
        </View>
        <BrandLogo size={32} />
        <Pressable
          style={[styles.shareBtn, { backgroundColor: Colors.floPink, opacity: busy ? 0.6 : 1 }]}
          onPress={exportPdf}
          disabled={busy || !data}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Ionicons name="download-outline" size={18} color="#FFFFFF" />}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => refetch()} style={{ marginBottom: 8 }}>
          <Text style={{ color: Colors.floTeal, fontWeight: '700' }}>{isRefetching ? 'Yenileniyor…' : 'Verileri yenile'}</Text>
        </Pressable>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.h, { color: colors.text }]}>{data?.profile.name}</Text>
          <Text style={[styles.p, { color: colors.textMuted }]}>
            {data?.profile.birthYear ? `Doğum yılı: ${data.profile.birthYear}` : 'Doğum yılı yok'}
            {data?.profile.heightCm ? ` · ${data.profile.heightCm} cm` : ''}
            {data?.profile.weightKg ? ` · ${data.profile.weightKg} kg` : ''}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.h, { color: colors.text }]}>Gebelik</Text>
          {preg ? (
            <Text style={[styles.p, { color: colors.textSecondary }]}>
              {preg.currentWeek}. hafta + {preg.currentDay} gün. Tahmini doğum {preg.dueDate}. LMP {preg.lastMenstrualPeriod}.
              Kalan {preg.daysRemaining} gün.
            </Text>
          ) : (
            <Text style={[styles.p, { color: colors.textMuted }]}>Aktif gebelik kaydı yok.</Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.h, { color: colors.text }]}>Döngü</Text>
          <Text style={[styles.p, { color: colors.textSecondary }]}>
            {data?.cycle.totalLogged ?? 0} kayıt. Ort. döngü {data?.cycle.averageCycleLength ?? '—'} gün, kanama{' '}
            {data?.cycle.averagePeriodLength ?? '—'} gün.
          </Text>
          {(data?.cycle.lastCycles || []).slice(0, 5).map((c) => (
            <Text key={c.startDate} style={[styles.li, { color: colors.textMuted }]}>
              {c.startDate} → {c.endDate || 'devam'} ({c.cycleLength}/{c.periodLength} gün)
            </Text>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.h, { color: colors.text }]}>Semptomlar (90 gün)</Text>
          <Text style={[styles.p, { color: colors.textSecondary }]}>{data?.symptoms.totalLast90Days ?? 0} kayıt</Text>
          {(data?.symptoms.top || []).map((s) => (
            <Text key={s.type} style={[styles.li, { color: colors.textMuted }]}>
              {s.type}: {s.count} kez, son {s.lastDate}
            </Text>
          ))}
          {!(data?.symptoms.top || []).length && (
            <Text style={[styles.p, { color: colors.textMuted }]}>Semptom girilmemiş.</Text>
          )}
        </View>

        <View style={[styles.legal, { backgroundColor: isDark ? '#2A2420' : '#FFFBEB' }]}>
          <Text style={[styles.legalTitle, { color: colors.text }]}>Sorumluluk</Text>
          <Text style={[styles.legalBody, { color: colors.textSecondary }]}>{DISCLAIMER}</Text>
        </View>

        <Pressable style={[styles.pdfBtn, { backgroundColor: Colors.floPink }]} onPress={exportPdf} disabled={busy || !data}>
          <Ionicons name="document-outline" size={18} color="#fff" />
          <Text style={styles.pdfBtnText}>{busy ? 'Hazırlanıyor…' : 'PDF indir / paylaş'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  shareBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  h: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  p: { fontSize: 13, lineHeight: 19 },
  li: { fontSize: 12, marginTop: 4 },
  legal: { padding: 14, borderRadius: 14, marginTop: 8, marginBottom: 16 },
  legalTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  legalBody: { fontSize: 11, lineHeight: 16 },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  pdfBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

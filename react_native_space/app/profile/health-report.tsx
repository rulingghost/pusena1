import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
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
  'TIBBİ SORUMLULUK REDDİ: Bu belge Pusena uygulamasında kullanıcının kendi girdiği kişisel sağlık kayıtlarından üretilmiştir. ' +
  'Eksik, hatalı veya güncel olmayan veri içerebilir. Pusena ve geliştiricileri tıbbi teşhis, reçete veya acil durum kararı vermez; ' +
  'uzman hekim muayenesinin yerine geçmez. Sunulan özet yalnızca hekim görüşmesine hazırlık ve bilgi amaçlıdır. ' +
  'Kullanıcı, paylaştığı bilgilerin doğruluğundan bizzat sorumludur.';

function esc(s: string) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHtml(data: DoctorSummary, meds: { name: string; dosage: string; times: string[] }[]) {
  const p = data.profile;
  const currentYear = new Date().getFullYear();
  const age = p.birthYear ? currentYear - p.birthYear : null;
  const preg = data.pregnancy;

  // BMI Calculation
  let bmiText = '';
  if (p.heightCm && p.weightKg && p.heightCm > 0) {
    const heightM = p.heightCm / 100;
    const bmi = (p.weightKg / (heightM * heightM)).toFixed(1);
    let category = 'Normal';
    if (parseFloat(bmi) < 18.5) category = 'Zayıf';
    else if (parseFloat(bmi) >= 25 && parseFloat(bmi) < 30) category = 'Fazla Kilolu';
    else if (parseFloat(bmi) >= 30) category = 'Obez';
    bmiText = ` · VKİ: ${bmi} (${category})`;
  }

  const reportDateFormatted = new Date(data.generatedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const reportId = `PSN-${Math.abs(data.generatedAt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 107).toString().slice(0, 6)}`;

  const cycles = data.cycle.lastCycles.length > 0
    ? data.cycle.lastCycles
        .map(
          (c) => `
        <tr>
          <td><span class="date-badge">${esc(c.startDate)}</span></td>
          <td>${c.endDate ? `<span class="date-badge">${esc(c.endDate)}</span>` : '<span class="muted">Devam ediyor</span>'}</td>
          <td><strong>${c.cycleLength} gün</strong></td>
          <td><strong>${c.periodLength} gün</strong></td>
        </tr>`
        )
        .join('')
    : '<tr><td colspan="4" class="text-center muted">Kayıtlı döngü verisi bulunmamaktadır.</td></tr>';

  const severityBadge = (sev: number) => {
    if (sev <= 2) return `<span class="sev-tag sev-low">Hafif (${sev}/5)</span>`;
    if (sev === 3) return `<span class="sev-tag sev-mid">Orta (${sev}/5)</span>`;
    return `<span class="sev-tag sev-high">Şiddetli (${sev}/5)</span>`;
  };

  const symptoms = data.symptoms.recent.length > 0
    ? data.symptoms.recent
        .slice(0, 15)
        .map(
          (s) => `
        <tr>
          <td><span class="date-badge">${esc(s.date)}</span></td>
          <td><strong>${esc(s.type)}</strong></td>
          <td>${severityBadge(s.severity)}</td>
          <td>${s.notes ? esc(s.notes) : '<span class="muted">—</span>'}</td>
        </tr>`
        )
        .join('')
    : '<tr><td colspan="4" class="text-center muted">Son 90 günde kaydedilmiş semptom bulunmamaktadır.</td></tr>';

  const topChips = data.symptoms.top.length > 0
    ? data.symptoms.top
        .map(
          (s) => `
        <div class="symptom-stat-card">
          <div class="symptom-stat-name">${esc(s.type)}</div>
          <div class="symptom-stat-count">${s.count} kez kaydedildi</div>
          <div class="symptom-stat-sub">En Yüksek: ${s.maxSeverity}/5 · Son: ${esc(s.lastDate)}</div>
        </div>`
        )
        .join('')
    : '<div class="muted">Öne çıkan semptom kaydı bulunmuyor.</div>';

  const medCards = meds.length > 0
    ? meds
        .map(
          (m) => `
        <div class="med-item">
          <div class="med-name">💊 ${esc(m.name)} <span class="med-dosage">(${esc(m.dosage)})</span></div>
          <div class="med-times">Hatırlatma saatleri: ${esc(m.times.join(', '))}</div>
        </div>`
        )
        .join('')
    : '<div class="muted">Uygulamada kayıtlı ilaç veya takviye bulunmamaktadır.</div>';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <title>Pusena Doktor Muayene Raporu</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.5;
    }
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 2px solid #E11D74;
      margin-bottom: 14px;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #E11D74;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .report-meta {
      text-align: right;
      font-size: 10px;
      color: #64748B;
    }
    .report-badge {
      display: inline-block;
      background: #FDF2F8;
      color: #BE185D;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      margin-bottom: 4px;
      border: 1px solid #FBCFE8;
    }
    .patient-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .patient-name {
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
    }
    .patient-details {
      font-size: 11px;
      color: #475569;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .stat-box {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .stat-val {
      font-size: 16px;
      font-weight: 800;
      color: #E11D74;
      margin-bottom: 2px;
    }
    .stat-label {
      font-size: 9px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #F1F5F9;
      padding-bottom: 4px;
      margin-top: 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 12px;
      background: #E11D74;
      border-radius: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10px;
    }
    th {
      background: #FDF2F8;
      color: #9D174D;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #FCE7F3;
    }
    td {
      padding: 6px 10px;
      border: 1px solid #E2E8F0;
      color: #334155;
    }
    tr:nth-child(even) td {
      background: #FAFAFA;
    }
    .text-center { text-align: center; }
    .muted { color: #94A3B8; font-style: italic; }
    .date-badge {
      font-family: monospace;
      color: #475569;
      background: #F1F5F9;
      padding: 2px 5px;
      border-radius: 4px;
    }
    .sev-tag {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 12px;
      display: inline-block;
    }
    .sev-low { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
    .sev-mid { background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; }
    .sev-high { background: #FEE2E2; color: #B91C1C; border: 1px solid #FECACA; }
    .top-symptoms-wrap {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    .symptom-stat-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 8px 10px;
    }
    .symptom-stat-name {
      font-weight: 700;
      font-size: 11px;
      color: #0F172A;
    }
    .symptom-stat-count {
      color: #E11D74;
      font-weight: 700;
      font-size: 10px;
    }
    .symptom-stat-sub {
      font-size: 9px;
      color: #64748B;
      margin-top: 2px;
    }
    .med-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    .med-item {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 8px 12px;
    }
    .med-name {
      font-weight: 700;
      font-size: 11px;
      color: #0F172A;
    }
    .med-dosage {
      color: #64748B;
      font-weight: normal;
    }
    .med-times {
      font-size: 10px;
      color: #475569;
      margin-top: 2px;
    }
    .preg-banner {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .preg-title {
      font-weight: 800;
      color: #B45309;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .preg-text {
      font-size: 11px;
      color: #78350F;
      line-height: 1.5;
    }
    .doctor-notes-box {
      border: 1.5px dashed #CBD5E1;
      border-radius: 10px;
      padding: 12px;
      margin-top: 14px;
      background: #FAFAFA;
    }
    .doctor-notes-title {
      font-weight: 700;
      color: #475569;
      font-size: 10px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .rule-lines {
      height: 38px;
      border-bottom: 1px solid #E2E8F0;
      margin-bottom: 12px;
    }
    .doctor-sign-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 9px;
      color: #64748B;
    }
    .disclaimer-box {
      margin-top: 16px;
      padding: 8px 12px;
      background: #F1F5F9;
      border-radius: 6px;
      font-size: 8px;
      color: #64748B;
      line-height: 1.45;
      text-align: justify;
    }
    .footer-line {
      margin-top: 10px;
      text-align: center;
      font-size: 8px;
      color: #94A3B8;
    }
  </style>
</head>
<body>

  <!-- Top Header Banner -->
  <div class="header-banner">
    <div class="logo-area">
      <div>
        <h1 class="brand-title">Pusena</h1>
        <div class="brand-sub">Kadın Sağlığı & Döngü Takip Sistemi</div>
      </div>
    </div>
    <div class="report-meta">
      <div class="report-badge">KLİNİK DOKTOR MUAYENE ÖZETİ</div>
      <div><strong>Rapor No:</strong> ${reportId}</div>
      <div><strong>Oluşturma:</strong> ${reportDateFormatted}</div>
    </div>
  </div>

  <!-- Patient Details -->
  <div class="patient-card">
    <div>
      <div class="patient-name">${esc(p.name)}</div>
      <div class="patient-details">
        ${age ? `Yaş: ${age}` : 'Yaş: Belirtilmedi'} · 
        ${p.heightCm ? `Boy: ${p.heightCm} cm` : 'Boy: —'} · 
        ${p.weightKg ? `Kilo: ${p.weightKg} kg` : 'Kilo: —'}
        ${bmiText}
      </div>
    </div>
    <div style="text-align: right; font-size: 10px; color: #64748B;">
      <div>Veri Kaynağı: Kullanıcı Günlük Kayıtları</div>
      <div>Gizlilik: Tıbbi & Kişisel Veri</div>
    </div>
  </div>

  <!-- Summary Statistics Grid -->
  <div class="stat-grid">
    <div class="stat-box">
      <div class="stat-val">${data.cycle.averageCycleLength ? `${data.cycle.averageCycleLength} gün` : '—'}</div>
      <div class="stat-label">Ortalama Döngü</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">${data.cycle.averagePeriodLength ? `${data.cycle.averagePeriodLength} gün` : '—'}</div>
      <div class="stat-label">Ortalama Kanama</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">${data.cycle.totalLogged}</div>
      <div class="stat-label">Kayıtlı Döngü</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">${data.symptoms.totalLast90Days}</div>
      <div class="stat-label">90 Günlük Semptom</div>
    </div>
  </div>

  <!-- Pregnancy Panel if Active -->
  ${preg && preg.isActive
    ? `<div class="preg-banner">
        <div class="preg-title">🤰 Aktif Gebelik Takibi</div>
        <div class="preg-text">
          <strong>Gebelik Yaşı:</strong> ${preg.currentWeek}. Hafta + ${preg.currentDay} Gün · 
          <strong>Tahmini Doğum (EDD):</strong> ${esc(preg.dueDate)} · 
          <strong>Son Adet Tarihi (LMP):</strong> ${esc(preg.lastMenstrualPeriod)} · 
          <strong>Kalan Gün:</strong> ${preg.daysRemaining} gün
          ${preg.babyName ? ` · <strong>Bebek Lakabı:</strong> ${esc(preg.babyName)}` : ''}
        </div>
      </div>`
    : ''
  }

  <!-- Cycles Table -->
  <div class="section-title">Kayıtlı Döngü Geçmişi</div>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Döngü Başlangıcı</th>
        <th style="width: 25%;">Döngü Bitişi</th>
        <th style="width: 25%;">Döngü Süresi</th>
        <th style="width: 25%;">Kanama Süresi</th>
      </tr>
    </thead>
    <tbody>
      ${cycles}
    </tbody>
  </table>

  <!-- Top Symptoms -->
  <div class="section-title">En Sık Görülen Belirtiler (Son 90 Gün)</div>
  <div class="top-symptoms-wrap">
    ${topChips}
  </div>

  <!-- Recent Symptoms Table -->
  <div class="section-title">Son Semptom ve Vücut Sinyalleri Kayıtları</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Tarih</th>
        <th style="width: 28%;">Semptom / Durum</th>
        <th style="width: 22%;">Şiddet Derecesi</th>
        <th style="width: 30%;">Kullanıcı Notu</th>
      </tr>
    </thead>
    <tbody>
      ${symptoms}
    </tbody>
  </table>

  <!-- Medications -->
  <div class="section-title">Kullanılan İlaçlar, Vitaminler ve Takviyeler</div>
  <div class="med-grid">
    ${medCards}
  </div>

  <!-- Clinical Assessment Info if available -->
  ${data.assessment && (data.assessment.goal || data.assessment.cycleRegularity || (data.assessment.healthConditions && data.assessment.healthConditions.length > 0))
    ? `<div class="section-title">Kullanıcı Genel Sağlık Değerlendirmesi</div>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; font-size: 10px; color: #334155;">
        ${data.assessment.goal ? `<strong>Kullanım Amacı:</strong> ${esc(data.assessment.goal)} · ` : ''}
        ${data.assessment.cycleRegularity ? `<strong>Döngü Düzeni:</strong> ${esc(data.assessment.cycleRegularity)} · ` : ''}
        <strong>Mevcut Koşullar / Teşhisler:</strong> ${esc((data.assessment.healthConditions || []).join(', ') || 'Belirtilmedi')}
      </div>`
    : ''
  }

  <!-- Physician Notes Box -->
  <div class="doctor-notes-box">
    <div class="doctor-notes-title">Hekim Muayene & Tedavi Planlama Notları</div>
    <div class="rule-lines"></div>
    <div class="doctor-sign-row">
      <div>Muayene Eden Hekim: ____________________________________</div>
      <div>Kaşe / İmza: ________________________</div>
    </div>
  </div>

  <!-- Disclaimer -->
  <div class="disclaimer-box">
    ${esc(DISCLAIMER)}
  </div>

  <div class="footer-line">
    Pusena Sağlık Teknolojileri · pusena.com · Bu rapor hekim görüşmesi için kullanıcı tarafından oluşturulmuştur.
  </div>

</body>
</html>`;
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
      const FileSystem = await import('expo-file-system/legacy');

      const { uri } = await Print.printToFileAsync({ html, base64: false });

      // Build requested file name: Pusena_Doktor_Raporu_[Isim]_[Tarih].pdf
      const safeName = (data.profile.name || 'Kullanici')
        .trim()
        .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '_')
        .replace(/_+/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      const targetFilename = `Pusena_Doktor_Raporu_${safeName}_${dateStr}.pdf`;

      const targetUri = `${FileSystem.cacheDirectory || FileSystem.documentDirectory}${targetFilename}`;
      await FileSystem.copyAsync({ from: uri, to: targetUri });

      const can = await Sharing.isAvailableAsync();
      if (can) {
        await Sharing.shareAsync(targetUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Pusena Doktor Raporu - ${data.profile.name || ''}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        await Print.printAsync({ html });
      }
    } catch (e: any) {
      Alert.alert(
        'PDF oluşturulamadı',
        'Cihazda yazdırma veya paylaşım gerçekleştirilemedi. Raporu doğrudan ekrandan hekiminize gösterebilirsiniz.',
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
          <Text style={[styles.title, { color: colors.text }]}>Doktor Muayene Raporu</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Pusena Klinik Sağlık Özeti</Text>
        </View>
        <BrandLogo size={32} />
        <Pressable
          style={[styles.shareBtn, { backgroundColor: Colors.floPink, opacity: busy ? 0.6 : 1 }]}
          onPress={exportPdf}
          disabled={busy || !data}
        >
          {busy ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="share-outline" size={20} color="#fff" />
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: isDark ? colors.card : '#FDF2F8', borderColor: Colors.floPink + '30' }]}>
          <Ionicons name="document-text-outline" size={28} color={Colors.floPink} style={{ marginBottom: 6 }} />
          <Text style={[styles.heroTitle, { color: colors.text }]}>Hekim Görüşmesine Hazırlık</Text>
          <Text style={[styles.heroText, { color: colors.textSecondary }]}>
            Bu özet; girdiğiniz döngü günleri, 90 günlük semptom dağılımı, ilaçlarınız ve gebelik durumunuzu
            doktorunuzun hızla inceleyebileceği resmi klinik formatında PDF olarak sunar.
          </Text>
          <Pressable
            style={[styles.pdfButton, { backgroundColor: Colors.floPink }]}
            onPress={exportPdf}
            disabled={busy || !data}
          >
            <Ionicons name="download-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.pdfButtonText}>
              {busy ? 'PDF Hazırlanıyor...' : 'PDF Doktor Raporunu İndir'}
            </Text>
          </Pressable>
        </View>

        {preg && preg.isActive ? (
          <View style={[styles.card, { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>🤰 Gebelik Durumu</Text>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              {preg.currentWeek}. hafta + {preg.currentDay} gün · Tahmini doğum: {preg.dueDate}
            </Text>
            {preg.babyName ? (
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>Bebek adı: {preg.babyName}</Text>
            ) : null}
          </View>
        ) : null}

        <View style={[styles.card, { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🌸 Döngü Özeti</Text>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={[styles.metricNumber, { color: Colors.floPink }]}>
                {data?.cycle.averageCycleLength ?? '—'}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Ortalama Döngü (gün)</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricNumber, { color: Colors.floPink }]}>
                {data?.cycle.averagePeriodLength ?? '—'}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Ortalama Kanama (gün)</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🩺 En Sık Kaydedilen Semptomlar</Text>
          {data?.symptoms.top && data.symptoms.top.length > 0 ? (
            data.symptoms.top.map((s, idx) => (
              <View key={idx} style={styles.symptomRow}>
                <Text style={[styles.symptomName, { color: colors.text }]}>{s.type}</Text>
                <Text style={[styles.symptomCount, { color: colors.textMuted }]}>{s.count} kayıt</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.cardSub, { color: colors.textMuted }]}>Son 90 günde semptom kaydı yok.</Text>
          )}
        </View>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>{DISCLAIMER}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: '700' },
  subtitle: { fontSize: 12 },
  shareBtn: {
    marginLeft: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, gap: 14 },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    textAlign: 'center',
  },
  heroTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  heroText: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 14 },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pdfButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardText: { fontSize: 14, lineHeight: 20 },
  cardSub: { fontSize: 12 },
  metricRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  metricBox: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 10, backgroundColor: '#F8FAFC' },
  metricNumber: { fontSize: 22, fontWeight: '800' },
  metricLabel: { fontSize: 11, textAlign: 'center', marginTop: 2 },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  symptomName: { fontSize: 14, fontWeight: '600' },
  symptomCount: { fontSize: 12 },
  disclaimer: { fontSize: 10, lineHeight: 15, paddingHorizontal: 4, marginTop: 6 },
});

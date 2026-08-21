import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAssessment, useSaveAssessment, type AssessmentResult } from '@/src/api/bloomClient';
import { getErrorMessage } from '@/src/api/customFetch';

interface Option {
  label: string;
  value: string;
}

interface Question {
  id: string;
  /** Which field of the backend payload this question feeds. */
  field: 'mood' | 'goal' | 'tryingDuration' | 'fertileAwareness' | 'cycleRegularity' | 'contraceptionPast' | 'healthConditions' | 'partnerInvolvement';
  title: string;
  subtitle?: string;
  options?: Option[];
  multiple?: boolean;
  type?: 'options' | 'height_weight' | 'age';
}

const QUESTIONS: Question[] = [
  {
    id: 'mood',
    field: 'mood',
    title: 'Kendinizi nasıl hissediyorsunuz?',
    subtitle: 'Bu yolculuk heyecan verici ve yorucu olabilir. Yanınızda olduğumuzu bilmenizi istiyoruz.',
    options: [
      { label: 'Bu, heyecan verici bir yolculuğun ilk adımları 😃', value: 'excited' },
      { label: 'Biraz hazırlıksız hissediyorum 😐', value: 'unprepared' },
      { label: 'Endişeli veya stresliyim 😟', value: 'anxious' },
      { label: 'Her duygudan biraz var ☺️', value: 'mixed' },
    ],
  },
  {
    id: 'goal',
    field: 'goal',
    title: 'Bu uygulamayı hangi amaçla kullanıyorsunuz?',
    subtitle: 'Tüm tahminler ve öneriler bu seçime göre şekillenecek.',
    options: [
      { label: 'Gebe kalmak istiyorum', value: 'ttc' },
      { label: 'Genel döngü ve sağlık takibi yapıyorum', value: 'track' },
      { label: 'Doğal korunma ve farkındalık istiyorum', value: 'natural' },
    ],
  },
  {
    id: 'tryingDuration',
    field: 'tryingDuration',
    title: 'Ne süredir gebe kalmaya çalışıyorsunuz?',
    subtitle: 'Deneme süresi, ne zaman tıbbi değerlendirme önerileceğini belirler.',
    options: [
      { label: 'Yeni başladım', value: 'new' },
      { label: '0 ila 3 ay', value: '0-3' },
      { label: '3 ila 6 ay', value: '3-6' },
      { label: '6 ay ila 1 yıl', value: '6-12' },
      { label: 'Bir yıldan fazla', value: '12plus' },
    ],
  },
  {
    id: 'fertileAwareness',
    field: 'fertileAwareness',
    title: 'Doğurgan döneminizi biliyor musunuz?',
    options: [
      { label: 'Evet, takip ediyorum', value: 'yes' },
      { label: 'Hayır, takip etmiyorum', value: 'no' },
      { label: 'Doğurgan dönemimi bilmiyorum', value: 'unknown' },
    ],
  },
  {
    id: 'cycleRegularity',
    field: 'cycleRegularity',
    title: 'Adetleriniz düzenli mi?',
    subtitle: 'Düzenli olduğunda adetleriniz arasındaki gün sayısı her ay yaklaşık olarak aynıdır.',
    options: [
      { label: 'Evet, düzenli', value: 'regular' },
      { label: 'Hayır, düzensiz', value: 'irregular' },
      { label: 'Bilmiyorum', value: 'unknown' },
    ],
  },
  {
    id: 'contraceptionPast',
    field: 'contraceptionPast',
    title: 'Son 6 ay içinde doğum kontrol yöntemi kullandınız mı?',
    subtitle: 'Bazı yöntemler bırakıldıktan sonra döngünün oturması birkaç ay sürebilir.',
    options: [
      { label: 'Hayır', value: 'none' },
      { label: 'Hâlâ kullanıyorum', value: 'current' },
      { label: 'Evet, doğum kontrol hapı', value: 'pill' },
      { label: 'Evet, hormonal spiral', value: 'hormonal_iud' },
      { label: 'Evet, kondom veya hormonal olmayan yöntem', value: 'barrier' },
      { label: 'Yanıtlamak istemiyorum', value: 'skip' },
    ],
  },
  {
    id: 'age',
    field: 'mood',
    title: 'Yaşınız kaç?',
    subtitle: 'Yaş, aylık gebe kalma olasılığını en çok etkileyen tek faktördür.',
    type: 'age',
  },
  {
    id: 'height_weight',
    field: 'mood',
    title: 'Boyunuz ve kilonuz ne kadar?',
    subtitle: 'Vücut kitle indeksi ovülasyon ve hormon dengesi hakkında en temel ipuçlarını verir.',
    type: 'height_weight',
  },
  {
    id: 'healthConditions',
    field: 'healthConditions',
    title: 'Aşağıdaki üreme sağlığı durumlarından herhangi biri sizde var mı?',
    subtitle: 'Birden fazla seçebilirsiniz. Size uygun içerikleri buna göre sunuyoruz.',
    multiple: true,
    options: [
      { label: 'Endometriozis', value: 'endometriosis' },
      { label: 'Polikistik over sendromu (PCOS)', value: 'pcos' },
      { label: 'Tiroid rahatsızlığı', value: 'thyroid' },
      { label: 'Fibroid (miyom)', value: 'fibroid' },
      { label: 'Emin değilim', value: 'unsure' },
      { label: 'Hayır, sağlık sorunum yok', value: 'none' },
    ],
  },
  {
    id: 'partnerInvolvement',
    field: 'partnerInvolvement',
    title: 'Partneriniz bu süreçte yer alıyor mu?',
    options: [
      { label: 'Evet, birlikte hareket ediyoruz', value: 'yes' },
      { label: 'Partnerimin bir şey yapması gerektiğini bilmiyordum', value: 'unaware' },
      { label: 'Partnerim bu sürece dahil olmayacak', value: 'no' },
      { label: 'Şu anda partnerim yok', value: 'single' },
      { label: 'Hayır', value: 'none' },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function AssessmentScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const { data: existing, isLoading: loadingExisting } = useAssessment();
  const saveAssessment = useSaveAssessment();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [conditions, setConditions] = useState<string[]>([]);
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(60);
  const [age, setAge] = useState(28);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setResult(existing);
    setReviewing(true);
    if (existing.heightCm) setHeightCm(existing.heightCm);
    if (existing.weightKg) setWeightKg(existing.weightKg);
    if (existing.age) setAge(existing.age);
    if (existing.healthConditions?.length) setConditions(existing.healthConditions);
    setAnswers((prev) => ({
      ...prev,
      ...(existing.goal ? { goal: existing.goal } : {}),
      ...(existing.tryingDuration ? { tryingDuration: existing.tryingDuration } : {}),
      ...(existing.cycleRegularity ? { cycleRegularity: existing.cycleRegularity } : {}),
      ...(existing.contraceptionPast ? { contraceptionPast: existing.contraceptionPast } : {}),
    }));
  }, [existing]);

  useEffect(() => {
    const birthYear = (user as any)?.birthYear;
    if (birthYear && !existing?.age) setAge(CURRENT_YEAR - birthYear);
  }, [user, existing]);

  const q = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const toggleCondition = (value: string) => {
    setConditions((prev) => {
      if (value === 'none' || value === 'unsure') return prev.includes(value) ? [] : [value];
      const withoutExclusive = prev.filter((c) => c !== 'none' && c !== 'unsure');
      return withoutExclusive.includes(value)
        ? withoutExclusive.filter((c) => c !== value)
        : [...withoutExclusive, value];
    });
  };

  const submit = () => {
    saveAssessment.mutate(
      {
        goal: answers.goal ?? null,
        tryingDuration: answers.tryingDuration ?? null,
        cycleRegularity: answers.cycleRegularity ?? null,
        contraceptionPast: answers.contraceptionPast ?? null,
        healthConditions: conditions.filter((c) => c !== 'none' && c !== 'unsure'),
        heightCm,
        weightKg,
        age,
        answers,
      },
      {
        onSuccess: (data) => {
          setResult(data);
          setReviewing(true);
        },
        onError: (e) => Alert.alert('Hata', getErrorMessage(e, 'Değerlendirme kaydedilemedi.')),
      },
    );
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    else router.back();
  };

  const canAdvance =
    q.type === 'height_weight' ||
    q.type === 'age' ||
    (q.multiple ? conditions.length > 0 : !!answers[q.id]);

  if (loadingExisting) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator color={Colors.floPink} />
      </View>
    );
  }

  // ---- Result view ----
  if (reviewing && result) {
    const score = result.score ?? 0;
    const scoreColor = score >= 85 ? Colors.success : score >= 65 ? Colors.floTeal : score >= 50 ? '#F59E0B' : Colors.danger;
    const scoreLabel = score >= 85 ? 'Optimum' : score >= 65 ? 'İyi' : score >= 50 ? 'Geliştirilebilir' : 'Değerlendirme önerilir';

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Doğurganlık Değerlendirmeniz</Text>
        </View>

        <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.scoreCard, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: scoreColor + '40' }]}>
            <View style={styles.scoreRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Kişisel Doğurganlık Skorunuz</Text>
                <Text style={[styles.scoreValue, { color: scoreColor }]}>%{score} · {scoreLabel}</Text>
              </View>
              <Ionicons name="shield-checkmark" size={32} color={scoreColor} />
            </View>
            <View style={[styles.scoreBarTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.scoreBarFill, { width: `${score}%`, backgroundColor: scoreColor }]} />
            </View>
            <Text style={[styles.scoreNote, { color: colors.textMuted }]}>
              Bu skor verdiğiniz yanıtlardan hesaplandı: yaş, vücut kitle indeksi, döngü düzeni, deneme süresi ve bildirdiğiniz sağlık durumları.
            </Text>
            {result.bmi !== null && (
              <View style={[styles.bmiPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="body-outline" size={15} color={colors.textMuted} />
                <Text style={[styles.bmiText, { color: colors.textSecondary }]}>
                  Vücut kitle indeksi: {result.bmi}
                </Text>
              </View>
            )}
          </View>

          {result.insights.length > 0 && (
            <>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Verilerinizin Söyledikleri</Text>
              {result.insights.map((text, idx) => (
                <View key={idx} style={[styles.insightRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="analytics-outline" size={17} color={Colors.floTeal} />
                  <Text style={[styles.insightText, { color: colors.textSecondary }]}>{text}</Text>
                </View>
              ))}
            </>
          )}

          {result.recommendations.length > 0 && (
            <>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Size Özel Öneriler</Text>
              {result.recommendations.map((text, idx) => (
                <View key={idx} style={[styles.insightRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="checkmark-circle-outline" size={17} color={Colors.floPink} />
                  <Text style={[styles.insightText, { color: colors.textSecondary }]}>{text}</Text>
                </View>
              ))}
            </>
          )}

          <Pressable
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={() => {
              setReviewing(false);
              setCurrentStep(0);
            }}
          >
            <Ionicons name="refresh" size={17} color={Colors.floPink} />
            <Text style={[styles.secondaryBtnText, { color: Colors.floPink }]}>Yanıtlarımı Güncelle</Text>
          </Pressable>

          <Pressable style={[styles.primaryBtn, { backgroundColor: Colors.floPink }]} onPress={() => router.push('/period/fertility-guide')}>
            <Text style={styles.primaryBtnText}>Gebe Kalma Rehberini Aç</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ---- Questionnaire view ----
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: Colors.floPink }]} />
        </View>
        <Pressable onPress={handleNext} style={styles.skipBtn} hitSlop={8}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Atla</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.stepCounter, { color: colors.textMuted }]}>
          Soru {currentStep + 1} / {QUESTIONS.length}
        </Text>
        <Text style={[styles.questionTitle, { color: colors.text }]}>{q.title}</Text>
        {q.subtitle && <Text style={[styles.questionSubtitle, { color: colors.textMuted }]}>{q.subtitle}</Text>}

        {q.options && (
          <View style={styles.optionsList}>
            {q.options.map((opt) => {
              const isSelected = q.multiple ? conditions.includes(opt.value) : answers[q.id] === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? Colors.floPinkLight : isDark ? colors.card : '#F9F7F8',
                      borderColor: isSelected ? Colors.floPink : colors.border,
                    },
                  ]}
                  onPress={() =>
                    q.multiple
                      ? toggleCondition(opt.value)
                      : setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? Colors.floPink : colors.text, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name={q.multiple ? 'checkbox' : 'checkmark-circle'} size={20} color={Colors.floPink} />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {q.type === 'age' && (
          <View style={styles.pickerBox}>
            <View style={[styles.stepperCard, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
              <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Yaşınız</Text>
              <Text style={[styles.stepperBigValue, { color: colors.text }]}>{age}</Text>
              <View style={styles.stepperBtns}>
                <Pressable
                  style={[styles.stepperBtn, { backgroundColor: isDark ? '#3D2032' : '#F3F4F6' }]}
                  onPress={() => setAge((prev) => Math.max(15, prev - 1))}
                >
                  <Ionicons name="remove" size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  style={[styles.stepperBtn, { backgroundColor: Colors.floPinkLight }]}
                  onPress={() => setAge((prev) => Math.min(60, prev + 1))}
                >
                  <Ionicons name="add" size={22} color={Colors.floPink} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {q.type === 'height_weight' && (
          <View style={styles.pickerBox}>
            <View style={[styles.stepperCard, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
              <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Boyunuz</Text>
              <Text style={[styles.stepperBigValue, { color: colors.text }]}>{heightCm} cm</Text>
              <View style={styles.stepperBtns}>
                <Pressable
                  style={[styles.stepperBtn, { backgroundColor: isDark ? '#3D2032' : '#F3F4F6' }]}
                  onPress={() => setHeightCm((prev) => Math.max(120, prev - 1))}
                >
                  <Ionicons name="remove" size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  style={[styles.stepperBtn, { backgroundColor: Colors.floPinkLight }]}
                  onPress={() => setHeightCm((prev) => Math.min(220, prev + 1))}
                >
                  <Ionicons name="add" size={22} color={Colors.floPink} />
                </Pressable>
              </View>
            </View>

            <View style={[styles.stepperCard, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
              <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Kilonuz</Text>
              <Text style={[styles.stepperBigValue, { color: colors.text }]}>{weightKg} kg</Text>
              <View style={styles.stepperBtns}>
                <Pressable
                  style={[styles.stepperBtn, { backgroundColor: isDark ? '#3D2032' : '#F3F4F6' }]}
                  onPress={() => setWeightKg((prev) => Math.max(35, prev - 1))}
                >
                  <Ionicons name="remove" size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  style={[styles.stepperBtn, { backgroundColor: Colors.floPinkLight }]}
                  onPress={() => setWeightKg((prev) => Math.min(200, prev + 1))}
                >
                  <Ionicons name="add" size={22} color={Colors.floPink} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: canAdvance ? Colors.floPink : colors.border }]}
          onPress={handleNext}
          disabled={!canAdvance || saveAssessment.isPending}
        >
          {saveAssessment.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {currentStep === QUESTIONS.length - 1 ? 'Analizi Bitir' : 'İleri'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  headerTitle: { fontSize: 17, fontWeight: '800', flex: 1 },
  backBtn: { padding: 4 },
  progressContainer: { flex: 1, height: 4, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },
  skipBtn: { padding: 4 },
  skipText: { fontSize: 13, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
  stepCounter: { fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  questionTitle: { fontSize: 23, fontWeight: '800', lineHeight: 31, marginBottom: 8 },
  questionSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 22 },
  optionsList: { gap: 12 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 16, borderWidth: 1.5,
  },
  optionText: { fontSize: 15, flex: 1, paddingRight: 10, lineHeight: 20 },
  pickerBox: { gap: 16, marginTop: 10 },
  stepperCard: { padding: 20, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  stepperLabel: { fontSize: 13, fontWeight: '600' },
  stepperBigValue: { fontSize: 32, fontWeight: '800', marginVertical: 8 },
  stepperBtns: { flexDirection: 'row', gap: 16 },
  stepperBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  primaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 50, borderRadius: 16, borderWidth: 1.5, marginTop: 10,
  },
  secondaryBtnText: { fontSize: 14.5, fontWeight: '700' },
  resultScroll: { paddingHorizontal: 24, paddingBottom: 40, gap: 10 },
  scoreCard: { padding: 20, borderRadius: 20, borderWidth: 1.5, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  scoreLabel: { fontSize: 12, fontWeight: '600' },
  scoreValue: { fontSize: 22, fontWeight: '800', marginTop: 3 },
  scoreBarTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scoreNote: { fontSize: 12.5, lineHeight: 18 },
  bmiPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
    marginTop: 12, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1,
  },
  bmiText: { fontSize: 12.5, fontWeight: '600' },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginTop: 14, marginBottom: 4 },
  insightRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 14, borderRadius: 16, borderWidth: 1 },
  insightText: { flex: 1, fontSize: 13, lineHeight: 19.5 },
});

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCoupleQuestions, useSaveCoupleAnswer, type CoupleQuestion } from '@/src/api/bloomClient';

const STORAGE_KEY = 'couple_daily_questions';

/** Answers are stored as { [questionId]: answer }. Older builds stored an array of question objects. */
type AnswerMap = Record<string, string>;

function parseStoredAnswers(raw: string): AnswerMap {
  const parsed: unknown = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    const migrated: AnswerMap = {};
    for (const entry of parsed) {
      const item = entry as { id?: unknown; myAnswer?: unknown };
      if (typeof item?.id === 'string' && typeof item?.myAnswer === 'string' && item.myAnswer.trim()) {
        migrated[item.id] = item.myAnswer;
      }
    }
    return migrated;
  }
  if (parsed && typeof parsed === 'object') {
    const map: AnswerMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'string') map[key] = value;
    }
    return map;
  }
  return {};
}

export default function DailyQuestionsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const { data, isLoading, refetch } = useCoupleQuestions();
  const saveAnswer = useSaveCoupleAnswer();
  const questions: CoupleQuestion[] = data?.items ?? [];
  const todayQuestion = data?.today ?? null;
  const total = data?.total ?? questions.length;
  const isPaired = !!data?.isPaired;
  const partnerName = data?.partnerName || 'Partnerin';

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedQId, setSelectedQId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        setAnswers(parseStoredAnswers(raw));
      } catch {}
    });
  }, []);

  useEffect(() => {
    if (!data?.items?.length) return;
    const localOnly = Object.entries(answers).filter(([id, text]) => {
      const q = data.items.find((item) => item.id === id);
      return text && q && !q.myAnswer;
    });
    if (!localOnly.length) return;
    Promise.all(
      localOnly.map(([questionId, answer]) => saveAnswer.mutateAsync({ questionId, answer }).catch(() => null)),
    ).then(() => {
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      refetch();
    });
  }, [data?.items, answers]);

  useEffect(() => {
    if (todayQuestion) setSelectedQId((current) => current ?? todayQuestion.id);
  }, [todayQuestion]);

  const activeQuestion =
    questions.find((q) => q.id === selectedQId) ?? todayQuestion ?? questions[0] ?? null;

  const grouped = useMemo(() => {
    const map = new Map<string, CoupleQuestion[]>();
    for (const q of questions) {
      const list = map.get(q.category);
      if (list) list.push(q);
      else map.set(q.category, [q]);
    }
    return Array.from(map, ([category, items]) => ({ category, items }));
  }, [questions]);

  const handleSaveAnswer = () => {
    if (!activeQuestion || !currentAnswer.trim()) return;
    const text = currentAnswer.trim();
    const updated: AnswerMap = { ...answers, [activeQuestion.id]: text };
    setAnswers(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
    saveAnswer.mutate(
      { questionId: activeQuestion.id, answer: text },
      {
        onSuccess: () => {
          setCurrentAnswer('');
          setIsEditing(false);
          const revealed = isPaired;
          Alert.alert(
            'Cevabın kaydedildi',
            revealed
              ? 'Partnerin de cevapladıysa yanıtı burada görünür. Henüz yazmadıysa kilidi o cevaplayınca açılır.'
              : 'Partner kodu ile eşleşince cevaplarınız birbirinize açılır.',
          );
        },
        onError: () => Alert.alert('Kaydedilemedi', 'İnternet bağlantınızı kontrol edin.'),
      },
    );
  };

  const selectQuestion = (id: string) => {
    setSelectedQId(id);
    setCurrentAnswer('');
    setIsEditing(false);
  };

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={[styles.title, { color: colors.text }]}>Günün Çift Sorusu 💬</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {isPaired ? `${partnerName} ile ortak soru defteri` : 'Partnerle eşleşince cevaplar paylaşılır'}
          </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.relationship} />
          <Text style={[styles.centerText, { color: colors.textMuted }]}>Sorular yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (!activeQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 52 }}>💬</Text>
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>
            Şu anda gösterilecek soru bulunamadı. Lütfen daha sonra tekrar deneyin.
          </Text>
        </View>
      </View>
    );
  }

  const savedAnswer = activeQuestion.myAnswer || answers[activeQuestion.id];
  const partnerAnswer = activeQuestion.partnerAnswer;
  const partnerWaiting = isPaired && !!savedAnswer && !activeQuestion.revealed;
  const showInput = !savedAnswer || isEditing;
  const isTodayQuestion = todayQuestion?.id === activeQuestion.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Active question hero */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: isDark ? '#2D1828' : '#FFF0F6', borderColor: Colors.relationship + '30' },
          ]}
        >
          <View style={styles.heroTopRow}>
            <View style={[styles.catBadge, { backgroundColor: Colors.floPinkLight }]}>
              <Text style={[styles.catText, { color: Colors.floPink }]}>
                {activeQuestion.category.toLocaleUpperCase('tr-TR')}
              </Text>
            </View>
            {isTodayQuestion && (
              <View style={[styles.todayBadge, { backgroundColor: Colors.relationship }]}>
                <Text style={styles.todayBadgeText}>GÜNÜN SORUSU</Text>
              </View>
            )}
          </View>

          <Text style={[styles.qText, { color: colors.text }]}>"{activeQuestion.question}"</Text>

          {showInput ? (
            <View style={styles.answerInputSection}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#3D2032' : '#FFFFFF',
                    color: colors.text,
                    borderColor: Colors.relationship + '30',
                  },
                ]}
                placeholder="İçinden geçen samimi cevabı yaz..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
              />
              <Pressable
                style={[styles.sendBtn, { backgroundColor: Colors.relationship }]}
                onPress={handleSaveAnswer}
              >
                <Ionicons name="heart" size={18} color="#FFFFFF" />
                <Text style={styles.sendBtnText}>Cevabı Gönder & Kilidi Aç</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.myAnswerBox, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
              <View style={styles.ansHeader}>
                <Ionicons name="person" size={14} color={Colors.floPink} />
                <Text style={[styles.ansName, { color: Colors.floPink }]}>Senin Cevabın:</Text>
              </View>
              <Text style={[styles.ansBody, { color: colors.text }]}>{savedAnswer}</Text>
              <Pressable
                onPress={() => {
                  setCurrentAnswer(savedAnswer ?? '');
                  setIsEditing(true);
                }}
                style={styles.editRow}
              >
                <Ionicons name="create-outline" size={14} color={Colors.relationship} />
                <Text style={[styles.editText, { color: Colors.relationship }]}>Cevabı düzenle</Text>
              </Pressable>
            </View>
          )}

          {partnerAnswer ? (
            <View style={[styles.myAnswerBox, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, marginTop: 10 }]}>
              <View style={styles.ansHeader}>
                <Ionicons name="heart" size={14} color={Colors.floTeal} />
                <Text style={[styles.ansName, { color: Colors.floTeal }]}>{partnerName} cevabı:</Text>
              </View>
              <Text style={[styles.ansBody, { color: colors.text }]}>{partnerAnswer}</Text>
            </View>
          ) : partnerWaiting ? (
            <View style={[styles.myAnswerBox, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6', marginTop: 10 }]}>
              <Text style={[styles.ansBody, { color: colors.textMuted }]}>
                {activeQuestion.partnerHasAnswered
                  ? 'Partnerin cevapladı. Kilidi açmak için sen de gönder.'
                  : `${partnerName} henüz cevaplamadı. İkiniz de yazınca yanıtlar açılır.`}
              </Text>
            </View>
          ) : !isPaired && savedAnswer ? (
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 10, lineHeight: 18 }}>
              Partner kodunu eşleştirince cevaplarınız birbirinize görünür.
            </Text>
          ) : null}
        </View>

        {/* All questions, grouped by category */}
        <View style={styles.listHeaderRow}>
          <Text style={[styles.histTitle, { color: colors.text }]}>Tüm Sorular</Text>
          <Text style={[styles.totalText, { color: colors.textMuted }]}>{total} soru</Text>
        </View>

        <View style={styles.groupList}>
          {grouped.map((group) => {
            const isOpen = expanded[group.category] ?? group.category === activeQuestion.category;
            const answeredCount = group.items.filter((q) => !!(q.myAnswer || answers[q.id])).length;
            return (
              <View
                key={group.category}
                style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Pressable
                  style={styles.groupHeader}
                  onPress={() => setExpanded((prev) => ({ ...prev, [group.category]: !isOpen }))}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.groupTitle, { color: colors.text }]}>{group.category}</Text>
                    <Text style={[styles.groupMeta, { color: colors.textMuted }]}>
                      {group.items.length} soru · {answeredCount} cevaplandı
                    </Text>
                  </View>
                  <View style={[styles.countPill, { backgroundColor: Colors.floPinkLight }]}>
                    <Text style={[styles.countPillText, { color: Colors.floPink }]}>{group.items.length}</Text>
                  </View>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                    style={{ marginLeft: 8 }}
                  />
                </Pressable>

                {isOpen && (
                  <View style={styles.qList}>
                    {group.items.map((q) => {
                      const isSel = q.id === activeQuestion.id;
                      const answered = !!(q.myAnswer || answers[q.id]);
                      const both = !!q.revealed;
                      return (
                        <Pressable
                          key={q.id}
                          style={[
                            styles.qCard,
                            {
                              backgroundColor: isDark ? '#2D2030' : '#F9F7F8',
                              borderColor: isSel ? Colors.relationship : 'transparent',
                            },
                          ]}
                          onPress={() => selectQuestion(q.id)}
                        >
                          <Text style={[styles.qCardTitle, { color: colors.text }]}>{q.question}</Text>
                          <Text
                            style={[styles.qCardStatus, { color: answered ? Colors.success : Colors.warning }]}
                          >
                            {both ? '✓ İkiniz de cevapladınız' : answered ? '✓ Sen cevapladın' : 'Cevap bekleniyor'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
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
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  centerText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginVertical: 12 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 10, fontWeight: '900' },
  todayBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  todayBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  qText: { fontSize: 18, fontWeight: '800', lineHeight: 26, marginBottom: 16 },
  answerInputSection: { gap: 10 },
  input: { minHeight: 70, borderRadius: 16, borderWidth: 1, padding: 12, fontSize: 14, textAlignVertical: 'top' },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  sendBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  myAnswerBox: { padding: 14, borderRadius: 16 },
  ansHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  ansName: { fontSize: 12, fontWeight: '800' },
  ansBody: { fontSize: 13.5, lineHeight: 19 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  editText: { fontSize: 12, fontWeight: '700' },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  histTitle: { fontSize: 16, fontWeight: '800' },
  totalText: { fontSize: 12, fontWeight: '600' },
  groupList: { gap: 10 },
  groupCard: { borderRadius: 18, borderWidth: 1, padding: 14 },
  groupHeader: { flexDirection: 'row', alignItems: 'center' },
  groupTitle: { fontSize: 14.5, fontWeight: '800' },
  groupMeta: { fontSize: 11.5, marginTop: 2 },
  countPill: { minWidth: 26, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9, alignItems: 'center' },
  countPillText: { fontSize: 12, fontWeight: '900' },
  qList: { gap: 8, marginTop: 12 },
  qCard: { padding: 12, borderRadius: 14, borderWidth: 1.5 },
  qCardTitle: { fontSize: 13.5, fontWeight: '700', lineHeight: 19 },
  qCardStatus: { fontSize: 11.5, fontWeight: '700', marginTop: 6 },
});

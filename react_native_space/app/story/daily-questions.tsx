import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCoupleQuestions, useSaveCoupleAnswer } from '@/src/api/bloomClient';
import { syncDailyQuestionAlert } from '@/src/notifications/bloomAlerts';

const STORAGE_KEY = 'couple_daily_questions';

export default function DailyQuestionsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const { data, isLoading, refetch } = useCoupleQuestions();
  const saveAnswer = useSaveCoupleAnswer();
  const today = data?.today ?? data?.items?.[0] ?? null;
  const isPaired = !!data?.isPaired;
  const partnerName = data?.partnerName || 'Partnerin';

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!today) return;
    syncDailyQuestionAlert(!!today.myAnswer).catch(() => {});
  }, [today?.id, today?.myAnswer]);

  const handleSaveAnswer = () => {
    if (!today || !currentAnswer.trim()) return;
    const text = currentAnswer.trim();
    saveAnswer.mutate(
      { questionId: today.id, answer: text },
      {
        onSuccess: () => {
          setCurrentAnswer('');
          setIsEditing(false);
          AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
          syncDailyQuestionAlert(true).catch(() => {});
          refetch();
          Alert.alert(
            'Cevabın kaydedildi',
            isPaired
              ? 'Partnerin de cevapladıysa yanıtı burada görünür.'
              : 'Partner kodu ile eşleşince cevaplarınız birbirinize açılır.',
          );
        },
        onError: () => Alert.alert('Kaydedilemedi', 'İnternet bağlantınızı kontrol edin.'),
      },
    );
  };

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={[styles.title, { color: colors.text }]}>Günün çift sorusu</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {isPaired ? `${partnerName} ile bugünün tek sorusu` : 'Her gün bir soru'}
        </Text>
      </View>
    </View>
  );

  if (isLoading && !today) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.relationship} />
        </View>
      </View>
    );
  }

  if (!today) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>Bugünün sorusu yüklenemedi.</Text>
        </View>
      </View>
    );
  }

  const savedAnswer = today.myAnswer;
  const showInput = !savedAnswer || isEditing;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.heroCard,
            { backgroundColor: isDark ? '#2D1828' : '#FFF0F6', borderColor: Colors.relationship + '30' },
          ]}
        >
          <View style={[styles.catBadge, { backgroundColor: Colors.floPinkLight }]}>
            <Text style={[styles.catText, { color: Colors.floPink }]}>{today.category.toLocaleUpperCase('tr-TR')}</Text>
          </View>
          <Text style={[styles.qText, { color: colors.text }]}>"{today.question}"</Text>

          {showInput ? (
            <View style={styles.answerInputSection}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: isDark ? '#3D2032' : '#FFFFFF', color: colors.text, borderColor: Colors.relationship + '30' },
                ]}
                placeholder="Bugünkü cevabını yaz..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
              />
              <Pressable style={[styles.sendBtn, { backgroundColor: Colors.relationship }]} onPress={handleSaveAnswer}>
                <Ionicons name="heart" size={18} color="#FFFFFF" />
                <Text style={styles.sendBtnText}>Cevabı gönder</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.myAnswerBox, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
              <Text style={[styles.ansName, { color: Colors.floPink }]}>Senin cevabın</Text>
              <Text style={[styles.ansBody, { color: colors.text }]}>{savedAnswer}</Text>
              <Pressable
                onPress={() => {
                  setCurrentAnswer(savedAnswer ?? '');
                  setIsEditing(true);
                }}
                style={styles.editRow}
              >
                <Text style={[styles.editText, { color: Colors.relationship }]}>Düzenle</Text>
              </Pressable>
            </View>
          )}

          {today.partnerAnswer ? (
            <View style={[styles.myAnswerBox, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, marginTop: 10 }]}>
              <Text style={[styles.ansName, { color: Colors.floTeal }]}>{partnerName} cevabı</Text>
              <Text style={[styles.ansBody, { color: colors.text }]}>{today.partnerAnswer}</Text>
            </View>
          ) : isPaired && savedAnswer ? (
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 10 }}>
              {today.partnerHasAnswered
                ? 'Partnerin cevapladı. Kilidi açmak için sen de gönder.'
                : `${partnerName} henüz cevaplamadı.`}
            </Text>
          ) : null}
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
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  centerText: { fontSize: 13, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginVertical: 12 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  catText: { fontSize: 10, fontWeight: '900' },
  qText: { fontSize: 18, fontWeight: '800', lineHeight: 26, marginBottom: 16 },
  answerInputSection: { gap: 10 },
  input: { minHeight: 70, borderRadius: 16, borderWidth: 1, padding: 12, fontSize: 14, textAlignVertical: 'top' },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  sendBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  myAnswerBox: { padding: 14, borderRadius: 16 },
  ansName: { fontSize: 12, fontWeight: '800', marginBottom: 4 },
  ansBody: { fontSize: 13.5, lineHeight: 19 },
  editRow: { marginTop: 10 },
  editText: { fontSize: 12, fontWeight: '700' },
});

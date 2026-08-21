import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { pregnancyControllerCreate } from '@/src/api/generated/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from '@/src/utils/dateOnly';
import { finishOnboarding } from '@/src/utils/onboarding';

export default function PregnancySetupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, refreshUser } = useAuth();

  const [lmpDate, setLmpDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
  const diffDays = Math.max(0, Math.floor((Date.now() - lmpDate.getTime()) / (24 * 60 * 60 * 1000)));
  const currentWeek = Math.min(42, Math.max(1, Math.floor(diffDays / 7) + 1));

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await pregnancyControllerCreate({
        lastMenstrualPeriod: localDateKey(lmpDate),
      });
      await AsyncStorage.setItem('active_home_module', 'pregnancy');
      if (!user?.hasCompletedSetup) {
        await finishOnboarding(refreshUser);
      }
      router.replace('/tabs/home');
    } catch (e: any) {
      Alert.alert('Hata', 'Gebelik bilgileri kaydedilemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepHint, { color: Colors.pregnancy }]}>SON ADIM</Text>
            <Text style={[styles.title, { color: colors.text }]}>Son adet tarihiniz</Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#2D2214' : '#FFF9F0', borderColor: Colors.pregnancy + '30' }]}>
          <View style={[styles.heroIconCircle, { backgroundColor: Colors.pregnancy + '20' }]}>
            <Text style={{ fontSize: 32 }}>👶</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {currentWeek}. Hafta Gebelik
          </Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            Tahmini Doğum: {dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Date Selector */}
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Son Adet Tarihiniz (SAT) *</Text>
          <Pressable
            style={[styles.dateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={22} color={Colors.pregnancy} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {lmpDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setLmpDate}
          selectedDate={lmpDate}
          maxDate={new Date()}
          accentColor={Colors.pregnancy}
        />

        {/* Continue Button */}
        <Pressable
          style={[styles.button, { backgroundColor: Colors.pregnancy }]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Başla</Text>
          )}
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  stepHint: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  heroCard: {
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
  },
  heroIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  heroTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  heroSub: { fontSize: 13 },
  fieldSection: { marginBottom: 18 },
  fieldLabel: { fontSize: 13.5, fontWeight: '700', marginBottom: 8 },
  fieldHint: { fontSize: 12, marginTop: 6, lineHeight: 16 },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  dateText: { fontSize: 15, fontWeight: '700' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textInput: { flex: 1, fontSize: 15, fontWeight: '600' },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
  },
  genderCardText: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  button: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: Colors.pregnancy, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

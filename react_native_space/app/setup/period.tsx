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
import { periodControllerSetup } from '@/src/api/generated/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from '@/src/utils/dateOnly';
import { finishOnboarding } from '@/src/utils/onboarding';

export default function PeriodSetupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, refreshUser } = useAuth();

  const [lastPeriod, setLastPeriod] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await periodControllerSetup({
        lastPeriodStart: localDateKey(lastPeriod),
        cycleLength,
        periodLength,
      });

      await AsyncStorage.setItem('active_home_module', 'period');

      if (user?.hasCompletedSetup) {
        router.replace('/tabs/home');
      } else {
        await finishOnboarding(refreshUser);
        router.replace('/tabs/home');
      }
    } catch (e) {
      Alert.alert('Hata', 'Regl bilgileri kaydedilemedi.');
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
            <Text style={[styles.stepHint, { color: Colors.floPink }]}>SON ADIM</Text>
            <Text style={[styles.title, { color: colors.text }]}>Son regl tarihiniz</Text>
            <Text style={[styles.fieldHint, { color: colors.textMuted, marginTop: 4 }]}>
              Tahminler bu tarihe göre çıkar. Emin değilseniz yaklaşık bir gün seçin, sonra değiştirebilirsiniz.
            </Text>
          </View>
        </View>

        {/* Date Selector */}
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Son Regl Başlangıç Tarihiniz *</Text>
          <Pressable
            style={[styles.dateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="water-outline" size={22} color={Colors.floPink} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {lastPeriod.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* Steppers for cycle length & period length */}
        <View style={styles.stepperRow}>
          <View style={[styles.stepperBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Döngü Süresi</Text>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{cycleLength} Gün</Text>
            <View style={styles.stepperBtns}>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#2D1828' : '#FFF0F6' }]}
                onPress={() => setCycleLength(Math.max(20, cycleLength - 1))}
              >
                <Ionicons name="remove" size={18} color={Colors.floPink} />
              </Pressable>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#2D1828' : '#FFF0F6' }]}
                onPress={() => setCycleLength(Math.min(45, cycleLength + 1))}
              >
                <Ionicons name="add" size={18} color={Colors.floPink} />
              </Pressable>
            </View>
          </View>

          <View style={[styles.stepperBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Kanama Süresi</Text>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{periodLength} Gün</Text>
            <View style={styles.stepperBtns}>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#2D1828' : '#FFF0F6' }]}
                onPress={() => setPeriodLength(Math.max(2, periodLength - 1))}
              >
                <Ionicons name="remove" size={18} color={Colors.floPink} />
              </Pressable>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#2D1828' : '#FFF0F6' }]}
                onPress={() => setPeriodLength(Math.min(10, periodLength + 1))}
              >
                <Ionicons name="add" size={18} color={Colors.floPink} />
              </Pressable>
            </View>
          </View>
        </View>

        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setLastPeriod}
          selectedDate={lastPeriod}
          maxDate={new Date()}
          accentColor={Colors.floPink}
        />

        {/* Continue Button */}
        <Pressable
          style={[styles.button, { backgroundColor: Colors.floPink }]}
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
  fieldSection: { marginBottom: 18 },
  fieldLabel: { fontSize: 13.5, fontWeight: '700', marginBottom: 8 },
  fieldHint: { fontSize: 12, lineHeight: 17 },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  dateText: { fontSize: 15, fontWeight: '700' },
  stepperRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  stepperBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  stepperLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  stepperValue: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  stepperBtns: { flexDirection: 'row', gap: 8 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  goalTitle: { fontSize: 13.5, fontWeight: '700' },
  goalSub: { fontSize: 11, marginTop: 2 },
  goalDesc: { fontSize: 12, marginTop: 8, lineHeight: 18 },
  goalCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: Colors.floPink, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

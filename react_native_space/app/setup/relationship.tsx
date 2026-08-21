import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { relationshipControllerCreate } from '@/src/api/generated/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from '@/src/utils/dateOnly';
import { finishOnboarding } from '@/src/utils/onboarding';

export default function RelationshipSetupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, refreshUser } = useAuth();

  const [partnerName, setPartnerName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [partnerCode, setPartnerCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const goHome = async () => {
    if (!user?.hasCompletedSetup) {
      await finishOnboarding(refreshUser);
    }
    router.replace('/tabs/home');
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      if (partnerName.trim()) {
        await relationshipControllerCreate({
          startDate: localDateKey(startDate),
          partnerName: partnerName.trim(),
        });
      }

      if (partnerCode.trim()) {
        try {
          await customFetch('/api/relationship/pair', {
            method: 'POST',
            body: JSON.stringify({ partnerCode: partnerCode.trim() }),
          });
        } catch (pairErr) {
          Alert.alert(
            'Eşleştirme sonra',
            getErrorMessage(pairErr, 'Kod şu an bağlanamadı. Partner sekmesinden tekrar deneyebilirsiniz.'),
          );
        }
      }

      await AsyncStorage.setItem('active_home_module', 'relationship');
      await goHome();
    } catch (e) {
      Alert.alert('Hata', 'İlişki bilgileri kaydedilemedi.');
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
            <Text style={[styles.stepHint, { color: Colors.relationship }]}>ADIM 2 / 2</Text>
            <Text style={[styles.title, { color: colors.text }]}>İlişki & Bizim Hikâyemiz 💕</Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#2D1828' : '#FFF0F6', borderColor: Colors.relationship + '30' }]}>
          <View style={[styles.heroIconCircle, { backgroundColor: Colors.relationship + '20' }]}>
            <Ionicons name="heart" size={28} color={Colors.relationship} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Sevgi Dolu Anlar Biriktirin 💑
          </Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            Sayaçlar, özel tarihler ve partnere sürpriz aşk notları
          </Text>
        </View>

        {/* Partner Name Input */}
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Partnerinizin adı (isteğe bağlı)</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={Colors.relationship} />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Örn: Can, Sevgilim, Eşim..."
              placeholderTextColor={colors.textMuted}
              value={partnerName}
              onChangeText={setPartnerName}
            />
          </View>
        </View>

        {/* Relationship Start Date Selector */}
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Birliktelik Başlangıç / Evlilik Tarihiniz *</Text>
          <Pressable
            style={[styles.dateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={22} color={Colors.relationship} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
          </Pressable>
          <Text style={[styles.fieldHint, { color: colors.textMuted }]}>
            Bu tarihe göre "Kaç gündür birlikteyiz" ve "Yıldönümüne kaç gün kaldı" sayaçlarınız hesaplanır.
          </Text>
        </View>

        {/* Partner Linking Code (Optional) */}
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Partner Eşleştirme Kodu (İsteğe Bağlı) 🔗</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="key-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Partnerinizin 6 haneli kodu"
              placeholderTextColor={colors.textMuted}
              value={partnerCode}
              onChangeText={setPartnerCode}
              autoCapitalize="characters"
            />
          </View>
          <Text style={[styles.fieldHint, { color: colors.textMuted }]}>
            Partneriniz henüz üye olmadıysa bu alanı boş bırakabilirsiniz, daha sonra Profil kısmından eşleştirebilirsiniz.
          </Text>
        </View>

        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setStartDate}
          selectedDate={startDate}
          maxDate={new Date()}
          accentColor={Colors.relationship}
        />

        {/* Continue Button */}
        <Pressable
          style={[styles.button, { backgroundColor: Colors.relationship }]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Başla</Text>
          )}
        </Pressable>
        <Pressable onPress={() => goHome()} style={{ paddingVertical: 14, alignItems: 'center' }} disabled={isLoading}>
          <Text style={{ color: colors.textMuted, fontWeight: '700' }}>Şimdi değil, sonra bağlarım</Text>
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
  heroTitle: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  heroSub: { fontSize: 12.5, textAlign: 'center' },
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
  button: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: Colors.relationship, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

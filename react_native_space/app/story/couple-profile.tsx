import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useRelationshipControllerGet, useRelationshipControllerUpdate, useRelationshipControllerCreate } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { useAuth } from '@/src/contexts/AuthContext';
import { copyToClipboard } from '@/src/utils/copyText';
import { localDateKey } from '@/src/utils/dateOnly';
import { confirmPartnerPair } from '@/src/utils/pairFlow';

export default function CoupleProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  const { data: rel, isLoading } = useRelationshipControllerGet();
  const updateMutation = useRelationshipControllerUpdate();
  const createMutation = useRelationshipControllerCreate();

  const [partnerName, setPartnerName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Pairing state
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [isPairing, setIsPairing] = useState(false);

  const { data: partnerInfo, refetch: refetchPartnerInfo } = useQuery<{
    partnerCode: string;
    isPaired: boolean;
    pairedUserName?: string;
    pairedUserEmail?: string;
  }>({
    queryKey: ['partner-info'],
    queryFn: () => customFetch('/api/relationship/partner-info'),
  });

  useEffect(() => {
    if (rel) {
      setPartnerName(rel.partnerName ?? '');
      if (rel.startDate) setStartDate(new Date(rel.startDate));
    }
  }, [rel]);

  const handlePair = async () => {
    if (!partnerCodeInput.trim()) {
      Alert.alert('Uyarı', 'Lütfen partnerinizin kodunu girin.');
      return;
    }

    try {
      const confirmed = await confirmPartnerPair({
        partnerCode: partnerCodeInput.trim(),
        myGender: user?.gender,
        onNeedGender: () => router.push('/profile/edit'),
      });
      if (!confirmed) return;
      setIsPairing(true);
      const res = (await customFetch('/api/relationship/pair', {
        method: 'POST',
            body: JSON.stringify({ partnerCode: partnerCodeInput.trim() }),
      })) as any;
      await refreshUser();
      await refetchPartnerInfo();
      await queryClient.invalidateQueries({ queryKey: ['/api/relationship'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['relationship'] });
      Alert.alert('Eşleştiniz', `${res.pairedUserName || res.partnerName || 'Partneriniz'} ile bağlandı. Çift soruları ve özel günler ortak.`);
      setPartnerCodeInput('');
    } catch (e: unknown) {
      Alert.alert('Eşleştirme hatası', getErrorMessage(e, 'Geçersiz partner kodu veya bir hata oluştu.'));
    } finally {
      setIsPairing(false);
    }
  };

  const handleSave = () => {
    if (!partnerName.trim()) {
      Alert.alert('Uyarı', 'Lütfen partnerinizin adını girin.');
      return;
    }

    const payload = {
      partnerName: partnerName.trim(),
      startDate: localDateKey(startDate),
    };

    if (rel?.id) {
      updateMutation.mutate(
        { id: rel.id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/relationship'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
            Alert.alert('Başarılı ✨', 'İlişki bilgileri güncellendi.');
            router.back();
          },
          onError: () => Alert.alert('Hata', 'Güncelleme başarısız.'),
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/relationship'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
            Alert.alert('Başarılı ✨', 'İlişki bilgileri kaydedildi.');
            router.back();
          },
          onError: () => Alert.alert('Hata', 'Kayıt başarısız.'),
        }
      );
    }
  };

  if (isLoading && !rel && !partnerInfo) return <LoadingScreen />;

  const isPending = updateMutation.isPending || createMutation.isPending;
  const myPartnerCode = partnerInfo?.partnerCode || (user as any)?.partnerCode || '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>İlişki & Partner Eşleştirme 💕</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Partner Pairing Section */}
        <View style={[styles.card, { backgroundColor: isDark ? '#3D202E' : '#FFF0F6', borderColor: Colors.relationship + '30' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link" size={20} color={Colors.relationship} />
            <Text style={[styles.sectionTitle, { color: Colors.relationship }]}>Partner Eşleştirme (Canlı Senkron)</Text>
          </View>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            Partnerinizle eşleştiğinizde, özel günleriniz ve ilişki sayacınız ikinize de anında senkronize olur.
          </Text>

          <Pressable
            style={[styles.codeBox, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={async () => {
              if (!myPartnerCode) return;
              const ok = await copyToClipboard(myPartnerCode);
              Alert.alert(ok ? 'Kopyalandı' : 'Partner kodunuz', myPartnerCode);
            }}
          >
            <View>
              <Text style={[styles.codeLabel, { color: colors.textMuted }]}>Sizin Partner Kodunuz:</Text>
              <Text style={[styles.codeVal, { color: Colors.relationship }]}>{myPartnerCode || '—'}</Text>
            </View>
            <Ionicons name="copy-outline" size={18} color={Colors.relationship} />
          </Pressable>

          {partnerInfo?.isPaired ? (
            <View style={[styles.pairedBadge, { backgroundColor: Colors.success + '15', borderColor: Colors.success + '30' }]}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.success, fontWeight: '700', fontSize: 13 }}>
                  Eşleşme aktif
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {partnerInfo.pairedUserName}{partnerInfo.pairedUserEmail ? ` (${partnerInfo.pairedUserEmail})` : ''}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Alert.alert('Bağlantıyı kes', 'Eşleşme her iki hesapta da kalkar.', [
                    { text: 'Vazgeç', style: 'cancel' },
                    {
                      text: 'Kes',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await customFetch('/api/relationship/unpair', { method: 'POST' });
                          await refreshUser();
                          await refetchPartnerInfo();
                        } catch (e) {
                          Alert.alert('Hata', getErrorMessage(e, 'Bağlantı kesilemedi.'));
                        }
                      },
                    },
                  ]);
                }}
              >
                <Text style={{ color: Colors.danger, fontWeight: '700', fontSize: 12 }}>Kes</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Partnerinizin Kodunu Girin</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="qr-code-outline" size={18} color={Colors.relationship} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={partnerCodeInput}
                  onChangeText={setPartnerCodeInput}
                  placeholder="Örn: BL-9X2K4A"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="characters"
                />
              </View>

              <Pressable
                style={[styles.pairBtn, { backgroundColor: Colors.relationship }]}
                onPress={handlePair}
                disabled={isPairing}
              >
                {isPairing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="heart" size={16} color="#fff" />
                    <Text style={styles.pairBtnText}>Partner ile Eşleş</Text>
                  </>
                )}
              </Pressable>
            </View>
          )}
        </View>

        {/* Relationship Details Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.heartCircle, { backgroundColor: Colors.relationship + '15' }]}>
              <Text style={{ fontSize: 32 }}>💑</Text>
            </View>
            <Text style={[styles.cardTag, { color: colors.textSecondary }]}>Birlikteliğinizi Özelleştirin</Text>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Partnerinizin Adı</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={18} color={Colors.relationship} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={partnerName}
              onChangeText={setPartnerName}
              placeholder="Partner adı"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Birlikte Olma Tarihi</Text>
          <Pressable
            style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color={Colors.relationship} style={styles.inputIcon} />
            <Text style={[styles.inputText, { color: colors.text }]}>
              {startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </Pressable>

          <DatePickerModal
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onSelect={(d) => setStartDate(d)}
            selectedDate={startDate}
            maxDate={new Date()}
            accentColor={Colors.relationship}
          />

          <Pressable
            style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
            onPress={handleSave}
            disabled={isPending}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>{isPending ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  card: {
    borderRadius: 24, padding: 20, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionDesc: { fontSize: 12.5, lineHeight: 18, marginBottom: 12 },

  codeBox: {
    padding: 14, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  codeLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  codeVal: { fontSize: 20, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 },

  pairedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 16, borderWidth: 1, marginTop: 12,
  },

  pairBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: 16, marginTop: 10,
  },
  pairBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  avatarRow: { alignItems: 'center', marginBottom: 16 },
  heartCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cardTag: { fontSize: 13, fontWeight: '600' },

  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10, marginLeft: 2 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, height: 50, marginBottom: 4,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  inputText: { fontSize: 15, fontWeight: '500' },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 16, marginTop: 20,
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

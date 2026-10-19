import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
  Share,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  useRelationshipControllerGet,
  useSpecialDatesControllerGetAll,
} from '@/src/api/generated/api';
import { apiClient } from '@/src/api/client';
import { getErrorMessage } from '@/src/api/customFetch';
import { usePartnerInfo, useUnpairPartner } from '@/src/api/bloomClient';
import { copyToClipboard } from '@/src/utils/copyText';
import { isMaleUser } from '@/src/utils/gender';
import { confirmPartnerPair } from '@/src/utils/pairFlow';
import { useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { CoupleToolsGrid } from '@/src/components/CoupleToolsGrid';

export default function PartnerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const male = isMaleUser(user);
  const queryClient = useQueryClient();

  const { data: rel, refetch: refetchRel } = useRelationshipControllerGet({
    query: { retry: false },
  });
  const { data: datesData, refetch: refetchDates } = useSpecialDatesControllerGetAll({ page: 1, limit: 10 });
  const { data: partnerInfo, refetch: refetchPartnerInfo } = usePartnerInfo();
  const unpair = useUnpairPartner();
  const [isPairing, setIsPairing] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentNudge, setSentNudge] = useState<string | null>(null);

  /** Onayı hemen göster, isteği arkada gönder: kullanıcı ağı beklemesin. */
  const sendQuickNudge = (type: string, label: string) => {
    setSentNudge(type);
    setTimeout(() => setSentNudge((cur) => (cur === type ? null : cur)), 1800);
    apiClient.post('/api/relationship/live/nudges', { type }).catch((err) => {
      setSentNudge(null);
      Alert.alert('Gönderilemedi', getErrorMessage(err, `${label} isteği iletilemedi. Bağlantıyı kontrol edin.`));
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      refetchPartnerInfo();
    }, [refetchPartnerInfo]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchRel(), refetchDates(), refetchPartnerInfo()]);
    setRefreshing(false);
  };

  const userObj = user as any;
  const myCode = partnerInfo?.partnerCode || userObj?.partnerCode || '';
  const isPaired = Boolean(partnerInfo?.isPaired || partnerInfo?.paired);
  const partnerDisplayName = partnerInfo?.pairedUserName || partnerInfo?.partnerName || 'Partneriniz';
  const dates = datesData?.items ?? [];

  const copyMyCode = async () => {
    if (!myCode) {
      Alert.alert('Kod yok', 'Partner kodunuz henüz oluşmadı. Sayfayı yenileyin.');
      return;
    }
    const copiedOk = await copyToClipboard(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (!copiedOk) Alert.alert('Partner Kodunuz', myCode);
  };

  const shareInvite = async () => {
    try {
      await Share.share({
        message: male
          ? `Pusena'da seninle eşleşmek istiyorum. Uygulamayı indirip Partner Kodumu gir: ${myCode}`
          : `Pusena ile döngü ve gebelik yolculuğumu seninle paylaşıyorum. Uygulamayı indirip Partner Kodumu gir: ${myCode}`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePair = async () => {
    if (!partnerCodeInput.trim()) {
      Alert.alert('Hata', 'Lütfen partnerinizin kodunu girin.');
      return;
    }
    const ok = await confirmPartnerPair({
      partnerCode: partnerCodeInput.trim(),
      myGender: user?.gender,
      onNeedGender: () => {
        setShowPairModal(false);
        router.push('/profile/edit');
      },
    });
    if (!ok) return;
    try {
      setIsPairing(true);
      await apiClient.post('/api/relationship/pair', { partnerCode: partnerCodeInput.trim() });
      await refreshUser();
      await Promise.all([
        refetchPartnerInfo(),
        refetchRel(),
        refetchDates(),
        queryClient.invalidateQueries({ queryKey: ['relationship'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/relationship'] }),
      ]);
      Alert.alert('Tebrikler', 'Partnerinizle eşleştiniz. Çift soruları, sohbet ve özel günler artık ortak.');
      setShowPairModal(false);
      setPartnerCodeInput('');
    } catch (err: unknown) {
      Alert.alert('Eşleştirme başarısız', getErrorMessage(err, 'Geçersiz partner kodu veya kullanıcı bulunamadı.'));
    } finally {
      setIsPairing(false);
    }
  };

  const handleUnpair = () => {
    Alert.alert('Bağlantıyı kes', 'Partner eşleşmesi her iki hesapta da kaldırılır.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Kes',
        style: 'destructive',
        onPress: async () => {
          try {
            await unpair.mutateAsync();
            await refreshUser();
            setShowPairModal(false);
          } catch (err) {
            Alert.alert('Hata', getErrorMessage(err, 'Bağlantı kesilemedi.'));
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Partner</Text>
            <Text style={[styles.screenSubtitle, { color: colors.textMuted }]}>
              {isPaired ? partnerDisplayName : 'Kod ile eşleşin'}
            </Text>
          </View>

          <Pressable
            style={[
              styles.pairStatusBtn,
              { backgroundColor: isPaired ? Colors.floTealLight : Colors.floPinkLight },
            ]}
            onPress={() => setShowPairModal(true)}
          >
            <Ionicons
              name={isPaired ? 'checkmark-circle' : 'link'}
              size={16}
              color={isPaired ? Colors.floTeal : Colors.floPink}
            />
            <Text
              style={[
                styles.pairStatusText,
                { color: isPaired ? Colors.floTeal : Colors.floPink },
              ]}
            >
              {isPaired ? 'Bağlı' : 'Bağla'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.floPink} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Partner Hero Card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.codeBox,
              { backgroundColor: colors.inputBg, borderColor: colors.border },
            ]}
          >
            <View style={styles.codeTextCol}>
              <Text style={[styles.codeLabel, { color: colors.textMuted }]}>Kodunuz</Text>
              <Text style={[styles.codeValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                {myCode}
              </Text>
            </View>
            <View style={styles.codeBtnRow}>
              <Pressable style={styles.copyBtn} onPress={copyMyCode} hitSlop={6}>
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={copied ? Colors.floTeal : Colors.floPink}
                />
                <Text
                  style={[
                    styles.copyBtnText,
                    { color: copied ? Colors.floTeal : Colors.floPink },
                  ]}
                  numberOfLines={1}
                >
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.shareBtn, { backgroundColor: Colors.floPink }]}
                onPress={shareInvite}
                hitSlop={6}
              >
                <Ionicons name="share-social" size={15} color="#FFFFFF" />
                <Text style={styles.shareBtnText} numberOfLines={1}>Paylaş</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {isPaired && (
          <View style={styles.nudgeStrip}>
            {[
              { id: 'massage', emoji: '💆', label: 'Masaj' },
              { id: 'calm', emoji: '🌿', label: 'Huzur' },
              { id: 'intimacy', emoji: '💕', label: 'Yakınlık' },
              { id: 'hug', emoji: '🤗', label: 'Sarıl' },
            ].map((n) => (
              <Pressable
                key={n.id}
                onPress={() => sendQuickNudge(n.id, n.label)}
                style={({ pressed }) => [
                  styles.nudgeChip,
                  { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border },
                  sentNudge === n.id && { backgroundColor: Colors.floPinkLight, borderColor: 'transparent' },
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text style={{ fontSize: 16 }}>{sentNudge === n.id ? '✓' : n.emoji}</Text>
                <Text
                  style={[
                    styles.nudgeChipText,
                    { color: sentNudge === n.id ? Colors.floPink : colors.text },
                  ]}
                >
                  {sentNudge === n.id ? 'Gönderildi' : n.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => router.push('/story/couple-requests' as any)}
              style={[styles.nudgeChip, { backgroundColor: Colors.floPinkLight, borderColor: 'transparent' }]}
            >
              <Text style={[styles.nudgeChipText, { color: Colors.floPink }]}>Tümü</Text>
            </Pressable>
          </View>
        )}
        <CoupleToolsGrid isPaired={isPaired} />

        {/* Relationship Details & Anniversary */}
        {rel && (
          <View
            style={[
              styles.relationshipDetailsCard,
              { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border },
            ]}
          >
            <View style={styles.relDetailHeader}>
              <Text style={[styles.relDetailTitle, { color: colors.text }]}>İlişki</Text>
              <Pressable
                onPress={() => router.push('/story/couple-profile')}
                style={styles.relEditBtn}
              >
                <Ionicons name="create-outline" size={16} color={Colors.primary} />
                <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 12 }}>Düzenle</Text>
              </Pressable>
            </View>

            <View style={[styles.statRow, { backgroundColor: isDark ? '#3D2032' : '#FFF0F6' }]}>
              <Ionicons name="time-outline" size={22} color={Colors.relationship} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Birlikte Geçen Süre</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {rel.daysTogether || 0} gün ({Math.floor((rel.daysTogether || 0) / 365)} yıl {Math.floor(((rel.daysTogether || 0) % 365) / 30)} ay)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Special Dates Section */}
        <View style={styles.datesHeaderRow}>
            <Text style={[styles.sectionHeading, { color: colors.text, marginBottom: 0 }]}>
            Özel günler
          </Text>
          <Pressable
            style={[styles.addDatePill, { backgroundColor: Colors.floPinkLight }]}
            onPress={() => router.push('/story/create-date')}
          >
            <Ionicons name="add" size={16} color={Colors.floPink} />
            <Text style={[styles.addDatePillText, { color: Colors.floPink }]}>Ekle</Text>
          </Pressable>
        </View>

        {dates.length === 0 ? (
          <View
            style={[
              styles.emptyDatesCard,
              { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border },
            ]}
          >
            <Text style={{ fontSize: 32 }}>🎉</Text>
            <Text style={[styles.emptyDatesText, { color: colors.text }]}>
              Henüz özel gün eklenmedi
            </Text>
            <Text style={[styles.emptyDatesSub, { color: colors.textMuted }]}>
              Yıldönümü, doğum günü ve unutulmaz anları kaydedin
            </Text>
          </View>
        ) : (
          dates.map(d => (
            <Pressable
              key={d.id}
              style={[
                styles.dateCard,
                { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border },
              ]}
              onPress={() => router.push(`/story/dates?id=${d.id}`)}
            >
              <View style={[styles.dateIconBox, { backgroundColor: Colors.floPinkLight }]}>
                <Ionicons name="gift" size={18} color={Colors.floPink} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.dateTitle, { color: colors.text }]}>{d.title}</Text>
                <Text style={[styles.dateSubtitle, { color: colors.textMuted }]}>
                  {d.date ? new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''}
                </Text>
              </View>
              <View style={[styles.daysLeftBadge, { backgroundColor: Colors.floPinkLight }]}>
                <Text style={[styles.daysLeftText, { color: Colors.floPink }]}>
                  {d.daysUntil === 0 ? 'Bugün!' : `${d.daysUntil ?? '?'} gün`}
                </Text>
              </View>
            </Pressable>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pair Modal */}
      <Modal
        visible={showPairModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPairModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalHeading, { color: colors.text }]}>
                {isPaired ? 'Partner bağlantısı' : 'Partneri bağla'}
              </Text>
              <Pressable onPress={() => setShowPairModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </Pressable>
            </View>

            {isPaired ? (
              <>
                <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
                  {partnerDisplayName} ile eşleştiniz. Sohbet, istekler ve konum yalnızca ikinizde görünür.
                </Text>
                <View style={styles.modalBtnRow}>
                  <Pressable
                    style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                    onPress={() => setShowPairModal(false)}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.text }]}>Tamam</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalSubmitBtn, { backgroundColor: Colors.danger }]}
                    onPress={handleUnpair}
                    disabled={unpair.isPending}
                  >
                    <Text style={styles.modalSubmitText}>{unpair.isPending ? 'Kesiliyor…' : 'Bağlantıyı kes'}</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
                  Partnerinizin ekranındaki kodu girin. Örnek: BL-9X2K4A. Kendi kodunuz yukarıda, “Kopyala” ile panoya alınır.
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? '#2D2030' : '#F9F7F8',
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Örn: BL-9X2K4A"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  value={partnerCodeInput}
                  onChangeText={setPartnerCodeInput}
                />
                <View style={styles.modalBtnRow}>
                  <Pressable
                    style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                    onPress={() => setShowPairModal(false)}
                  >
                    <Text style={[styles.modalCancelText, { color: colors.text }]}>Vazgeç</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalSubmitBtn, { backgroundColor: Colors.floPink }]}
                    onPress={handlePair}
                    disabled={isPairing}
                  >
                    <Text style={styles.modalSubmitText}>
                      {isPairing ? 'Eşleştiriliyor...' : 'Eşleştir'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  screenTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  screenSubtitle: { fontSize: 13, marginTop: 2 },
  pairStatusBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  pairStatusText: { fontSize: 12, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  heroCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: Colors.relationship, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  heroCoupleImg: { width: '100%', height: 130, borderRadius: 16, marginBottom: 12 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  heroIconBox: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  heroCardTitle: { fontSize: 17, fontWeight: '800' },
  heroCardSub: { fontSize: 12, marginTop: 2 },
  codeBox: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', rowGap: 10, columnGap: 8,
    padding: 12, borderRadius: 16, borderWidth: 1,
  },
  codeTextCol: { flexGrow: 1, flexShrink: 1, minWidth: 120 },
  codeLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  codeValue: { fontSize: 16, fontWeight: '800', letterSpacing: 1, marginTop: 2 },
  codeBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.03)' },
  copyBtnText: { fontSize: 12, fontWeight: '700' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12 },
  shareBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  sectionHeading: { fontSize: 17, fontWeight: '800', marginBottom: 12 },
  coupleToolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  nudgeStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  nudgeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  nudgeChipText: { fontSize: 12, fontWeight: '700' },
  coupleToolCard: { width: '48%', padding: 14, borderRadius: 18, borderWidth: 1, ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 1 } }) },
  coupleToolIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  coupleToolTitle: { fontSize: 13.5, fontWeight: '800', marginBottom: 2 },
  coupleToolSub: { fontSize: 10.5 },
  previewGrid: { gap: 10, marginBottom: 24 },
  featureCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  featureDesc: { fontSize: 12, flex: 1, lineHeight: 16 },
  relationshipDetailsCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
  relDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  relDetailTitle: { fontSize: 15, fontWeight: '700' },
  relEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14 },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statValue: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  datesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addDatePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  addDatePillText: { fontSize: 12, fontWeight: '700' },
  emptyDatesCard: { padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center', gap: 6 },
  emptyDatesText: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  emptyDatesSub: { fontSize: 12, textAlign: 'center' },
  dateCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  dateIconBox: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dateTitle: { fontSize: 14, fontWeight: '700' },
  dateSubtitle: { fontSize: 12, marginTop: 2 },
  daysLeftBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  daysLeftText: { fontSize: 11, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', maxWidth: 360, borderRadius: 24, padding: 20 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalHeading: { fontSize: 18, fontWeight: '800' },
  modalDesc: { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  modalInput: { height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontWeight: '700', letterSpacing: 1, textAlign: 'center', marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '700' },
  modalSubmitBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalSubmitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

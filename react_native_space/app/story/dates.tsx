import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSpecialDatesControllerGetById, useSpecialDatesControllerRemove, useRelationshipControllerGet, useSpecialDatesControllerGetAll } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useQueryClient } from '@tanstack/react-query';

export default function DateDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id = '' } = useLocalSearchParams();
  const dateId = String(id);
  const { data, isLoading } = useSpecialDatesControllerGetById(dateId, { query: { enabled: !!dateId } });
  const { data: rel, isLoading: relLoading } = useRelationshipControllerGet();
  const { data: allDatesData } = useSpecialDatesControllerGetAll({ page: 1, limit: 10 }, { query: { enabled: !dateId } });
  const removeMutation = useSpecialDatesControllerRemove();

  const handleDelete = () => {
    if (!dateId) return;
    Alert.alert('Sil', 'Bu özel günü silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: () => {
          removeMutation.mutate({ id: dateId }, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['/api/special-dates'] });
              router.back();
            },
          });
        },
      },
    ]);
  };

  if (isLoading || relLoading) return <LoadingScreen />;

  // Calculate relationship counters
  const startDate = rel?.startDate ? new Date(rel.startDate) : null;
  const daysTogether = rel?.daysTogether ?? 0;
  const years = Math.floor(daysTogether / 365);
  const months = Math.floor((daysTogether % 365) / 30);
  const remainDays = daysTogether % 30;

  let daysUntilAnniversary = 0;
  let nextAnniversaryYear = 1;
  let thisYearAnn = new Date();
  if (startDate) {
    const now = new Date();
    thisYearAnn = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (thisYearAnn < now) {
      thisYearAnn.setFullYear(thisYearAnn.getFullYear() + 1);
    }
    daysUntilAnniversary = Math.max(0, Math.ceil((thisYearAnn.getTime() - now.getTime()) / 86400000));
    nextAnniversaryYear = Math.max(1, thisYearAnn.getFullYear() - startDate.getFullYear());
  }

  const specialDatesList = allDatesData?.items ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {dateId ? 'Özel Gün Detayı' : 'İlişki & Yıldönümü'}
          </Text>
          {dateId ? (
            <Pressable onPress={handleDelete} style={{ padding: 4 }}>
              <Ionicons name="trash-outline" size={22} color={Colors.danger} />
            </Pressable>
          ) : (
            <Pressable onPress={() => router.push('/story/couple-profile')} style={{ padding: 4 }}>
              <Ionicons name="create-outline" size={22} color={Colors.primary} />
            </Pressable>
          )}
        </View>

        {/* Specific special date card if dateId exists */}
        {dateId && data && (
          <View style={[styles.card, { backgroundColor: colors.card, marginBottom: 20 }]}>
            <Text style={{ fontSize: 44, textAlign: 'center', marginBottom: 12 }}>🎉</Text>
            <Text style={[styles.title, { color: colors.text }]}>{data.title ?? ''}</Text>
            <Text style={[styles.date, { color: Colors.relationship }]}>
              {data.date ? new Date(data.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </Text>
            {data.daysUntil != null && (
              <View style={[styles.daysBadge, { backgroundColor: data.daysUntil === 0 ? Colors.success + '20' : Colors.primary + '15' }]}>
                <Text style={{ color: data.daysUntil === 0 ? Colors.success : Colors.primary, fontWeight: '700', fontSize: 16 }}>
                  {data.daysUntil === 0 ? 'Bugün! 🎉' : `${data.daysUntil} gün kaldı`}
                </Text>
              </View>
            )}
            {data.description ? <Text style={[styles.desc, { color: colors.textSecondary }]}>{data.description}</Text> : null}
            <View style={styles.infoRow}>
              <Ionicons name={data.isRecurring ? 'repeat' : 'calendar'} size={16} color={colors.textMuted} />
              <Text style={[styles.infoText, { color: colors.textMuted }]}>{data.isRecurring ? 'Her yıl tekrarlanır' : 'Tek seferlik'}</Text>
            </View>

            {(data.reminderDaysList?.length ?? 0) > 0 && (
              <View style={[styles.reminderInfo, { borderTopColor: colors.border }]}>
                <Ionicons name="notifications-outline" size={16} color={Colors.primary} />
                <Text style={[styles.reminderText, { color: colors.textSecondary }]}>
                  Hatırlatma: {(data.reminderDaysList ?? []).map(d => {
                    if (d === 0) return 'Aynı gün';
                    if (d === 1) return '1 gün önce';
                    if (d === 7) return '1 hafta önce';
                    if (d === 30) return '1 ay önce';
                    return `${d} gün önce`;
                  }).join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Relationship counters and details */}
        {rel && startDate ? (
          <View style={{ gap: 14 }}>
            {/* Header Hero Card */}
            <View style={[styles.heroCard, { backgroundColor: Colors.relationship + '12', borderColor: Colors.relationship + '30' }]}>
              <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>💑</Text>
              <Text style={[styles.heroPartner, { color: colors.text }]}>{rel.partnerName ?? 'Partneriniz'}</Text>
              <Text style={[styles.heroDate, { color: colors.textSecondary }]}>
                Birliktelik Başlangıcı: {startDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </View>

            {/* Birlikte Geçen Süre Sayacı */}
            <View style={[styles.counterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.counterIconCircle, { backgroundColor: Colors.relationship + '20' }]}>
                <Ionicons name="time" size={24} color={Colors.relationship} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.counterLabel, { color: colors.textMuted }]}>Birlikte Geçen Süre</Text>
                <Text style={[styles.counterValue, { color: colors.text }]}>
                  {years > 0 ? `${years} yıl ` : ''}{months > 0 ? `${months} ay ` : ''}{remainDays} gün
                </Text>
                <Text style={[styles.counterSub, { color: Colors.relationship }]}>Toplam {daysTogether} gündür birliktesiniz 💕</Text>
              </View>
            </View>

            {/* Yıldönümü Geri Sayım Sayacı */}
            <View style={[styles.counterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.counterIconCircle, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="gift" size={24} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.counterLabel, { color: colors.textMuted }]}>{nextAnniversaryYear}. Yıldönümünüze Kalan</Text>
                <Text style={[styles.counterValue, { color: Colors.primary }]}>
                  {daysUntilAnniversary === 0 ? 'Bugün Yıldönümünüz! 🎉' : `${daysUntilAnniversary} gün`}
                </Text>
                <Text style={[styles.counterSub, { color: colors.textSecondary }]}>
                  {thisYearAnn.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>

            {/* Edit Button */}
            <Pressable style={[styles.actionButton, { borderColor: colors.border }]} onPress={() => router.push('/story/couple-profile')}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
              <Text style={[styles.actionButtonText, { color: Colors.primary }]}>İlişki Bilgilerini Düzenle</Text>
            </Pressable>

            {/* Special dates list if on main view */}
            {!dateId && specialDatesList.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Kayıtlı Özel Günler</Text>
                {specialDatesList.map(sd => (
                  <Pressable
                    key={sd?.id}
                    style={[styles.miniDateCard, { backgroundColor: colors.card }]}
                    onPress={() => router.push(`/story/dates?id=${sd?.id}`)}
                  >
                    <View style={[styles.miniDateIcon, { backgroundColor: Colors.relationship + '15' }]}>
                      <Ionicons name="heart" size={18} color={Colors.relationship} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.miniDateTitle, { color: colors.text }]}>{sd?.title}</Text>
                      <Text style={[styles.miniDateSubtitle, { color: colors.textMuted }]}>
                        {sd?.date ? new Date(sd.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''}
                      </Text>
                    </View>
                    <View style={[styles.miniBadge, { backgroundColor: Colors.primary + '15' }]}>
                      <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 12 }}>
                        {sd?.daysUntil === 0 ? 'Bugün!' : `${sd?.daysUntil ?? '?'} gün`}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>💕</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz ilişki bilgisi eklenmemiş.</Text>
            <Pressable style={[styles.addBtn, { backgroundColor: Colors.relationship }]} onPress={() => router.push('/setup/relationship')}>
              <Text style={styles.addBtnText}>İlişki Bilgisi Ekle</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700' },
  card: { borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  date: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  daysBadge: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, marginBottom: 16 },
  desc: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13 },
  reminderInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  reminderText: { fontSize: 13, flex: 1 },
  heroCard: { borderRadius: 20, padding: 22, borderWidth: 1, alignItems: 'center' },
  heroPartner: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  heroDate: { fontSize: 13 },
  counterCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  counterIconCircle: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  counterLabel: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  counterValue: { fontSize: 19, fontWeight: '800' },
  counterSub: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1, marginTop: 4 },
  actionButtonText: { fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  miniDateCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 8, gap: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  miniDateIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniDateTitle: { fontSize: 15, fontWeight: '600' },
  miniDateSubtitle: { fontSize: 12, marginTop: 2 },
  miniBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 60, padding: 20 },
  emptyText: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  addBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

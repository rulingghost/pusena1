import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert, Linking, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { getErrorMessage } from '@/src/api/customFetch';
import { useCoupleLocation, useUpsertCoupleLocation } from '@/src/api/bloomClient';
import { HintNote } from '@/src/components/HintNote';
import { setLocationSharingFlag } from '@/src/location/PartnerLocationSync';
import {
  startPartnerLocationShare,
  stopPartnerLocationShare,
  publishPartnerLocationOnce,
  type ShareMode,
} from '@/src/location/backgroundShare';

function ago(iso?: string | null) {
  if (!iso) return 'henüz yok';
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins} dk önce`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

function mapsUrl(lat: number, lng: number, label = 'Partner') {
  const q = `${lat},${lng}`;
  return Platform.select({
    ios: `http://maps.apple.com/?ll=${q}&q=${encodeURIComponent(label)}`,
    android: `geo:${q}?q=${q}(${encodeURIComponent(label)})`,
    default: `https://www.google.com/maps?q=${q}`,
  }) as string;
}

function freshnessLabel(kind?: string) {
  if (kind === 'live') return 'Canlı';
  if (kind === 'recent') return 'Güncel';
  if (kind === 'stale') return 'Eski';
  return 'Kapalı';
}

function freshnessColor(kind?: string) {
  if (kind === 'live') return Colors.success;
  if (kind === 'recent') return Colors.floTeal;
  if (kind === 'stale') return Colors.warning;
  return '#94A3B8';
}

export default function CoupleLocationScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useCoupleLocation();
  const upsert = useUpsertCoupleLocation();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<ShareMode | null>(null);
  const [myPlace, setMyPlace] = useState<string | null>(null);
  const [partnerPlace, setPartnerPlace] = useState<string | null>(null);

  const sharing = data?.mine.sharingEnabled ?? false;
  const partner = data?.partner;
  const distanceKm = data?.distanceKm;

  const reverse = async (lat: number, lng: number) => {
    try {
      const rows = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const r = rows[0];
      if (!r) return null;
      return [r.district, r.city || r.subregion, r.country].filter(Boolean).join(', ');
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (data?.mine.latitude != null && data?.mine.longitude != null) {
      reverse(data.mine.latitude, data.mine.longitude).then(setMyPlace);
    } else {
      setMyPlace(null);
    }
    if (partner?.latitude != null && partner?.longitude != null) {
      reverse(partner.latitude, partner.longitude).then(setPartnerPlace);
    } else {
      setPartnerPlace(null);
    }
  }, [data?.mine.latitude, data?.mine.longitude, partner?.latitude, partner?.longitude]);

  // Ön plan modunda arka plan servisi yok; ekran açıkken periyodik yayın şart.
  useEffect(() => {
    if (!sharing) return;
    const t = setInterval(() => {
      publishPartnerLocationOnce()
        .then(() => refetch())
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(t);
  }, [sharing, refetch]);

  const publish = async (enabled: boolean) => {
    setBusy(true);
    try {
      if (!enabled) {
        await stopPartnerLocationShare();
        await upsert.mutateAsync({ sharingEnabled: false });
        await setLocationSharingFlag(false);
        setMode(null);
        refetch();
        return;
      }

      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert(
          'İzin gerekli',
          'Konum paylaşımı için konum izni verin. Konumunuz yalnızca eşleşmiş partnerinize gider.',
          [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Ayarları aç', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const pos = await publishPartnerLocationOnce();
      await upsert.mutateAsync({
        sharingEnabled: true,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? undefined,
      });
      await setLocationSharingFlag(true);
      refetch();

      // Paylaşım zaten açıldı; arka plan servisi başlatılamazsa akış bozulmasın.
      const started = await startPartnerLocationShare().catch(() => 'foreground' as const);
      setMode(started);
      if (started === 'foreground') {
        Alert.alert(
          'Paylaşım açıldı',
          Platform.OS === 'ios'
            ? 'Konumunuz gidiyor. Uygulama kapalıyken de güncellenmesi için konum iznini “Her Zaman” yapın: Ayarlar > Pusena > Konum.'
            : 'Konumunuz gidiyor. Uygulama kapalıyken de güncellenmesi için konum iznini “Her zaman izin ver” yapın.',
          [
            { text: 'Şimdilik yeter', style: 'cancel' },
            { text: 'Ayarları aç', onPress: () => Linking.openSettings() },
          ],
        );
      }
    } catch (err) {
      Alert.alert('Konum kaydedilemedi', getErrorMessage(err, 'Konum alınamadı.'));
    } finally {
      setBusy(false);
    }
  };

  const openMaps = (lat?: number | null, lng?: number | null, label?: string) => {
    if (lat == null || lng == null) return;
    Linking.openURL(mapsUrl(lat, lng, label));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Konum paylaşımı</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>Sadece eşleşmiş partner görür · varsayılan kapalı</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        {error ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>Önce partner kodu ile eşleşin.</Text>
        ) : isLoading && !data ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          <>
            <HintNote text="Açıkken konum arka planda da gider. Kapatınca partneriniz görmez." />

            {distanceKm != null && (
              <View style={[styles.distanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={styles.distanceEmoji}>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Aranızdaki yaklaşık mesafe</Text>
                  <Text style={[styles.distanceValue, { color: colors.accent }]}>
                    {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm} km`}
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Konumumu paylaş</Text>
                  <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                    {sharing
                      ? `${freshnessLabel(data?.mine.freshness)} · ${ago(data?.mine.updatedAt)}${myPlace ? ` · ${myPlace}` : ''}`
                      : 'Kapalıyken partneriniz sizi göremez'}
                  </Text>
                </View>
                <Switch
                  value={sharing}
                  disabled={busy || isLoading}
                  onValueChange={(v) => publish(v)}
                  trackColor={{ true: colors.accent }}
                />
              </View>
              {sharing && (
                <>
                  {data?.mine.accuracy != null && (
                    <Text style={[styles.meta, { color: colors.textMuted }]}>
                      Doğruluk ±{Math.round(data.mine.accuracy)} m
                    </Text>
                  )}
                  <View style={[styles.refresh, { backgroundColor: colors.accent }]}>
                    <Ionicons name="radio" size={16} color="#fff" />
                    <Text style={styles.refreshText}>
                      {busy
                        ? 'Açılıyor…'
                        : mode === 'foreground'
                          ? 'Paylaşım açık · uygulama açıkken güncellenir'
                          : 'Paylaşım açık · arka planda güncellenir'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setBusy(true);
                      publishPartnerLocationOnce()
                        .then(() => refetch())
                        .catch((err) => Alert.alert('Güncellenemedi', getErrorMessage(err, 'Konum alınamadı.')))
                        .finally(() => setBusy(false));
                    }}
                    disabled={busy}
                    style={[styles.secondary, { borderColor: colors.border }]}
                  >
                    <Ionicons name="refresh" size={16} color={colors.text} />
                    <Text style={[styles.secondaryText, { color: colors.text }]}>Konumumu şimdi güncelle</Text>
                  </Pressable>
                  {data?.mine.latitude != null && (
                    <Pressable
                      onPress={() => openMaps(data.mine.latitude, data.mine.longitude, 'Ben')}
                      style={[styles.secondary, { borderColor: colors.border }]}
                    >
                      <Ionicons name="map-outline" size={16} color={colors.text} />
                      <Text style={[styles.secondaryText, { color: colors.text }]}>Kendi konumumu haritada aç</Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.partnerHead}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{partner?.name || 'Partner'} konumu</Text>
                <View style={[styles.dot, { backgroundColor: freshnessColor(partner?.freshness) }]} />
                <Text style={[styles.fresh, { color: freshnessColor(partner?.freshness) }]}>
                  {freshnessLabel(partner?.freshness)}
                </Text>
              </View>
              {!partner?.sharingEnabled || partner.latitude == null || partner.longitude == null ? (
                <Text style={[styles.cardSub, { color: colors.textMuted, marginTop: 8 }]}>
                  Partner henüz konum paylaşmıyor. Paylaşımı açmasını isteyebilirsiniz.
                </Text>
              ) : (
                <>
                  {partnerPlace ? (
                    <Text style={[styles.place, { color: colors.text }]}>{partnerPlace}</Text>
                  ) : null}
                  <Text style={[styles.coords, { color: colors.textSecondary }]}>
                    {partner.latitude.toFixed(5)}, {partner.longitude.toFixed(5)}
                  </Text>
                  <Text style={[styles.cardSub, { color: colors.textMuted }]}>Güncellendi {ago(partner.updatedAt)}</Text>
                  <Pressable
                    onPress={() => openMaps(partner.latitude, partner.longitude, partner.name)}
                    style={[styles.refresh, { backgroundColor: Colors.floTeal, marginTop: 12 }]}
                  >
                    <Ionicons name="navigate" size={16} color="#fff" />
                    <Text style={styles.refreshText}>Yol tarifi / haritada aç</Text>
                  </Pressable>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 1 },
  privacy: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12, alignItems: 'flex-start' },
  privacyText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  distanceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 12 },
  distanceEmoji: { fontSize: 28 },
  distanceValue: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  card: { borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardSub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  meta: { fontSize: 12, marginTop: 10 },
  coords: { fontSize: 15, fontWeight: '700', marginTop: 10 },
  place: { fontSize: 15, fontWeight: '700', marginTop: 10 },
  refresh: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 14 },
  refreshText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  secondary: { marginTop: 8, height: 42, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryText: { fontWeight: '700', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  partnerHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  fresh: { fontSize: 12, fontWeight: '800' },
});

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSettingsControllerGetSettings } from '@/src/api/generated/api';
import { usePatchPrivacySettings } from '@/src/api/bloomClient';
import { LoadingScreen } from '@/src/components/LoadingScreen';

import { getApiBase } from '@/src/api/apiBase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function PrivacySettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { data: settings, isLoading } = useSettingsControllerGetSettings();
  const updateMutation = usePatchPrivacySettings();
  const [profilePublic, setProfilePublic] = useState(true);
  const [showCommunityPosts, setShowCommunityPosts] = useState(true);
  const [allowFollow, setAllowFollow] = useState(true);

  useEffect(() => {
    if (settings?.privacy) {
      const p = settings.privacy as any;
      setProfilePublic(p.profilePublic ?? true);
      setShowCommunityPosts(p.showCommunityPosts ?? true);
      setAllowFollow(p.allowFollow !== false);
    }
  }, [settings]);

  const handleToggle = (key: 'profilePublic' | 'showCommunityPosts' | 'allowFollow', val: boolean) => {
    const prev = { profilePublic, showCommunityPosts, allowFollow };
    if (key === 'profilePublic') setProfilePublic(val);
    if (key === 'showCommunityPosts') setShowCommunityPosts(val);
    if (key === 'allowFollow') setAllowFollow(val);

    updateMutation.mutate(
      { [key]: val },
      {
        onError: () => {
          setProfilePublic(prev.profilePublic);
          setShowCommunityPosts(prev.showCommunityPosts);
          setAllowFollow(prev.allowFollow);
          Alert.alert('Kaydedilemedi', 'Gizlilik ayarı sunucuya yazılamadı.');
        },
      },
    );
  };

  const openUrl = async (path: string) => {
    const fullUrl = `${getApiBase()}${path}`;
    try {
      await WebBrowser.openBrowserAsync(fullUrl);
    } catch {
      await Linking.openURL(fullUrl).catch(() => {
        Alert.alert('Hata', 'Web sayfası açılamadı.');
      });
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8, paddingBottom: 40 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gizlilik ve Güvenlik</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={[styles.infoCard, { backgroundColor: Colors.primary + '14', borderColor: Colors.primary + '30' }]}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoCardTitle, { color: Colors.primary }]}>Hassas Sağlık Verisi Koruması</Text>
            <Text style={[styles.infoCardDesc, { color: colors.textMuted }]}>
              Döngü, gebelik ve konum verileriniz şifrelenir; asla üçüncü taraf reklam ağlarına veya veri komisyoncularına satılmaz.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Görünürlük Tercihleri</Text>
        <Text style={[styles.intro, { color: colors.textMuted }]}>
          Bu anahtarlar sunucuya kaydedilir. Kapalıyken diğer kullanıcılar ilgili içeriği göremez veya sizi takip edemez.
        </Text>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Herkese açık profil</Text>
            <Text style={[styles.rowHint, { color: colors.textMuted }]}>
              Kapalıysa biyografiniz ve gönderileriniz yalnızca sizi takip edenlere görünür
            </Text>
          </View>
          <Switch value={profilePublic} onValueChange={(v) => handleToggle('profilePublic', v)} trackColor={{ true: Colors.primary }} />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Topluluk paylaşımları</Text>
            <Text style={[styles.rowHint, { color: colors.textMuted }]}>Kapalıysa gönderileriniz akışta listelenmez</Text>
          </View>
          <Switch value={showCommunityPosts} onValueChange={(v) => handleToggle('showCommunityPosts', v)} trackColor={{ true: Colors.primary }} />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Takip edilmeyi aç</Text>
            <Text style={[styles.rowHint, { color: colors.textMuted }]}>
              Kapalıysa kimse sizi yeni takip edemez. Mevcut takipçiler kalır; onlar sizi bırakabilir.
            </Text>
          </View>
          <Switch value={allowFollow} onValueChange={(v) => handleToggle('allowFollow', v)} trackColor={{ true: Colors.primary }} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 28 }]}>Yasal ve Sözleşmeler</Text>

        <Pressable
          style={[styles.linkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => openUrl('/privacy')}
        >
          <View style={styles.linkLeft}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.primary + '18' }]}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Gizlilik Politikası & KVKK</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textMuted }]}>
                Veri işleme, saklama ve haklarınızı tarayıcıda inceleyin
              </Text>
            </View>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
        </Pressable>

        <Pressable
          style={[styles.linkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => openUrl('/delete-account')}
        >
          <View style={styles.linkLeft}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.danger + '18' }]}>
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Web Üzerinden Hesap ve Veri Silme</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textMuted }]}>
                Uygulama dışından hesap ve sağlık verilerini kalıcı silme formu
              </Text>
            </View>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
        </Pressable>

        <Pressable
          style={[styles.linkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/profile/account-settings')}
        >
          <View style={styles.linkLeft}>
            <View style={[styles.iconCircle, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="settings-outline" size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Uygulama İçi Hesap Yönetimi</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textMuted }]}>
                Şifre değiştirme veya anında hesap kapatma
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        <View style={styles.contactFooter}>
          <Text style={[styles.contactText, { color: colors.textMuted }]}>
            Veri sorumlusu irtibat: destek@pusena.app
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoCardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  infoCardDesc: { fontSize: 12, lineHeight: 17 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  intro: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  rowHint: { fontSize: 12, paddingRight: 12, lineHeight: 17 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 8 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 14.5, fontWeight: '600', marginBottom: 2 },
  linkSubtitle: { fontSize: 12, lineHeight: 16 },
  contactFooter: { marginTop: 16, alignItems: 'center' },
  contactText: { fontSize: 12 },
});

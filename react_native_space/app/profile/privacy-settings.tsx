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

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gizlilik ayarları</Text>
          <View style={{ width: 32 }} />
        </View>

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
  intro: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  rowHint: { fontSize: 12, paddingRight: 12, lineHeight: 17 },
});

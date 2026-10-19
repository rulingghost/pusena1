import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAppTheme } from '@/src/contexts/ThemeContext';
import { resolveMediaUrl } from '@/src/utils/mediaUrl';
import { useSettingsControllerGetSettings } from '@/src/api/generated/api';
import { isMaleUser } from '@/src/utils/gender';

interface SectionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  route?: string;
  color?: string;
}

interface MenuSection {
  id: string;
  title: string;
  color: string;
  items: SectionItem[];
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode, isDark } = useAppTheme();
  const { data: settings } = useSettingsControllerGetSettings();
  const male = isMaleUser(user);
  const modules = settings?.activeModules ?? [];

  const sections: MenuSection[] = [
    {
      id: 'use',
      title: 'Kullan',
      color: Colors.primary,
      items: [
        { icon: 'people', label: 'Partner', route: '/tabs/story', color: Colors.relationship },
        ...(!male && modules.includes('period')
          ? [{ icon: 'calendar-outline' as const, label: 'Döngü', route: '/period', color: Colors.floPink }]
          : []),
        ...(!male && modules.includes('pregnancy')
          ? [{ icon: 'happy-outline' as const, label: 'Gebelik', route: '/pregnancy', color: Colors.pregnancy }]
          : []),
        { icon: 'chatbubble-ellipses-outline', label: 'Asistan', route: '/tabs/messages', color: Colors.floTeal },
        { icon: 'document-text-outline', label: 'Sağlık özeti', route: '/profile/health-report', color: Colors.floPurple },
      ],
    },
    {
      id: 'settings',
      title: 'Hesap',
      color: '#6B7280',
      items: [
        { icon: 'person-outline', label: 'Profili düzenle', route: '/profile/edit' },
        { icon: 'apps-outline', label: 'Modüller', route: '/setup', color: Colors.primary },
        { icon: 'notifications-outline', label: 'Bildirimler', route: '/profile/notification-settings', color: '#F59E0B' },
        { icon: 'eye-outline', label: 'Gizlilik', route: '/profile/privacy-settings', color: '#6366F1' },
        { icon: 'language-outline', label: 'Dil', route: '/profile/language', color: '#0EA5E9' },
        { icon: 'lock-closed-outline', label: 'Hesap', route: '/profile/account-settings' },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarBox, { backgroundColor: colors.accentLight }]}>
            {user?.avatarUrl ? (
              <Image source={{ uri: resolveMediaUrl(user.avatarUrl) }} style={styles.avatarImg} />
            ) : (
              <Text style={[styles.avatarLetter, { color: colors.accent }]}>{user?.name ? user.name[0].toUpperCase() : 'P'}</Text>
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Pusena kullanıcısı'}</Text>
            <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email}</Text>
          </View>
          <Pressable
            style={[styles.editBtn, { backgroundColor: colors.accentLight }]}
            onPress={() => router.push('/profile/edit')}
          >
            <Ionicons name="pencil" size={16} color={colors.accent} />
          </Pressable>
        </View>

        {sections.map((section) => (
          <View key={section.id} style={styles.sectionWrap}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIconDot, { backgroundColor: section.color }]} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            </View>
            <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuRow,
                    idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#2D2030' : '#F3F4F6' },
                  ]}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <View style={[styles.menuIconCircle, { backgroundColor: (item.color || colors.textMuted) + '15' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color || colors.text} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                    {item.subtitle ? <Text style={[styles.menuSub, { color: colors.textMuted }]}>{item.subtitle}</Text> : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.themeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={Colors.floPurple} />
            <Text style={[styles.themeTitle, { color: colors.text }]}>Görünüm</Text>
          </View>
          <View style={styles.themeButtons}>
            {[
              { mode: 'light', label: 'Açık' },
              { mode: 'dark', label: 'Koyu' },
              { mode: 'system', label: 'Sistem' },
            ].map((t) => (
              <Pressable
                key={t.mode}
                style={[
                  styles.themeBtn,
                  { backgroundColor: themeMode === t.mode ? Colors.floPurple : isDark ? '#2D2030' : '#F3F4F6' },
                ]}
                onPress={() => setThemeMode(t.mode as any)}
              >
                <Text style={[styles.themeBtnText, { color: themeMode === t.mode ? '#FFFFFF' : colors.text }]}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: Colors.danger + '12', borderColor: Colors.danger + '25' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={[styles.logoutText, { color: Colors.danger }]}>Çıkış yap</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 22, borderWidth: 1, marginBottom: 14 },
  avatarBox: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 54, height: 54 },
  avatarLetter: { fontSize: 24, fontWeight: '900' },
  userName: { fontSize: 17, fontWeight: '800' },
  userEmail: { fontSize: 12, marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectionWrap: { marginBottom: 18 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, paddingHorizontal: 4 },
  sectionIconDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '800' },
  menuCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '700' },
  menuSub: { fontSize: 11, marginTop: 2 },
  themeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 14 },
  themeTitle: { fontSize: 14, fontWeight: '700' },
  themeButtons: { flexDirection: 'row', gap: 6 },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  themeBtnText: { fontSize: 11.5, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, borderWidth: 1, marginTop: 4 },
  logoutText: { fontSize: 14, fontWeight: '800' },
});

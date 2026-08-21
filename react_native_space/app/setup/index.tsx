import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSettingsControllerGetSettings, useSettingsControllerUpdateModules } from '@/src/api/generated/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { BrandLogo } from '@/src/components/BrandLogo';
import { isMaleUser, userGender } from '@/src/utils/gender';
import { useUsersControllerUpdateProfile } from '@/src/api/generated/api';
import { finishOnboarding } from '@/src/utils/onboarding';

const MODULES = [
  {
    id: 'pregnancy',
    label: 'Gebelik & Bebek Takibi',
    tag: 'Hamileyim',
    desc: 'Bebeğinizin hafta hafta gelişimi, tekmeler, aşılar ve sayaçlar',
    emoji: '🤰',
    color: Colors.pregnancy,
    bgLight: '#FFF8EB',
    bgDark: '#2D2214',
  },
  {
    id: 'period',
    label: 'Regl & Doğurganlık Takibi',
    tag: 'Döngü & Sağlık',
    desc: 'Döngü evreleri, PMS, yumurtlama ve gebe kalma şansı tahmini',
    emoji: '🌸',
    color: Colors.floPink,
    bgLight: '#FFF0F6',
    bgDark: '#2D1828',
  },
  {
    id: 'relationship',
    label: 'İlişki & Bizim Hikâyemiz',
    tag: 'Partnerimle Birlikte',
    desc: 'Birlikte geçen günler, yıldönümleri, günün çift sorusu ve notlar',
    emoji: '💑',
    color: Colors.relationship,
    bgLight: '#FFF0F6',
    bgDark: '#2D1828',
  },
];

export default function ModuleSetupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();
  const { data: settingsData } = useSettingsControllerGetSettings();
  const updateModulesMutation = useSettingsControllerUpdateModules();
  const updateProfile = useUsersControllerUpdateProfile();
  const male = isMaleUser(user);
  const [selected, setSelected] = useState<string[]>(male ? ['relationship'] : ['period']);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [pickedGender, setPickedGender] = useState<string | null>(userGender(user));

  useEffect(() => {
    setPickedGender(userGender(user));
  }, [user?.gender]);

  useEffect(() => {
    if (male) {
      setSelected(['relationship']);
      return;
    }
    if (settingsData?.activeModules && settingsData.activeModules.length > 0) {
      setSelected(settingsData.activeModules);
    }
  }, [settingsData, male]);

  const toggleModule = (id: string) => {
    setNoticeMessage(null);

    if (id === 'pregnancy') {
      if (selected.includes('pregnancy')) {
        // Deselecting pregnancy
        setSelected((prev) => prev.filter((m) => m !== 'pregnancy'));
      } else {
        // Selecting pregnancy: Automatically remove period since one cannot be pregnant and menstruating
        const filtered = selected.filter((m) => m !== 'period');
        setSelected([...filtered, 'pregnancy']);
        if (selected.includes('period')) {
          setNoticeMessage('🌸 Gebelik takibi seçildi. Hamilelik sürecinde regl takibi devre dışı bırakıldı.');
        }
      }
    } else if (id === 'period') {
      if (selected.includes('period')) {
        // Deselecting period
        setSelected((prev) => prev.filter((m) => m !== 'period'));
      } else {
        // Selecting period: Automatically remove pregnancy
        const filtered = selected.filter((m) => m !== 'pregnancy');
        setSelected([...filtered, 'period']);
        if (selected.includes('pregnancy')) {
          setNoticeMessage('🌸 Regl takibi seçildi. Gebelik takibi devre dışı bırakıldı.');
        }
      }
    } else if (id === 'relationship') {
      // Relationship can be selected with either or standalone
      setSelected((prev) =>
        prev.includes('relationship')
          ? prev.filter((m) => m !== 'relationship')
          : [...prev, 'relationship']
      );
    }
  };

  const handleSave = async () => {
    if (!pickedGender) {
      Alert.alert('Cinsiyet gerekli', 'Modülleri açmadan önce cinsiyetinizi seçin. Çift eşleşmesinde bu bilgi kullanılır.');
      return;
    }

    if (pickedGender !== user?.gender) {
      try {
        await updateProfile.mutateAsync({ data: { gender: pickedGender } as any });
        await refreshUser();
      } catch {
        Alert.alert('Hata', 'Cinsiyet kaydedilemedi.');
        return;
      }
    }

    const modules = pickedGender === 'male' ? ['relationship'] : selected;
    if (modules.length === 0) {
      Alert.alert('Uyarı', 'Lütfen devam etmek için en az bir özellik seçin.');
      return;
    }

    updateModulesMutation.mutate(
      { data: { activeModules: modules } },
      {
        onSuccess: async () => {
          await refreshUser();
          await queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
          await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
          await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

          if (pickedGender === 'male') {
            if (user?.hasCompletedSetup) {
              router.back();
            } else {
              await finishOnboarding(refreshUser);
              router.replace('/tabs/home');
            }
            return;
          }

          if (user?.hasCompletedSetup) {
            const prevModules = settingsData?.activeModules ?? [];
            const added = modules.filter((m) => !prevModules.includes(m));
            if (added.includes('pregnancy')) {
              router.push('/setup/pregnancy');
            } else if (added.includes('period')) {
              router.push('/setup/period');
            } else {
              router.back();
            }
          } else if (modules.includes('pregnancy')) {
            router.push('/setup/pregnancy');
          } else if (modules.includes('period')) {
            router.push('/setup/period');
          } else {
            await finishOnboarding(refreshUser);
            router.replace('/tabs/home');
          }
        },
        onError: () => Alert.alert('Hata', 'Modüller kaydedilemedi. Lütfen tekrar deneyin.'),
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          {user?.hasCompletedSetup && (
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepHint, { color: colors.accent }]}>ADIM 1 / 2</Text>
            <Text style={[styles.title, { color: colors.text }]}>Pusena'ya Hoş Geldiniz ✨</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {userGender(user)
                ? 'Ne için kullanacaksınız? Birini seçmeniz yeterli.'
                : 'Önce sizi tanıyalım. Cinsiyet, hangi araçların açılacağını belirler.'}
            </Text>
          </View>
          <BrandLogo size={48} />
        </View>

        {!userGender(user) && (
        <>
        <Text style={[styles.genderHeading, { color: colors.text }]}>Cinsiyetiniz</Text>
        <Text style={[styles.genderHint, { color: colors.textMuted }]}>
          Erkek profillerde regl ve gebelik gizlenir; doğrudan ilişki alanı açılır.
        </Text>
        <View style={styles.genderRow}>
          {[
            { key: 'female', label: 'Kadın', icon: 'female-outline' as const },
            { key: 'male', label: 'Erkek', icon: 'male-outline' as const },
            { key: 'other', label: 'Belirtmek istemiyorum', icon: 'ellipsis-horizontal-outline' as const },
          ].map((g) => {
            const active = pickedGender === g.key;
            return (
              <Pressable
                key={g.key}
                onPress={() => {
                  setPickedGender(g.key);
                  if (g.key === 'male') setSelected(['relationship']);
                }}
                style={[
                  styles.genderChip,
                  {
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: active ? colors.accent + '18' : colors.card,
                  },
                ]}
              >
                <Ionicons name={g.icon} size={18} color={active ? colors.accent : colors.textMuted} />
                <Text style={[styles.genderChipText, { color: active ? colors.accent : colors.text }]}>{g.label}</Text>
              </Pressable>
            );
          })}
        </View>
        </>
        )}

        {pickedGender === 'male' ? (
          <View style={[styles.noticeBanner, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
            <Ionicons name="information-circle" size={20} color={colors.accent} />
            <Text style={[styles.noticeText, { color: colors.text }]}>
              Erkek profilde regl ve gebelik takibi gösterilmez. Sizi doğrudan ilişki ve partner alanına alıyoruz.
            </Text>
          </View>
        ) : noticeMessage ? (
          <View style={[styles.noticeBanner, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
            <Ionicons name="information-circle" size={20} color={colors.accent} />
            <Text style={[styles.noticeText, { color: colors.text }]}>{noticeMessage}</Text>
          </View>
        ) : null}

        <View style={styles.modules}>
          {(pickedGender === 'male' ? MODULES.filter((m) => m.id === 'relationship') : MODULES).map((m) => {
            const isSelected = selected.includes(m.id);
            return (
              <Pressable
                key={m.id}
                style={[
                  styles.moduleCard,
                  {
                    backgroundColor: isSelected ? (isDark ? m.bgDark : m.bgLight) : colors.card,
                    borderColor: isSelected ? m.color : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => toggleModule(m.id)}
              >
                <View style={[styles.iconCircle, { backgroundColor: m.color + '20' }]}>
                  <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.moduleTitle, { color: colors.text }]}>{m.label}</Text>
                    <View style={[styles.tagBadge, { backgroundColor: m.color + '20' }]}>
                      <Text style={[styles.tagBadgeText, { color: m.color }]}>{m.tag}</Text>
                    </View>
                  </View>
                  <Text style={[styles.moduleDesc, { color: colors.textSecondary }]}>{m.desc}</Text>
                </View>

                <View
                  style={[
                    styles.checkCircle,
                    {
                      backgroundColor: isSelected ? m.color : colors.inputBg,
                      borderColor: isSelected ? m.color : colors.border,
                    },
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.infoCard, { backgroundColor: isDark ? '#261C24' : '#F9FAFB', borderColor: colors.border }]}>
          <Ionicons name="bulb-outline" size={20} color={Colors.floTeal} />
          <Text style={[styles.infoCardText, { color: colors.textSecondary }]}>
            İlişkiyi sonra Partner sekmesinden bağlayabilirsiniz. Gebelik ve regl aynı anda seçilemez.
          </Text>
        </View>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: pickedGender && (pickedGender === 'male' || selected.length > 0) ? colors.accent : colors.border },
          ]}
          onPress={handleSave}
          disabled={!pickedGender || updateModulesMutation.isPending || updateProfile.isPending}
        >
          {updateModulesMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
            {user?.hasCompletedSetup ? 'Kaydet' : 'Devam et'}
            </Text>
          )}
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  stepHint: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 13, lineHeight: 18 },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  noticeText: { flex: 1, fontSize: 12.5, lineHeight: 17, fontWeight: '600' },
  modules: { gap: 14, marginBottom: 20 },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    padding: 16,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  iconCircle: { width: 48, height: 48, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  moduleTitle: { fontSize: 15, fontWeight: '800', flex: 1 },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagBadgeText: { fontSize: 10, fontWeight: '800' },
  moduleDesc: { fontSize: 12, lineHeight: 16 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoCardText: { flex: 1, fontSize: 12, lineHeight: 17 },
  button: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.floPink, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  genderHeading: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  genderHint: { fontSize: 12, lineHeight: 17, marginBottom: 10 },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  genderChipText: { fontSize: 13, fontWeight: '700' },
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { BrandLogo } from '@/src/components/BrandLogo';
import { getPostAuthRoute } from '@/src/utils/routing';

export const ONBOARDING_SEEN_KEY = '@pusena_intro_seen_v1';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlideItem {
  id: string;
  tag: string;
  tagEn: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  emoji: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgLight: string;
  bgDark: string;
  features: { tr: string; en: string }[];
}

const SLIDES: SlideItem[] = [
  {
    id: 'period',
    tag: 'Döngü & Doğurganlık',
    tagEn: 'Cycle & Fertility',
    title: 'Döngünü ve Sağlığını Takip Et',
    titleEn: 'Track Your Cycle & Health',
    desc: 'Regl günlerini, PMS dönemlerini, yumurtlama ve en verimli günlerini yapay zekâ tahminleriyle kolayca takip et.',
    descEn: 'Easily track periods, PMS, ovulation and fertile windows with smart AI predictions.',
    emoji: '🌸',
    icon: 'flower-outline',
    color: Colors.floPink,
    bgLight: '#FFF0F5',
    bgDark: '#2D1622',
    features: [
      { tr: 'Otomatik regl ve ovülasyon tahminleri', en: 'Smart period & ovulation forecasts' },
      { tr: 'Semptom, ruh hali ve vücut sinyalleri kaydı', en: 'Log symptoms, moods and daily signals' },
      { tr: 'Dönem öncesi nazik hatırlatıcı bildirimler', en: 'Timely and gentle cycle reminders' },
    ],
  },
  {
    id: 'pregnancy',
    tag: 'Gebelik & Anne-Bebek',
    tagEn: 'Pregnancy & Baby',
    title: 'Bebeğinin Gelişimine Eşlik Et',
    titleEn: 'Follow Your Baby’s Growth',
    desc: 'Hafta hafta bebeğinin büyümesini, tekme sayacını, kasılma takibini ve aşı randevularını tek bir yerden yönet.',
    descEn: 'Follow week-by-week baby growth, kick counters, contraction timers, and vaccine schedules in one place.',
    emoji: '🤰',
    icon: 'heart-circle-outline',
    color: Colors.pregnancy,
    bgLight: '#FFF9ED',
    bgDark: '#2C2014',
    features: [
      { tr: 'Haftalık meyve ve boyut karşılaştırmaları', en: 'Weekly fruit and size comparisons' },
      { tr: 'Tekme sayacı ve kasılma zamanlayıcıları', en: 'Kick counter and contraction timers' },
      { tr: 'Bebek aşı takvimi ve sağlık hatırlatıcıları', en: 'Vaccine calendar & doctor reminders' },
    ],
  },
  {
    id: 'relationship',
    tag: 'Çift Senkronizasyonu',
    tagEn: 'Couple Sync',
    title: 'Partnerinle Tek Yürek Ol',
    titleEn: 'Stay in Sync with Your Partner',
    desc: 'Özel çift kodunuzla eşleşin; döngü durumunuzu paylaşın, her gün sürpriz soruları cevaplayın ve birlikte anılar biriktirin.',
    descEn: 'Pair with your private couple code; share cycle info, answer daily intimacy questions, and build memories together.',
    emoji: '💑',
    icon: 'people-outline',
    color: Colors.relationship,
    bgLight: '#FFF0F4',
    bgDark: '#2D1724',
    features: [
      { tr: 'Ortak takvim ve döngü ruh hali paylaşımı', en: 'Shared calendar and mood syncing' },
      { tr: 'Her gün sürpriz ve romantik çift soruları', en: 'Daily romantic and fun couple questions' },
      { tr: 'Karşılıklı güvenli anlık konum paylaşımı', en: 'Optional mutual live location sharing' },
    ],
  },
  {
    id: 'ai',
    tag: 'Yapay Zekâ Asistanı',
    tagEn: 'AI Health Guide',
    title: '7/24 Pusena AI Sağlık Rehberin',
    titleEn: 'Your 24/7 AI Health Guide',
    desc: 'Merak ettiğin sağlık ve gebelik sorularını sor, döngün ve beslenmen hakkında bilimsel tabanlı rehberlik al, doktorun için PDF raporu hazırla.',
    descEn: 'Ask women’s health & pregnancy questions anytime, get science-backed guidance, and generate doctor PDF summaries.',
    emoji: '✨',
    icon: 'sparkles-outline',
    color: Colors.floPurple,
    bgLight: '#F5EEFF',
    bgDark: '#20162D',
    features: [
      { tr: 'Kişiselleştirilmiş kadın sağlığı soru-cevap asistanı', en: 'Personalized women’s health assistant' },
      { tr: 'Doktor muayenesi için tek tıkla PDF sağlık raporu', en: 'One-tap PDF doctor health summary' },
      { tr: '%100 gizli, güvenli ve şifreli veri koruması', en: '100% private and encrypted data security' },
    ],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideItem>>(null);

  // If already authenticated, redirect straight to their destination
  if (isAuthenticated) {
    return <Redirect href={getPostAuthRoute(user)} />;
  }

  const isEn = language === 'en';
  const isLastSlide = currentIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[currentIndex];

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
    } catch {}
    router.replace('/auth/login');
  };

  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
    } else {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < SLIDES.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.brandRow}>
          <BrandLogo size={34} />
          <Text style={[styles.brandName, { color: colors.text }]}>Pusena</Text>
        </View>

        {!isLastSlide ? (
          <Pressable
            style={({ pressed }) => [styles.skipBtn, { opacity: pressed ? 0.6 : 1 }]}
            onPress={handleFinish}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isEn ? 'Skip' : 'Atla'}
          >
            <Text style={[styles.skipText, { color: colors.textMuted }]}>
              {isEn ? 'Skip' : 'Atla'}
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* Slides FlatList */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => {
          const cardBg = isDark ? item.bgDark : item.bgLight;
          return (
            <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
              {/* Visual Card / Illustration Container */}
              <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor: item.color + '25' }]}>
                <View style={[styles.heroIconCircle, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.heroEmoji}>{item.emoji}</Text>
                </View>

                {/* Badge Tag */}
                <View style={[styles.badge, { backgroundColor: item.color + '22' }]}>
                  <Ionicons name={item.icon} size={15} color={item.color} style={{ marginRight: 6 }} />
                  <Text style={[styles.badgeText, { color: item.color }]}>
                    {isEn ? item.tagEn : item.tag}
                  </Text>
                </View>

                {/* Feature Highlights List */}
                <View style={styles.featureList}>
                  {item.features.map((feat, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <View style={[styles.checkDot, { backgroundColor: item.color }]}>
                        <Ionicons name="checkmark" size={12} color="#FFF" />
                      </View>
                      <Text style={[styles.featureText, { color: colors.text }]}>
                        {isEn ? feat.en : feat.tr}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Text Info */}
              <View style={styles.textContainer}>
                <Text style={[styles.slideTitle, { color: colors.text }]}>
                  {isEn ? item.titleEn : item.title}
                </Text>
                <Text style={[styles.slideDesc, { color: colors.textMuted }]}>
                  {isEn ? item.descEn : item.desc}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Controls */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((s, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={s.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? currentSlide.color : isDark ? '#3D2D42' : '#E5E7EB',
                    width: isActive ? 24 : 8,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: currentSlide.color, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={handleNext}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>
            {isLastSlide
              ? isEn
                ? 'Get Started'
                : 'Hemen Başla'
              : isEn
              ? 'Continue'
              : 'Devam Et'}
          </Text>
          <Ionicons
            name={isLastSlide ? 'checkmark-circle' : 'arrow-forward'}
            size={20}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroIconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroEmoji: {
    fontSize: 48,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 19,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  slideDesc: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  bottomBar: {
    paddingHorizontal: 24,
    gap: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

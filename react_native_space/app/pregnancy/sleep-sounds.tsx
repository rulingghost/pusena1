import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';

interface SoundItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
}

const SOUNDS: SoundItem[] = [
  { id: '1', name: 'Anne Karnı Ritmi', category: 'Rahim İçi', icon: 'heart', color: Colors.floPink, description: 'Bebeklerin anne karnında duyduğu güven verici kalp atışı ve kan akış sesi.' },
  { id: '2', name: 'Fön Makinesi', category: 'Beyaz Gürültü', icon: 'flash', color: '#F59E0B', description: 'Kolik bebekleri anında sakinleştiren sürekli ve monoton frekans.' },
  { id: '3', name: 'Elektrik Süpürgesi', category: 'Beyaz Gürültü', icon: 'power', color: '#6366F1', description: 'Dış sesleri izole ederek derin uykuya geçişi kolaylaştırır.' },
  { id: '4', name: 'Gece Yağmuru', category: 'Doğa Sesleri', icon: 'rainy', color: '#0284C7', description: 'Cama vuran hafif ve dinlendirici yağmur damlaları.' },
  { id: '5', name: 'Okyanus Dalgaları', category: 'Doğa Sesleri', icon: 'water', color: Colors.floTeal, description: 'Ritmik kumsal dalgaları ile bebek ve anne için sakinleştirici ortam.' },
  { id: '6', name: 'Dandini Dandini Dastana', category: 'Ninni', icon: 'musical-notes', color: Colors.floPurple, description: 'Klasik Türk ninnisi ezgisiyle huzurlu uyku.' },
];

export default function SleepSoundsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [timerMinutes, setTimerMinutes] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = (id: string) => {
    if (activeSoundId === id && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveSoundId(id);
      setIsPlaying(true);
    }
  };

  const activeSound = SOUNDS.find((s) => s.id === activeSoundId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Beyaz Gürültü & Ninniler 🌙</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Kolik ve Rahat Uyku Sesleri</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Night Sleep Hero Banner */}
        <View style={styles.heroBannerWrap}>
          <Image source={AppImages.peacefulNightSleep} style={styles.heroBannerImg} resizeMode="cover" />
          <View style={styles.heroBannerOverlay}>
            <Ionicons name="moon" size={18} color="#FEF08A" />
            <Text style={styles.heroBannerText}>Huzurlu Gece & Uyku Vahası</Text>
          </View>
        </View>
        {/* Active Player Card */}
        {activeSound && (
          <View style={[styles.playerCard, { backgroundColor: isDark ? '#2D1F32' : '#F5F3FF', borderColor: activeSound.color + '40' }]}>
            <View style={[styles.playerIconCircle, { backgroundColor: activeSound.color }]}>
              <Ionicons name={activeSound.icon as any} size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.playerName, { color: colors.text }]}>{activeSound.name}</Text>
            <Text style={[styles.playerSub, { color: colors.textSecondary }]}>{activeSound.category} • {isPlaying ? 'Çalıyor...' : 'Duraklatıldı'}</Text>

            {/* Timer Options */}
            <View style={styles.timerRow}>
              {[15, 30, 45, 60].map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.timerChip,
                    { backgroundColor: timerMinutes === m ? activeSound.color : isDark ? '#3D2032' : '#FFFFFF' },
                  ]}
                  onPress={() => setTimerMinutes(m)}
                >
                  <Text style={[styles.timerChipText, { color: timerMinutes === m ? '#FFFFFF' : colors.text }]}>{m} dk</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.playControlBtn, { backgroundColor: activeSound.color }]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FFFFFF" />
              <Text style={styles.playControlText}>{isPlaying ? 'Sesi Durdur' : 'Oynat'}</Text>
            </Pressable>
          </View>
        )}

        {/* Sounds Grid */}
        <Text style={[styles.gridTitle, { color: colors.text }]}>Tüm Rahatlatıcı Sesler</Text>
        <View style={styles.grid}>
          {SOUNDS.map((sound) => {
            const isSel = activeSoundId === sound.id;
            return (
              <Pressable
                key={sound.id}
                style={[
                  styles.soundCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSel ? sound.color : colors.border,
                  },
                ]}
                onPress={() => toggleSound(sound.id)}
              >
                <View style={[styles.soundIconBox, { backgroundColor: sound.color + '15' }]}>
                  <Ionicons name={sound.icon as any} size={26} color={sound.color} />
                </View>
                <Text style={[styles.soundTitle, { color: colors.text }]}>{sound.name}</Text>
                <Text style={[styles.soundCategory, { color: sound.color }]}>{sound.category}</Text>
                <Text style={[styles.soundDesc, { color: colors.textSecondary }]}>{sound.description}</Text>

                <View style={[styles.playPill, { backgroundColor: isSel && isPlaying ? sound.color : sound.color + '15' }]}>
                  <Ionicons
                    name={isSel && isPlaying ? 'pause' : 'play'}
                    size={14}
                    color={isSel && isPlaying ? '#FFFFFF' : sound.color}
                  />
                  <Text style={[styles.playPillText, { color: isSel && isPlaying ? '#FFFFFF' : sound.color }]}>
                    {isSel && isPlaying ? 'Çalıyor' : 'Dinle'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroBannerWrap: { width: '100%', height: 130, borderRadius: 20, overflow: 'hidden', marginVertical: 10, position: 'relative' },
  heroBannerImg: { width: '100%', height: '100%' },
  heroBannerOverlay: { position: 'absolute', bottom: 10, left: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  heroBannerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  playerCard: { padding: 20, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginVertical: 12 },
  playerIconCircle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  playerName: { fontSize: 20, fontWeight: '800' },
  playerSub: { fontSize: 12.5, marginTop: 2, marginBottom: 14 },
  timerRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  timerChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  timerChipText: { fontSize: 12, fontWeight: '700' },
  playControlBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  playControlText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  gridTitle: { fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 12 },
  grid: { gap: 12 },
  soundCard: { padding: 16, borderRadius: 20, borderWidth: 1.5 },
  soundIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  soundTitle: { fontSize: 16, fontWeight: '800' },
  soundCategory: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginTop: 2, marginBottom: 6 },
  soundDesc: { fontSize: 12.5, lineHeight: 17, marginBottom: 12 },
  playPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start' },
  playPillText: { fontSize: 12, fontWeight: '800' },
});

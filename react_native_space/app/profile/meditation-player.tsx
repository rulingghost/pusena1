import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';

interface MeditationTrack {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  color: string;
}

const TRACKS: MeditationTrack[] = [
  { id: '1', title: 'Pozitif Doğum Telkinleri & Güven', category: 'Doğum Hazırlığı', duration: '12 Dk', description: 'Bedeninizin doğurma gücüne güven duymanızı sağlayan sakinleştirici hipnodil meditasyonu.', color: Colors.floPink },
  { id: '2', title: 'Derin Uykuya Geçiş & Beden Taraması', category: 'Uyku & Rahatlama', duration: '18 Dk', description: 'Ayak parmaklarından baş ucuna kadar tüm kasları gevşeten derin uyku rehberliği.', color: Colors.floPurple },
  { id: '3', title: 'PMS & Ağrı Yönetimi Nefesi', category: 'Döngü & Kramplar', duration: '10 Dk', description: 'Kasık ve bel bölgesindeki gerginliği serbest bırakan rahatlatıcı sesli seans.', color: Colors.floTeal },
  { id: '4', title: 'Bebeğimle Bağ Kurma & Kalp Bağı', category: 'Anne & Bebek', duration: '15 Dk', description: 'Bebeğinizi karnınızda hissederken sevgi enerjisini ileten duygusal meditasyon.', color: '#0284C7' },
];

export default function MeditationPlayerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [activeId, setActiveId] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(120);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgressSec((p) => p + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeTrack = TRACKS.find((t) => t.id === activeId) || TRACKS[0];

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Sesli Meditasyon & Rahatlama 🎧</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Uzman Terapist Rehberliğinde Seanslar</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Audio Player Card */}
        <View style={[styles.playerCard, { backgroundColor: isDark ? '#2D1F32' : '#F5F3FF', borderColor: activeTrack.color + '40' }]}>
          <View style={[styles.albumCover, { backgroundColor: activeTrack.color }]}>
            <Ionicons name="leaf" size={44} color="#FFFFFF" />
          </View>

          <Text style={[styles.trackTitle, { color: colors.text }]}>{activeTrack.title}</Text>
          <Text style={[styles.trackCat, { color: activeTrack.color }]}>{activeTrack.category}</Text>
          <Text style={[styles.trackDesc, { color: colors.textSecondary }]}>{activeTrack.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progWrap}>
            <View style={[styles.barTrack, { backgroundColor: '#00000010' }]}>
              <View style={[styles.barFill, { width: '35%', backgroundColor: activeTrack.color }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: colors.textMuted }]}>{formatSec(progressSec)}</Text>
              <Text style={[styles.timeText, { color: colors.textMuted }]}>{activeTrack.duration}</Text>
            </View>
          </View>

          {/* Play/Pause Button */}
          <Pressable
            style={[styles.playBtn, { backgroundColor: activeTrack.color }]}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FFFFFF" />
            <Text style={styles.playBtnText}>{isPlaying ? 'Duraklat' : 'Meditasyonu Başlat'}</Text>
          </Pressable>
        </View>

        {/* Tracks List */}
        <Text style={[styles.listHeader, { color: colors.text }]}>Tüm Rehberli Meditasyonlar</Text>
        <View style={styles.trackList}>
          {TRACKS.map((t) => {
            const isSel = t.id === activeId;
            return (
              <Pressable
                key={t.id}
                style={[
                  styles.trackCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSel ? t.color : colors.border,
                  },
                ]}
                onPress={() => {
                  setActiveId(t.id);
                  setIsPlaying(true);
                  setProgressSec(0);
                }}
              >
                <View style={[styles.trackIconBox, { backgroundColor: t.color + '15' }]}>
                  <Ionicons name={isSel && isPlaying ? 'pause' : 'play'} size={20} color={t.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tTitle, { color: colors.text }]}>{t.title}</Text>
                  <Text style={[styles.tSub, { color: colors.textMuted }]}>{t.category} • {t.duration}</Text>
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
  playerCard: { padding: 22, borderRadius: 26, borderWidth: 1, alignItems: 'center', marginVertical: 12 },
  albumCover: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  trackTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  trackCat: { fontSize: 12, fontWeight: '800', marginTop: 4, marginBottom: 8 },
  trackDesc: { fontSize: 13, lineHeight: 18, textAlign: 'center', marginBottom: 16 },
  progWrap: { width: '100%', marginBottom: 16 },
  barTrack: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timeText: { fontSize: 11, fontWeight: '600' },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 18 },
  playBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  listHeader: { fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 12 },
  trackList: { gap: 10 },
  trackCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1.5 },
  trackIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  tTitle: { fontSize: 14, fontWeight: '800' },
  tSub: { fontSize: 11.5, marginTop: 2 },
});

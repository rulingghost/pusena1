import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface KickSession {
  id: string;
  date: string;
  count: number;
  durationMinutes: number;
}

export default function KickCounterScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [kickCount, setKickCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [history, setHistory] = useState<KickSession[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('kick_history').then((data) => {
      if (data) {
        try {
          setHistory(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleAddKick = () => {
    if (!isActive) {
      setIsActive(true);
    }
    const newCount = kickCount + 1;
    setKickCount(newCount);

    if (newCount >= 10) {
      setIsActive(false);
      const minutes = Math.max(1, Math.round(seconds / 60));
      const session: KickSession = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        count: 10,
        durationMinutes: minutes,
      };
      const updated = [session, ...history];
      setHistory(updated);
      AsyncStorage.setItem('kick_history', JSON.stringify(updated));

      Alert.alert(
        'Tebrikler! 🎉',
        `Bebeğiniz 10 hareketi ${minutes} dakikada tamamladı. Hareketleri harika görünüyor!`
      );
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setKickCount(0);
    setSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Tekme Sayacı 🦶</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>10 Hareket Kuralı Seansı</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6', borderColor: Colors.floPink + '30' }]}>
          <Ionicons name="bulb-outline" size={20} color={Colors.floPink} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Doktorlar 28. haftadan sonra günde 1 kez bebeğin 10 hareketini saymayı önerir. 10 harekete ulaşınca seans otomatik kaydedilir.
          </Text>
        </View>

        {/* Counter Circle Display */}
        <View style={styles.counterSection}>
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(seconds)}</Text>
          </View>

          <Pressable
            style={[styles.bigKickBtn, { backgroundColor: Colors.floPink }]}
            onPress={handleAddKick}
          >
            <Ionicons name="footsteps" size={48} color="#FFFFFF" />
            <Text style={styles.bigKickCount}>{kickCount} / 10</Text>
            <Text style={styles.bigKickLabel}>TEKMELE DOKUN</Text>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable style={[styles.resetBtn, { borderColor: colors.border }]} onPress={handleReset}>
              <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.resetText, { color: colors.textMuted }]}>Sıfırla</Text>
            </Pressable>
          </View>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>Geçmiş Seanslar</Text>
          {history.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="analytics-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz kaydedilmiş tekme seansı yok.</Text>
            </View>
          ) : (
            history.slice(0, 10).map((item) => (
              <View key={item.id} style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.checkCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="checkmark" size={16} color="#16A34A" />
                  </View>
                  <View>
                    <Text style={[styles.histDate, { color: colors.text }]}>{item.date}</Text>
                    <Text style={[styles.histSub, { color: colors.textMuted }]}>10 Hareket Tamamlandı</Text>
                  </View>
                </View>
                <View style={[styles.histPill, { backgroundColor: isDark ? '#3D2032' : '#FFF0F6' }]}>
                  <Text style={[styles.histPillText, { color: Colors.floPink }]}>{item.durationMinutes} Dk</Text>
                </View>
              </View>
            ))
          )}
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
  infoCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginVertical: 12 },
  infoText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  counterSection: { alignItems: 'center', marginVertical: 20 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  timerText: { fontSize: 16, fontWeight: '700' },
  bigKickBtn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.floPink, shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 8 },
    }),
  },
  bigKickCount: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginTop: 4 },
  bigKickLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginTop: 2, opacity: 0.9 },
  actionRow: { marginTop: 16 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  resetText: { fontSize: 12, fontWeight: '600' },
  historySection: { marginTop: 16 },
  historyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  emptyBox: { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 13 },
  historyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  checkCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  histDate: { fontSize: 14, fontWeight: '700' },
  histSub: { fontSize: 12, marginTop: 1 },
  histPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  histPillText: { fontSize: 12, fontWeight: '700' },
});

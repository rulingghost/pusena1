import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useQueryClient } from '@tanstack/react-query';
import { useSymptomsControllerGetTypes, useSymptomsControllerCreate } from '@/src/api/generated/api';
import { getSymptomInsights } from '@/src/utils/symptomInsights';
import { localDateKey } from '@/src/utils/dateOnly';

interface SymptomChipMeta {
  icon: string;
  bgColor?: string;
  iconColor?: string;
}

export default function SymptomsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: typesData, isLoading } = useSymptomsControllerGetTypes();
  const createMutation = useSymptomsControllerCreate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [waterLiters, setWaterLiters] = useState<number>(0);
  const [weightKg, setWeightKg] = useState<string>('60');
  const [bbtTemp, setBbtTemp] = useState<string>('36.5');
  const [dailyNote, setDailyNote] = useState<string>('');

  // Icon mapping for symptom types
  const getChipMeta = (name: string, category: string): SymptomChipMeta => {
    const n = name.toLowerCase();
    if (n.includes('yapmadım') || n.includes('akıntı yok')) return { icon: 'close-circle-outline', iconColor: '#9CA3AF' };
    if (n.includes('pozitif')) return { icon: 'checkmark-circle', iconColor: Colors.floTeal };
    if (n.includes('negatif')) return { icon: 'remove-circle-outline', iconColor: '#EF4444' };
    if (n.includes('korunmalı')) return { icon: 'lock-closed', iconColor: Colors.floPink };
    if (n.includes('korunmasız')) return { icon: 'lock-open', iconColor: '#F97316' };
    if (n.includes('oral') || n.includes('dudak')) return { icon: 'heart', iconColor: Colors.floPink };
    if (n.includes('mastürbasyon') || n.includes('dokunma')) return { icon: 'hand-left', iconColor: Colors.floPurple };
    if (n.includes('oyuncak')) return { icon: 'sparkles', iconColor: Colors.floPurple };
    if (n.includes('orgazm')) return { icon: 'flame', iconColor: '#E11D48' };
    if (n.includes('yüksek cinsel') || n.includes('yüksek')) return { icon: 'heart-circle', iconColor: Colors.floPink };
    if (n.includes('sakin')) return { icon: 'happy-outline', iconColor: '#F59E0B' };
    if (n.includes('mutlu')) return { icon: 'happy', iconColor: '#10B981' };
    if (n.includes('enerji')) return { icon: 'flash', iconColor: '#F59E0B' };
    if (n.includes('cıvıl')) return { icon: 'sunny', iconColor: '#EC4899' };
    if (n.includes('kramp') || n.includes('ağrı')) return { icon: 'radio-button-on', iconColor: '#EF4444' };
    if (n.includes('göğüs')) return { icon: 'ellipse', iconColor: Colors.floPink };
    if (n.includes('baş ağrısı')) return { icon: 'headset', iconColor: '#8B5CF6' };
    if (n.includes('kaygan') || n.includes('sulu') || n.includes('yumurta')) return { icon: 'water', iconColor: '#3B82F6' };
    if (n.includes('yoga') || n.includes('yürüyüş') || n.includes('koşu')) return { icon: 'fitness', iconColor: '#10B981' };
    if (n.includes('stres') || n.includes('endişe')) return { icon: 'sad-outline', iconColor: '#6B7280' };
    if (n.includes('meditasyon') || n.includes('nefes')) return { icon: 'leaf', iconColor: '#10B981' };
    if (n.includes('kegel')) return { icon: 'body', iconColor: Colors.floPurple };
    if (n.includes('ilaç')) return { icon: 'medical', iconColor: '#06B6D4' };
    return { icon: 'ellipse-outline', iconColor: Colors.floPink };
  };

  const toggleChip = (name: string) => {
    setSelectedChips(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const adjustDate = (days: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + days);
    setCurrentDate(next);
  };

  const handleSave = () => {
    const dateStr = localDateKey(currentDate);
    const symptoms = Array.from(selectedChips).map(type => ({
      type,
      severity: 1,
      notes: dailyNote || undefined,
    }));

    createMutation.mutate(
      { data: { date: dateStr, symptoms } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/symptoms'] });
          queryClient.invalidateQueries({ queryKey: ['/api/period/calendar'] });
          queryClient.invalidateQueries({ queryKey: ['/api/period/history'] });
          Alert.alert('Başarılı ✨', 'Günlük kayıt ve semptomlarınız kaydedildi.');
          router.back();
        },
        onError: () => Alert.alert('Hata', 'Kayıt yapılırken bir hata oluştu.'),
      }
    );
  };

  const isToday =
    currentDate.toDateString() === new Date().toDateString();

  const formattedDate = isToday
    ? 'Bugün'
    : currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

  const categories = typesData?.categories ?? [];
  const insights = getSymptomInsights(Array.from(selectedChips));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.dateNavigator}>
          <Pressable hitSlop={10} onPress={() => adjustDate(-1)}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.dateTitle, { color: colors.text }]}>{formattedDate}</Text>
            <Text style={[styles.cycleDaySub, { color: colors.textMuted }]}>
              Döngü günü: 8
            </Text>
          </View>
          <Pressable hitSlop={10} onPress={() => adjustDate(1)}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* Search Input */}
      <View style={[styles.searchBox, { backgroundColor: isDark ? colors.card : '#F3F4F6', borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Semptom, ruh hali veya aktivite ara..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Selected Chips Quick Bar */}
      {selectedChips.size > 0 && (
        <View style={styles.selectedBanner}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedScroll}>
            {Array.from(selectedChips).map(name => (
              <Pressable
                key={name}
                style={[styles.selectedPill, { backgroundColor: Colors.floPink }]}
                onPress={() => toggleChip(name)}
              >
                <Text style={styles.selectedPillText}>{name}</Text>
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {insights.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 8, gap: 8 }}>
          {insights.map((ins, i) => (
            <View key={i} style={[styles.insightCard, { backgroundColor: Colors.floTeal + '12', borderColor: Colors.floTeal + '25' }]}>
              <Text style={[styles.insightCardTitle, { color: Colors.floTeal }]}>💡 {ins.title} — Neden oluyor?</Text>
              <Text style={[styles.insightCardBody, { color: colors.textSecondary }]}>{ins.explanation}</Text>
              {ins.tip ? <Text style={[styles.insightCardTip, { color: colors.textMuted }]}>Öneri: {ins.tip}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* Categories & Chips Scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Water, Weight & BBT Tracker Cards */}
        <View style={[styles.metricsContainer, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
          {/* Water Tracker */}
          <View style={styles.metricRow}>
            <View style={styles.metricLeft}>
              <View style={[styles.metricIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="water" size={20} color="#0284C7" />
              </View>
              <View>
                <Text style={[styles.metricTitle, { color: colors.text }]}>Su Tüketimi</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  {waterLiters.toFixed(2)} / 2.25 L
                </Text>
              </View>
            </View>

            <View style={styles.stepperRow}>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#3D2032' : '#F3F4F6' }]}
                onPress={() => setWaterLiters(prev => Math.max(0, parseFloat((prev - 0.25).toFixed(2))))}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </Pressable>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: Colors.floPinkLight }]}
                onPress={() => setWaterLiters(prev => parseFloat((prev + 0.25).toFixed(2)))}
              >
                <Ionicons name="add" size={18} color={Colors.floPink} />
              </Pressable>
            </View>
          </View>

          {/* Weight */}
          <View style={[styles.metricRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' }]}>
            <View style={styles.metricLeft}>
              <View style={[styles.metricIconBox, { backgroundColor: Colors.floPurpleLight }]}>
                <Ionicons name="speedometer-outline" size={20} color={Colors.floPurple} />
              </View>
              <View>
                <Text style={[styles.metricTitle, { color: colors.text }]}>Ağırlık</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>{weightKg} kg</Text>
              </View>
            </View>

            <View style={styles.stepperRow}>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#3D2032' : '#F3F4F6' }]}
                onPress={() => setWeightKg(prev => (parseFloat(prev) - 0.5).toFixed(1))}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </Pressable>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: Colors.floPurpleLight }]}
                onPress={() => setWeightKg(prev => (parseFloat(prev) + 0.5).toFixed(1))}
              >
                <Ionicons name="add" size={18} color={Colors.floPurple} />
              </Pressable>
            </View>
          </View>

          {/* BBT Temp */}
          <View style={[styles.metricRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' }]}>
            <View style={styles.metricLeft}>
              <View style={[styles.metricIconBox, { backgroundColor: Colors.floPinkLight }]}>
                <Ionicons name="thermometer-outline" size={20} color={Colors.floPink} />
              </View>
              <View>
                <Text style={[styles.metricTitle, { color: colors.text }]}>Bazal Vücut Sıcaklığı</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>{bbtTemp} °C</Text>
              </View>
            </View>

            <View style={styles.stepperRow}>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: isDark ? '#3D2032' : '#F3F4F6' }]}
                onPress={() => setBbtTemp(prev => (parseFloat(prev) - 0.1).toFixed(1))}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </Pressable>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: Colors.floPinkLight }]}
                onPress={() => setBbtTemp(prev => (parseFloat(prev) + 0.1).toFixed(1))}
              >
                <Ionicons name="add" size={18} color={Colors.floPink} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Daily Note Card */}
        <View style={[styles.notesCard, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.notesHeader}>
            <Ionicons name="document-text-outline" size={18} color={Colors.floPink} />
            <Text style={[styles.notesTitle, { color: colors.text }]}>Günlük Notlar</Text>
          </View>
          <TextInput
            style={[styles.noteInput, { color: colors.text }]}
            placeholder="Bugün nasıl hissettiğinizi veya ek belirtileri yazın..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={2}
            value={dailyNote}
            onChangeText={setDailyNote}
          />
        </View>

        {/* Category Sections with Chips */}
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.floPink} />
          </View>
        ) : (
          categories.map(cat => {
            const filteredTypes = (cat.types || []).filter(t =>
              searchQuery ? t.toLowerCase().includes(searchQuery.toLowerCase()) : true
            );
            if (filteredTypes.length === 0) return null;

            return (
              <View
                key={cat.name}
                style={[
                  styles.categoryCard,
                  { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border },
                ]}
              >
                <Text style={[styles.categoryHeading, { color: colors.text }]}>{cat.name}</Text>
                <View style={styles.chipsWrap}>
                  {filteredTypes.map(type => {
                    const isSelected = selectedChips.has(type);
                    const meta = getChipMeta(type, cat.name);
                    return (
                      <Pressable
                        key={type}
                        style={[
                          styles.chipPill,
                          {
                            backgroundColor: isSelected
                              ? Colors.floPink
                              : isDark
                              ? '#2D2030'
                              : '#F9F7F8',
                            borderColor: isSelected ? Colors.floPink : 'transparent',
                          },
                        ]}
                        onPress={() => toggleChip(type)}
                      >
                        <Ionicons
                          name={meta.icon as any}
                          size={16}
                          color={isSelected ? '#FFFFFF' : meta.iconColor || Colors.floPink}
                        />
                        <Text
                          style={[
                            styles.chipLabel,
                            {
                              color: isSelected ? '#FFFFFF' : colors.text,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Save Footer */}
      <View
        style={[
          styles.saveFooter,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <Pressable
          style={[styles.saveButton, { backgroundColor: Colors.floPink }]}
          onPress={handleSave}
          disabled={createMutation.isPending}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {createMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dateNavigator: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dateTitle: { fontSize: 17, fontWeight: '800' },
  cycleDaySub: { fontSize: 12, marginTop: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  selectedBanner: { paddingHorizontal: 20, marginBottom: 12 },
  selectedScroll: { gap: 8 },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedPillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20 },
  metricsContainer: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  metricLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metricIconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  metricTitle: { fontSize: 13, fontWeight: '600' },
  metricValue: { fontSize: 15, fontWeight: '800', marginTop: 1 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  notesCard: { padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  notesTitle: { fontSize: 14, fontWeight: '700' },
  noteInput: { fontSize: 13, minHeight: 40, padding: 0 },
  categoryCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  categoryHeading: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipLabel: { fontSize: 13 },
  loadingBox: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  saveFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  saveButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  insightCard: { padding: 14, borderRadius: 14, borderWidth: 1 },
  insightCardTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  insightCardBody: { fontSize: 12, lineHeight: 18 },
  insightCardTip: { fontSize: 11, marginTop: 6, fontStyle: 'italic' },
});

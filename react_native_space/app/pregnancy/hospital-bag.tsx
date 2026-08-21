import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePregnancyControllerGet, useRelationshipControllerGet } from '@/src/api/generated/api';
import { loadBabyProfile } from '@/src/data/babyProfile';
import {
  buildSuggestedBag,
  mergeBag,
  bagStageCopy,
  type BagItem,
  type BirthPlan,
} from '@/src/data/hospitalBag';

const STORE = 'hospital_bag_items';
const PLAN_KEY = 'hospital_bag_birth_plan';

export default function HospitalBagScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: pregnancy } = usePregnancyControllerGet({ query: { retry: false } });
  const { data: relationship } = useRelationshipControllerGet({ query: { retry: false } });

  const [activeTab, setActiveTab] = useState<'all' | 'mom' | 'baby' | 'partner'>('all');
  const [items, setItems] = useState<BagItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<'mom' | 'baby' | 'partner'>('mom');
  const [birthPlan, setBirthPlan] = useState<BirthPlan>('unknown');
  const [week, setWeek] = useState<number | null>(null);

  const rebuild = useCallback(async (plan: BirthPlan) => {
    const preg = pregnancy as any;
    const w = typeof preg?.currentWeek === 'number' ? preg.currentWeek : null;
    setWeek(w);
    const due = preg?.dueDate ? new Date(preg.dueDate) : null;
    const baby = await loadBabyProfile();
    const suggested = buildSuggestedBag({
      week: w,
      dueMonth: due && !Number.isNaN(due.getTime()) ? due.getMonth() : null,
      babySex: baby.sex,
      hasPartner: !!(relationship as any)?.partnerName,
      birthPlan: plan,
    });
    const raw = await AsyncStorage.getItem(STORE);
    let saved: BagItem[] = [];
    if (raw) {
      try { saved = JSON.parse(raw); } catch {}
    }
    const merged = mergeBag(saved, suggested);
    setItems(merged);
    await AsyncStorage.setItem(STORE, JSON.stringify(merged));
  }, [pregnancy, relationship]);

  useEffect(() => {
    AsyncStorage.getItem(PLAN_KEY).then((p) => {
      const plan = p === 'vaginal' || p === 'csection' ? p : 'unknown';
      setBirthPlan(plan);
      rebuild(plan);
    });
  }, [rebuild]);

  const saveItems = (updated: BagItem[]) => {
    setItems(updated);
    AsyncStorage.setItem(STORE, JSON.stringify(updated));
  };

  const setPlan = (plan: BirthPlan) => {
    setBirthPlan(plan);
    AsyncStorage.setItem(PLAN_KEY, plan);
    rebuild(plan);
  };

  const toggleItem = (id: string) => {
    saveItems(items.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)));
  };

  const addItem = () => {
    if (!newTitle.trim()) return;
    saveItems([
      { id: `c-${Date.now()}`, title: newTitle.trim(), category: newCat, completed: false, custom: true },
      ...items,
    ]);
    setNewTitle('');
  };

  const filtered = activeTab === 'all' ? items : items.filter((it) => it.category === activeTab);
  const totalCount = items.length;
  const completedCount = items.filter((it) => it.completed).length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Doğum çantası</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {completedCount} / {totalCount} · %{percent}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBagCard}>
          <Image source={AppImages.hospitalBagReady} style={styles.heroBagImg} resizeMode="cover" />
        </View>
        <Text style={[styles.stage, { color: colors.textSecondary }]}>{bagStageCopy(week)}</Text>

        <Text style={[styles.mini, { color: colors.textMuted }]}>Planlanan doğum (listeyi değiştirir)</Text>
        <View style={styles.chipRow}>
          {([
            ['unknown', 'Belirsiz'],
            ['vaginal', 'Vajinal'],
            ['csection', 'Sezaryen'],
          ] as const).map(([id, label]) => (
            <Pressable
              key={id}
              onPress={() => setPlan(id)}
              style={[styles.chip, { backgroundColor: birthPlan === id ? Colors.floPink : isDark ? colors.card : '#F3F4F6' }]}
            >
              <Text style={{ color: birthPlan === id ? '#fff' : colors.text, fontWeight: '700', fontSize: 12 }}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progTop}>
            <Text style={[styles.progLabel, { color: colors.text }]}>Hazırlık</Text>
            <Text style={[styles.progValue, { color: Colors.floPink }]}>%{percent}</Text>
          </View>
          <View style={[styles.barTrack, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}>
            <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: Colors.floPink }]} />
          </View>
        </View>

        <View style={styles.tabRow}>
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'mom', label: 'Anne' },
            { key: 'baby', label: 'Bebek' },
            { key: 'partner', label: 'Partner' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabChip, { backgroundColor: isActive ? Colors.floPink : isDark ? colors.card : '#F3F4F6' }]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text style={[styles.tabText, { color: isActive ? '#FFFFFF' : colors.text }]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.addBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.addInput, { color: colors.text }]}
            placeholder="Kendi maddenizi ekleyin"
            placeholderTextColor={colors.textMuted}
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <View style={styles.addActions}>
            <View style={styles.catSelectors}>
              {(['mom', 'baby', 'partner'] as const).map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.catSmallBtn, { backgroundColor: newCat === cat ? Colors.floPurple : isDark ? '#2D2030' : '#F3F4F6' }]}
                  onPress={() => setNewCat(cat)}
                >
                  <Text style={[styles.catSmallText, { color: newCat === cat ? '#FFFFFF' : colors.textMuted }]}>
                    {cat === 'mom' ? 'Anne' : cat === 'baby' ? 'Bebek' : 'Partner'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={[styles.addBtn, { backgroundColor: Colors.floPink }]} onPress={addItem}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.itemsWrap}>
          {filtered.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }, item.completed && { opacity: 0.7 }]}
              onPress={() => toggleItem(item.id)}
            >
              <Ionicons name={item.completed ? 'checkbox' : 'square-outline'} size={24} color={item.completed ? Colors.floPink : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.itemTitle,
                    { color: colors.text },
                    item.completed && { textDecorationLine: 'line-through', color: colors.textMuted },
                  ]}
                >
                  {item.title}
                </Text>
                {!!item.hint && <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{item.hint}</Text>}
              </View>
              <Pressable onPress={() => saveItems(items.filter((it) => it.id !== item.id))} hitSlop={8} style={{ padding: 4 }}>
                <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
              </Pressable>
            </Pressable>
          ))}
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
  heroBagCard: { width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', marginVertical: 10 },
  heroBagImg: { width: '100%', height: '100%' },
  stage: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  mini: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  progressCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginVertical: 8 },
  progTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progLabel: { fontSize: 14, fontWeight: '700' },
  progValue: { fontSize: 16, fontWeight: '900' },
  barTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  tabRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  tabChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  tabText: { fontSize: 12, fontWeight: '700' },
  addBox: { padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  addInput: { fontSize: 14, paddingVertical: 6 },
  addActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  catSelectors: { flexDirection: 'row', gap: 6 },
  catSmallBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  catSmallText: { fontSize: 11, fontWeight: '700' },
  addBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  itemsWrap: { gap: 8 },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  itemTitle: { fontSize: 14, lineHeight: 20 },
});

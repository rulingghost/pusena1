import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { customFetch } from '@/src/api/customFetch';
import { useQuery } from '@tanstack/react-query';

interface FaqItem {
  id: string;
  category: string;
  categoryName: string;
  question: string;
  answer: string;
  doctor: string;
}

interface MythItem {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export default function FaqScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [mainTab, setMainTab] = useState<'faq' | 'myths'>('faq');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const { data: faqData, isLoading: isFaqLoading } = useQuery<{ items: FaqItem[]; categories: { id: string; name: string }[] }>({
    queryKey: ['faqs', selectedCategory, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (search.trim()) params.append('search', search.trim());
      return customFetch(`/api/articles/faqs?${params.toString()}`);
    },
  });

  const { data: mythData, isLoading: isMythLoading } = useQuery<{ items: MythItem[] }>({
    queryKey: ['myths'],
    queryFn: () => customFetch('/api/articles/myths'),
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Uzman SSS & Mitler 📚</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Kadın Hastalıkları ve Doğum Uzmanları Yanıtlıyor</Text>
        </View>
      </View>

      {/* Main Switcher: SSS vs Mitler */}
      <View style={styles.mainSwitcher}>
        <Pressable
          style={[
            styles.switchBtn,
            { backgroundColor: mainTab === 'faq' ? Colors.floPink : isDark ? colors.card : '#F3F4F6' },
          ]}
          onPress={() => setMainTab('faq')}
        >
          <Ionicons name="help-circle" size={16} color={mainTab === 'faq' ? '#FFFFFF' : colors.text} />
          <Text style={[styles.switchText, { color: mainTab === 'faq' ? '#FFFFFF' : colors.text }]}>Sıkça Sorulan Sorular</Text>
        </Pressable>
        <Pressable
          style={[
            styles.switchBtn,
            { backgroundColor: mainTab === 'myths' ? Colors.floPurple : isDark ? colors.card : '#F3F4F6' },
          ]}
          onPress={() => setMainTab('myths')}
        >
          <Ionicons name="bulb" size={16} color={mainTab === 'myths' ? '#FFFFFF' : colors.text} />
          <Text style={[styles.switchText, { color: mainTab === 'myths' ? '#FFFFFF' : colors.text }]}>Mitler & Gerçekler</Text>
        </Pressable>
      </View>

      {mainTab === 'faq' ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: isDark ? colors.card : '#F3F4F6', borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Sorularda ara (örn. lekelenme, bulantı, folik asit...)"
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Category Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {(faqData?.categories || [
              { id: 'all', name: 'Tümü' },
              { id: 'pregnancy', name: 'Hamilelik & Doğum' },
              { id: 'fertility', name: 'Gebe Kalma & Ovülasyon' },
              { id: 'cycle', name: 'Döngü & Regl' },
              { id: 'wellness', name: 'Beslenme & Vitaminler' },
            ]).map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.catChip,
                    { backgroundColor: isActive ? Colors.floPink : isDark ? colors.card : '#F3F4F6' },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={[styles.catChipText, { color: isActive ? '#FFFFFF' : colors.text }]}>{cat.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Accordion Questions */}
          {isFaqLoading ? (
            <ActivityIndicator size="large" color={Colors.floPink} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.faqList}>
              {(faqData?.items || []).map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <View key={faq.id} style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Pressable style={styles.faqQuestionRow} onPress={() => toggleExpand(faq.id)}>
                      <Text style={[styles.faqQuestionText, { color: colors.text }]}>{faq.question}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={isExpanded ? Colors.floPink : colors.textMuted}
                      />
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.faqAnswerWrap}>
                        <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>{faq.answer}</Text>
                        <View style={[styles.doctorBadge, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight }]}>
                          <Ionicons name="shield-checkmark" size={14} color={Colors.floTeal} />
                          <Text style={[styles.doctorText, { color: Colors.floTeal }]}>{faq.doctor}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Mythbusters intro */}
          <View style={[styles.mythIntro, { backgroundColor: isDark ? '#2D1F32' : '#F5F3FF', borderColor: Colors.floPurple + '30' }]}>
            <Ionicons name="sparkles" size={24} color={Colors.floPurple} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.mythIntroTitle, { color: Colors.floPurple }]}>Bilimsel Gerçekler</Text>
              <Text style={[styles.mythIntroDesc, { color: colors.textSecondary }]}>
                Kadın sağlığı ve hamilelik hakkında toplumda doğru bilinen yanlışları uzman hekimlerle inceleyin.
              </Text>
            </View>
          </View>

          {/* Myth Cards */}
          <View style={styles.mythList}>
            {(mythData?.items || []).map((myth) => (
              <View key={myth.id} style={[styles.mythCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.mythTop}>
                  <View
                    style={[
                      styles.verdictBadge,
                      { backgroundColor: myth.isTrue ? '#DCFCE7' : '#FEE2E2' },
                    ]}
                  >
                    <Ionicons
                      name={myth.isTrue ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={myth.isTrue ? '#16A34A' : '#DC2626'}
                    />
                    <Text style={[styles.verdictText, { color: myth.isTrue ? '#16A34A' : '#DC2626' }]}>
                      {myth.isTrue ? 'DOĞRU' : 'YANLIŞ'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.mythStatement, { color: colors.text }]}>"{myth.statement}"</Text>
                <Text style={[styles.mythExp, { color: colors.textSecondary }]}>{myth.explanation}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  mainSwitcher: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginVertical: 8 },
  switchBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14 },
  switchText: { fontSize: 13, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 42, borderRadius: 14, borderWidth: 1, marginVertical: 8 },
  searchInput: { flex: 1, fontSize: 13 },
  catScroll: { gap: 6, paddingVertical: 6 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  catChipText: { fontSize: 12, fontWeight: '700' },
  faqList: { gap: 10, marginTop: 8 },
  faqCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  faqQuestionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  faqQuestionText: { flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 20, marginRight: 8 },
  faqAnswerWrap: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: '#00000008', paddingTop: 10 },
  faqAnswerText: { fontSize: 13, lineHeight: 19 },
  doctorBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', marginTop: 10 },
  doctorText: { fontSize: 11, fontWeight: '700' },
  mythIntro: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1, marginVertical: 12 },
  mythIntroTitle: { fontSize: 14, fontWeight: '800' },
  mythIntroDesc: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  mythList: { gap: 12 },
  mythCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  mythTop: { marginBottom: 8 },
  verdictBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  verdictText: { fontSize: 11, fontWeight: '900' },
  mythStatement: { fontSize: 15, fontWeight: '800', lineHeight: 20, marginBottom: 8 },
  mythExp: { fontSize: 13, lineHeight: 19 },
});

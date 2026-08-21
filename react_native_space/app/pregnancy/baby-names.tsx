import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, TextInput, StyleSheet, Alert, ActivityIndicator, Modal, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { customFetch } from '@/src/api/customFetch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BabyNameItem {
  id: string;
  name: string;
  gender: 'girl' | 'boy' | 'unisex';
  meaning: string;
  origin: string;
  isPopular: boolean;
}

const ALPHABET = ['TÜMÜ', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I', 'İ', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];

export default function BabyNamesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [genderFilter, setGenderFilter] = useState<'all' | 'girl' | 'boy' | 'unisex' | 'favorites'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('TÜMÜ');
  const [search, setSearch] = useState('');
  const [savingName, setSavingName] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [randomModalVisible, setRandomModalVisible] = useState(false);
  const [randomName, setRandomName] = useState<BabyNameItem | null>(null);

  // Load saved favorites
  useEffect(() => {
    AsyncStorage.getItem('favorite_baby_names').then((data) => {
      if (data) {
        try {
          setFavorites(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  const toggleFavorite = async (name: string) => {
    let updated: string[];
    if (favorites.includes(name)) {
      updated = favorites.filter((n) => n !== name);
    } else {
      updated = [...favorites, name];
    }
    setFavorites(updated);
    await AsyncStorage.setItem('favorite_baby_names', JSON.stringify(updated));
  };

  const { data, isLoading, refetch } = useQuery<{ items: BabyNameItem[]; total: number }>({
    queryKey: ['baby-names', genderFilter === 'favorites' ? 'all' : genderFilter, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (genderFilter !== 'all' && genderFilter !== 'favorites') params.append('gender', genderFilter);
      if (search.trim()) params.append('search', search.trim());
      return customFetch(`/api/pregnancy/baby-names?${params.toString()}`);
    },
  });

  const allItems = data?.items || [];
  
  // Filter by favorites and selected starting letter
  const filteredItems = allItems.filter((item) => {
    if (genderFilter === 'favorites' && !favorites.includes(item.name)) return false;
    if (selectedLetter !== 'TÜMÜ') {
      const firstChar = item.name.charAt(0).toLocaleUpperCase('tr-TR');
      if (firstChar !== selectedLetter) return false;
    }
    return true;
  });

  const handleSelectName = async (name: string) => {
    Alert.alert(
      'Bebek İsmi Belirle 🍼',
      `Bebeğinizin ismini "${name}" olarak kaydetmek istiyor musunuz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Seç',
          onPress: async () => {
            setSavingName(name);
            try {
              await customFetch('/api/pregnancy', {
                method: 'PUT',
                body: JSON.stringify({ babyName: name }),
              });
              await queryClient.invalidateQueries({ queryKey: ['/api/pregnancy'] });
              await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
              setRandomModalVisible(false);
              Alert.alert('Harika Bir Seçim! 🌸', `Bebeğinizin ismi "${name}" olarak kaydedildi.`);
            } catch {
              Alert.alert('Hata', 'İsim kaydedilemedi.');
            } finally {
              setSavingName(null);
            }
          },
        },
      ]
    );
  };

  const handlePickRandom = () => {
    if (filteredItems.length === 0) {
      Alert.alert('Uyarı', 'Seçili filtrelere uygun isim bulunamadı.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    setRandomName(filteredItems[randomIndex]);
    setRandomModalVisible(true);
  };

  const renderItem = ({ item }: { item: BabyNameItem }) => {
    const isGirl = item.gender === 'girl';
    const isBoy = item.gender === 'boy';
    const tagBg = isGirl ? '#FFF0F6' : isBoy ? '#EFF6FF' : '#F5F3FF';
    const tagColor = isGirl ? Colors.floPink : isBoy ? '#0284C7' : Colors.floPurple;
    const genderEmoji = isGirl ? '👧' : isBoy ? '👦' : '✨';
    const isFav = favorites.includes(item.name);

    return (
      <View style={[styles.nameCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.nameHeader}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.nameTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={{ fontSize: 16 }}>{genderEmoji}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
              <View style={[styles.pill, { backgroundColor: tagBg }]}>
                <Text style={[styles.pillText, { color: tagColor }]}>{item.origin}</Text>
              </View>
              {item.isPopular && (
                <View style={[styles.pill, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.pillText, { color: '#D97706' }]}>★ Popüler</Text>
                </View>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable onPress={() => toggleFavorite(item.name)} style={styles.favBtn} hitSlop={8}>
              <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? Colors.floPink : colors.textMuted} />
            </Pressable>

            <Pressable
              style={[styles.selectBtn, { backgroundColor: Colors.floPink + '15', borderColor: Colors.floPink + '30' }]}
              onPress={() => handleSelectName(item.name)}
              disabled={savingName === item.name}
            >
              {savingName === item.name ? (
                <ActivityIndicator size="small" color={Colors.floPink} />
              ) : (
                <Text style={[styles.selectBtnText, { color: Colors.floPink }]}>İsim Seç</Text>
              )}
            </Pressable>
          </View>
        </View>

        <Text style={[styles.nameMeaning, { color: colors.textSecondary }]}>{item.meaning}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Bebek İsimleri Sözlüğü 🍼</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{filteredItems.length} İsim ve Detaylı Anlamları</Text>
        </View>
        <Pressable style={[styles.randomWheelBtn, { backgroundColor: Colors.floPink }]} onPress={handlePickRandom}>
          <Ionicons name="shuffle" size={18} color="#FFFFFF" />
          <Text style={styles.randomWheelText}>Şans Çarkı</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.card : '#F3F4F6', borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="İsim veya anlam ara (örn. Zeynep, nehir, ay...)"
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
      </View>

      {/* Gender & Favorites Category Filter */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'girl', label: '👧 Kız' },
          { key: 'boy', label: '👦 Erkek' },
          { key: 'unisex', label: '✨ Uniseks' },
          { key: 'favorites', label: `❤️ Favoriler (${favorites.length})` },
        ].map((tab) => {
          const isActive = genderFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[
                styles.filterChip,
                { backgroundColor: isActive ? Colors.floPink : isDark ? colors.card : '#F3F4F6' },
              ]}
              onPress={() => setGenderFilter(tab.key as any)}
            >
              <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : colors.text }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Alphabet A-Z Bar */}
      <View style={styles.alphabetWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alphabetScroll}>
          {ALPHABET.map((letter) => {
            const isSelected = selectedLetter === letter;
            return (
              <Pressable
                key={letter}
                style={[
                  styles.letterChip,
                  { backgroundColor: isSelected ? Colors.floPurple : 'transparent', borderColor: isSelected ? Colors.floPurple : colors.border },
                ]}
                onPress={() => setSelectedLetter(letter)}
              >
                <Text style={[styles.letterChipText, { color: isSelected ? '#FFFFFF' : colors.text }]}>{letter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Names List */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.floPink} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>İsimler listeleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id || item.name}
          renderItem={renderItem}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="sparkles-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>İsim Bulunamadı</Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>Farklı bir arama veya harf filtresi deneyin.</Text>
            </View>
          }
        />
      )}

      {/* Random Name Modal */}
      <Modal visible={randomModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.randomCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.randomIconBox, { backgroundColor: Colors.floPinkLight }]}>
              <Ionicons name="gift" size={32} color={Colors.floPink} />
            </View>
            <Text style={[styles.randomCardTitle, { color: colors.textMuted }]}>GÜNÜN ŞANSLI İSİM ÖNERİSİ</Text>
            <Text style={[styles.randomNameText, { color: colors.text }]}>{randomName?.name}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 8 }}>
              <View style={[styles.pill, { backgroundColor: '#FFF0F6' }]}>
                <Text style={[styles.pillText, { color: Colors.floPink }]}>{randomName?.origin}</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.pillText, { color: '#0284C7' }]}>{randomName?.gender === 'girl' ? 'Kız' : randomName?.gender === 'boy' ? 'Erkek' : 'Uniseks'}</Text>
              </View>
            </View>
            <Text style={[styles.randomMeaningText, { color: colors.textSecondary }]}>{randomName?.meaning}</Text>

            <View style={styles.randomActions}>
              <Pressable style={[styles.randomSecondaryBtn, { borderColor: colors.border }]} onPress={handlePickRandom}>
                <Ionicons name="refresh" size={16} color={colors.text} />
                <Text style={[styles.randomSecondaryBtnText, { color: colors.text }]}>Başka İsim Bul</Text>
              </Pressable>

              <Pressable
                style={[styles.randomPrimaryBtn, { backgroundColor: Colors.floPink }]}
                onPress={() => randomName && handleSelectName(randomName.name)}
              >
                <Text style={styles.randomPrimaryBtnText}>Bu İsmi Seç 🌸</Text>
              </Pressable>
            </View>

            <Pressable style={styles.modalCloseBtn} onPress={() => setRandomModalVisible(false)}>
              <Ionicons name="close-circle" size={24} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  randomWheelBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  randomWheelText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 42, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 13 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  alphabetWrap: { borderBottomWidth: 1, borderBottomColor: '#00000010', paddingBottom: 8, marginBottom: 8 },
  alphabetScroll: { paddingHorizontal: 16, gap: 6 },
  letterChip: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  letterChipText: { fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 16, gap: 10 },
  nameCard: { padding: 14, borderRadius: 18, borderWidth: 1 },
  nameHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  nameTitle: { fontSize: 17, fontWeight: '800' },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pillText: { fontSize: 11, fontWeight: '700' },
  favBtn: { padding: 4 },
  selectBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  selectBtnText: { fontSize: 12, fontWeight: '700' },
  nameMeaning: { fontSize: 13, lineHeight: 18 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { fontSize: 13 },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 6 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  randomCard: { width: '100%', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, position: 'relative' },
  randomIconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  randomCardTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  randomNameText: { fontSize: 26, fontWeight: '900' },
  randomMeaningText: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginVertical: 12 },
  randomActions: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 8 },
  randomSecondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  randomSecondaryBtnText: { fontSize: 13, fontWeight: '700' },
  randomPrimaryBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 14 },
  randomPrimaryBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  modalCloseBtn: { position: 'absolute', top: 12, right: 12 },
});

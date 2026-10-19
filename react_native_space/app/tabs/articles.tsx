import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import { useAuth } from '@/src/contexts/AuthContext';
import { isMaleUser } from '@/src/utils/gender';
import { apiClient } from '@/src/api/client';
import { useSavedArticles, useToggleSavedArticle } from '@/src/api/bloomClient';
import { matchesTr } from '@/src/utils/text';

interface ArticleItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryName: string;
  author: string;
  authorTitle: string;
  readTime: string;
  hasAudio: boolean;
  audioDuration?: string;
  summary: string;
  content: string[];
  tags: string[];
  reviewedBy: string;
}

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Tümü' },
  { id: 'cycle', name: 'Döngü' },
  { id: 'pregnancy', name: 'Gebelik' },
  { id: 'fertility', name: 'Doğurganlık' },
  { id: 'wellness', name: 'Yaşam' },
  { id: 'mood', name: 'Ruh hali' },
];

const FALLBACK_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Foliküler Evrede Bedeninizde Neler Değişir?',
    subtitle: 'Foliküler evre regl ile başlar; östrojen yavaş yükselir',
    category: 'cycle',
    categoryName: 'Döngü & Hormonlar',
    author: 'Dr. Zeynep Kaya',
    authorTitle: 'Kadın Hastalıkları ve Doğum Uzmanı',
    readTime: '4 dk',
    hasAudio: true,
    audioDuration: '5:20',
    summary: 'Foliküler evre adetin ilk gününde başlar ve yumurtlamaya kadar sürer. Enerji artışı genelde kanama bittikten sonra hissedilir.',
    content: [
      'Foliküler evre, adetin 1. gününden yumurtlamaya kadar sürer. Regl bu evrenin dışına düşmez.',
      'FSH bir folikülün olgunlaşmasını sağlar. Kanama bittikten sonra östrojen daha belirgin yükselir.',
      'Birçok kişide enerji ve odaklanma toparlanır; bu bir kural değil, sık görülen bir eğilimdir.',
      'Yeşil yapraklılar ve protein yeterlidir. Tek bir besin döngüyü değiştirmez. Şikayetiniz varsa hekime danışın.',
    ],
    tags: ['Foliküler Evre', 'Östrojen', 'Enerji', 'Hormonlar'],
    reviewedBy: 'Tıp Kurulu Onaylı • Dr. Zeynep Kaya',
  },
  {
    id: 'art-2',
    title: 'Ovülasyon (Yumurtlama) Gününü Nasıl Anlarsınız?',
    subtitle: 'Servikal akıntı, bazal sıcaklık ve vücudun verdiği 5 temel sinyal',
    category: 'fertility',
    categoryName: 'Doğurganlık & Ovülasyon',
    author: 'Prof. Dr. Melis Erdem',
    authorTitle: 'Üreme Sağlığı ve Tüp Bebek Uzmanı',
    readTime: '5 dk',
    hasAudio: true,
    audioDuration: '6:10',
    summary: 'Doğurgan dönemin en kritik günü olan ovülasyonu yakalamanın bilimsel ve pratik yöntemleri.',
    content: [
      'Ovülasyon, olgunlaşan yumurtanın fallop tüpüne bırakılması olayıdır ve sperm ile buluşmak için yalnızca 12-24 saat canlı kalır.',
      'Servikal Mukus Değişimi: Yumurtlamaya yakın günlerde akıntı şeffaf, esnek ve çiğ yumurta akı kıvamına gelir. Bu yapı spermin rahim ağzından kolayca yüzmesini sağlar.',
      'Bazal Vücut Sıcaklığı (BBT): Yumurtlama gerçekleştiğinde progesteron salgısı nedeniyle vücut sıcaklığınız yaklaşık 0.3 - 0.5 °C yükselir.',
      'Hafif Kramp ve Hassasiyet (Mittelschmerz): Kadınların yaklaşık %40ı yumurtlama anında kasıkta tek taraflı hafif bir batma veya dolgunluk hisseder.'
    ],
    tags: ['Ovülasyon', 'Doğurganlık', 'Mukus', 'BBT'],
    reviewedBy: 'Tıp Kurulu Onaylı • Prof. Dr. Melis Erdem',
  },
  {
    id: 'art-3',
    title: 'Hamilelikte 1. Trimester: Bebeğinizin Organ Oluşumu',
    subtitle: 'İlk 12 haftada kalp atışı, sinir sistemi ve annenin adaptasyonu',
    category: 'pregnancy',
    categoryName: 'Hamilelik & Doğum',
    author: 'Op. Dr. Elif Arslan',
    authorTitle: 'Perinatoloji ve Yüksek Riskli Gebelik Uzmanı',
    readTime: '6 dk',
    hasAudio: true,
    audioDuration: '7:45',
    summary: 'Gebeliğin ilk 3 ayı bebeğin tüm hayati organlarının taslağının çizildiği en mucizevi ve hassas dönemdir.',
    content: [
      '5-6. haftalarda bebeğin minik kalbi atmaya başlar ve ultrasonla ilk kez duyulabilir.',
      'Folik Asit Önemi: Bebeğin beyin ve omurilik gelişimini (nöral tüp) tamamlaması için günlük 400 mcg folik asit aksatılmamalıdır.',
      'Sabah Bulantıları: HCG ve progesteron hormonlarının yükselmesiyle sabah bulantıları görülebilir. Az az, sık sık ve kuru beslenmek faydalıdır.'
    ],
    tags: ['Hamilelik', '1. Trimester', 'Bebek Gelişimi', 'Folik Asit'],
    reviewedBy: 'Tıp Kurulu Onaylı • Op. Dr. Elif Arslan',
  },
  {
    id: 'art-4',
    title: 'PMS ve Adet Kramplarını Doğal Yollarla Hafifletme',
    subtitle: 'Magnezyum, sıcak kompres ve bitkisel çayların gücü',
    category: 'wellness',
    categoryName: 'Beslenme & Yaşam',
    author: 'Uzm. Dyt. Selin Yılmaz',
    authorTitle: 'Fonksiyonel Tıp Diyetisyeni',
    readTime: '4 dk',
    hasAudio: false,
    summary: 'Adet öncesi gerginlik ve kasık ağrılarını ilaçsız dindirmenin bilimsel yolları.',
    content: [
      'Prostaglandin hormonunun rahim kaslarını kasması dismenoreye (adet sancısı) neden olur.',
      'Magnezyum takviyesi ve papatya çayı kas spazmlarını belirgin şekilde gevşetir.',
      'Alt karın bölgesine sıcak su torbası uygulamak kan dolaşımını hızlandırır ve ağrı kesici etkisi gösterir.'
    ],
    tags: ['PMS', 'Adet Sancısı', 'Magnezyum', 'Doğal Tedavi'],
    reviewedBy: 'Tıp Kurulu Onaylı • Uzm. Dyt. Selin Yılmaz',
  }
];

const MALE_HIDE_CATS = new Set(['cycle', 'pregnancy', 'conception', 'fertility']);

export default function ArticlesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const male = isMaleUser(user);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<ArticleItem[]>(FALLBACK_ARTICLES);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  const { data: savedArticlesData } = useSavedArticles();
  const toggleSavedArticle = useToggleSavedArticle();
  const bookmarked = new Set((savedArticlesData?.items ?? []).map((s) => s.articleId));

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<any>(`/api/articles?category=${selectedCat}&search=${encodeURIComponent(searchQuery)}`);
      const items = Array.isArray(res?.items) ? res.items : (Array.isArray(res?.data?.items) ? res.data.items : null);
      const cats = res?.categories || res?.data?.categories || [];

      if (items) {
        setArticles(male ? items.filter((a: ArticleItem) => !MALE_HIDE_CATS.has(a.category)) : items);
      } else {
        let filtered = FALLBACK_ARTICLES;
        if (male) filtered = filtered.filter(a => !MALE_HIDE_CATS.has(a.category));
        if (selectedCat !== 'all') {
          filtered = filtered.filter(a => a.category === selectedCat);
        }
        if (searchQuery.trim()) {
          filtered = filtered.filter(a => matchesTr(a.title, searchQuery) || matchesTr(a.subtitle, searchQuery));
        }
        setArticles(filtered);
      }
      if (cats.length > 0) {
        setCategories(male ? cats.filter((c: { id: string }) => c.id === 'all' || !MALE_HIDE_CATS.has(c.id)) : cats);
      }
    } catch (e) {
      console.warn('Makaleler yüklenemedi', e);
      let filtered = FALLBACK_ARTICLES;
      if (male) filtered = filtered.filter(a => !MALE_HIDE_CATS.has(a.category));
      if (selectedCat !== 'all') {
        filtered = filtered.filter(a => a.category === selectedCat);
      }
      if (searchQuery.trim()) {
        filtered = filtered.filter(a => matchesTr(a.title, searchQuery) || matchesTr(a.subtitle, searchQuery));
      }
      setArticles(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCat, searchQuery, male]);

  useEffect(() => {
    if (!male) return;
    setCategories((prev) => prev.filter((c) => c.id === 'all' || !MALE_HIDE_CATS.has(c.id)));
    if (MALE_HIDE_CATS.has(selectedCat)) setSelectedCat('all');
  }, [male]);

  const toggleBookmark = (id: string) => {
    toggleSavedArticle.mutate({ articleId: id, kind: 'article' });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'cycle':
        return Colors.floPink;
      case 'fertility':
        return Colors.floTeal;
      case 'pregnancy':
        return Colors.pregnancy;
      case 'mood':
        return Colors.floPurple;
      case 'fitness':
        return Colors.floGreen;
      default:
        return Colors.primary;
    }
  };

  const getArticleImage = (article?: ArticleItem) => {
    if (!article) return AppImages.bloomHeroBg;
    if (article.category === 'cycle') return AppImages.cycleHormoneFlow;
    if (article.category === 'pregnancy') return AppImages.babyFetusWomb;
    if (article.category === 'fertility') return AppImages.pregnancyNutritionPlate;
    if (article.category === 'fitness') return AppImages.prenatalYogaMom;
    if (article.category === 'mood') return AppImages.meditationZen;
    if (article.tags?.some(t => t.toLowerCase().includes('besin') || t.toLowerCase().includes('beslenme'))) return AppImages.pregnancyNutritionPlate;
    if (article.tags?.some(t => t.toLowerCase().includes('çay') || t.toLowerCase().includes('pcos'))) return AppImages.hormoneWellnessTea;
    return AppImages.bloomHeroBg;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Rehber</Text>
            <Text style={[styles.screenSubtitle, { color: colors.textMuted }]}>Kısa okumalar</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.card : '#F3F4F6', borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Makale, semptom veya konu ara..."
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

        {/* Category Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map(cat => {
            const isActive = selectedCat === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCat(cat.id)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isActive
                      ? Colors.floPink
                      : isDark
                      ? colors.card
                      : '#FFFFFF',
                    borderColor: isActive ? Colors.floPink : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catChipText,
                    {
                      color: isActive ? '#FFFFFF' : colors.text,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Resource Banners */}
        <View style={styles.quickResourceRow}>
          <Pressable
            style={[
              styles.quickResCard,
              { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6', borderColor: Colors.floPink + '30' },
            ]}
            onPress={() => router.push('/articles/faq' as any)}
          >
            <View style={[styles.quickResIcon, { backgroundColor: Colors.floPinkLight }]}>
              <Ionicons name="help-buoy" size={20} color={Colors.floPink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.quickResTitle, { color: colors.text }]}>SSS</Text>
              <Text style={[styles.quickResSub, { color: colors.textMuted }]}>Sık sorulanlar</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.floPink} />
          </Pressable>

          <Pressable
            style={[
              styles.quickResCard,
              { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' },
            ]}
            onPress={() => router.push('/period/fertility-guide' as any)}
          >
            <View style={[styles.quickResIcon, { backgroundColor: Colors.floTeal + '25' }]}>
              <Ionicons name="flower" size={20} color={Colors.floTeal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.quickResTitle, { color: colors.text }]}>Doğurganlık</Text>
              <Text style={[styles.quickResSub, { color: colors.textMuted }]}>Pencere ve evreler</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.floTeal} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.floPink} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Makaleler yükleniyor...
            </Text>
          </View>
        ) : articles.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Sonuç Bulunamadı</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Arama kriterlerinize uygun makale bulunamadı.
            </Text>
          </View>
        ) : (
          <>
            {/* Featured Article Card */}
            {articles[0] && (
              <Pressable
                style={[
                  styles.featuredCard,
                  {
                    backgroundColor: isDark ? colors.card : '#FFFFFF',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setActiveArticle(articles[0])}
              >
                <View style={styles.featuredBadgeRow}>
                  <View
                    style={[
                      styles.categoryTag,
                      { backgroundColor: getCategoryColor(articles[0].category) + '15' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryTagText,
                        { color: getCategoryColor(articles[0].category) },
                      ]}
                    >
                      {articles[0].categoryName}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.featuredTitle, { color: colors.text }]}>
                  {articles[0].title}
                </Text>
                <Text
                  style={[styles.featuredSubtitle, { color: colors.textMuted }]}
                  numberOfLines={2}
                >
                  {articles[0].subtitle}
                </Text>

                <View style={styles.featuredFooter}>
                  <View style={styles.authorRow}>
                    <View style={[styles.authorAvatar, { backgroundColor: Colors.floPinkLight }]}>
                      <Ionicons name="person" size={14} color={Colors.floPink} />
                    </View>
                    <View>
                      <Text style={[styles.authorName, { color: colors.text }]}>
                        {articles[0].author}
                      </Text>
                      <Text style={[styles.authorTitle, { color: colors.textMuted }]}>
                        {articles[0].readTime} okuma
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    hitSlop={12}
                    onPress={() => toggleBookmark(articles[0].id)}
                  >
                    <Ionicons
                      name={bookmarked.has(articles[0].id) ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={bookmarked.has(articles[0].id) ? Colors.floPink : colors.textMuted}
                    />
                  </Pressable>
                </View>
              </Pressable>
            )}

            {/* Other Articles List */}
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Makaleler</Text>
            {articles.slice(1).map(item => (
              <Pressable
                key={item.id}
                style={[
                  styles.articleCard,
                  {
                    backgroundColor: isDark ? colors.card : '#FFFFFF',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setActiveArticle(item)}
              >
                <View style={styles.articleCardBody}>
                  <View style={styles.articleTopRow}>
                    <Text
                      style={[
                        styles.articleCategory,
                        { color: getCategoryColor(item.category) },
                      ]}
                    >
                      {item.categoryName}
                    </Text>
                    <View style={styles.articleMetaRow}>
                      <Text style={[styles.articleReadTime, { color: colors.textMuted }]}>
                        {item.readTime}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.articleTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text
                    style={[styles.articleSummary, { color: colors.textMuted }]}
                    numberOfLines={2}
                  >
                    {item.summary}
                  </Text>

                  <View style={styles.articleFooter}>
                    <Text style={[styles.articleAuthor, { color: colors.textMuted }]}>
                      {item.author}
                    </Text>
                    <Pressable hitSlop={10} onPress={() => toggleBookmark(item.id)}>
                      <Ionicons
                        name={bookmarked.has(item.id) ? 'bookmark' : 'bookmark-outline'}
                        size={18}
                        color={bookmarked.has(item.id) ? Colors.floPink : colors.textMuted}
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Article Detail Reader Modal */}
      <Modal
        visible={activeArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveArticle(null)}
      >
        {activeArticle && (
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
              <Pressable
                onPress={() => setActiveArticle(null)}
                style={[styles.closeBtn, { backgroundColor: colors.card }]}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
              <View style={styles.modalHeaderActions}>
                <Pressable
                  onPress={() => toggleBookmark(activeArticle.id)}
                  style={[styles.modalActionBtn, { backgroundColor: colors.card }]}
                >
                  <Ionicons
                    name={bookmarked.has(activeArticle.id) ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={bookmarked.has(activeArticle.id) ? Colors.floPink : colors.text}
                  />
                </Pressable>
              </View>
            </View>

            {/* Modal Scroll Content */}
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Image source={getArticleImage(activeArticle)} style={styles.modalHeroImg} resizeMode="cover" />

              {/* Category & Badge */}
              <View style={styles.modalCategoryRow}>
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: getCategoryColor(activeArticle.category) + '15' },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryTagText,
                      { color: getCategoryColor(activeArticle.category) },
                    ]}
                  >
                    {activeArticle.categoryName}
                  </Text>
                </View>
                <Text style={[styles.modalReadTime, { color: colors.textMuted }]}>
                  {activeArticle.readTime} okuma
                </Text>
              </View>

              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {activeArticle.title}
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                {activeArticle.subtitle}
              </Text>

              {/* Author & Review Card */}
              <View
                style={[
                  styles.authorReviewCard,
                  { backgroundColor: isDark ? colors.card : '#F9F7F8', borderColor: colors.border },
                ]}
              >
                <View style={styles.authorDetailRow}>
                  <View style={[styles.authorAvatarLarge, { backgroundColor: Colors.floPinkLight }]}>
                    <Ionicons name="medkit" size={20} color={Colors.floPink} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalAuthorName, { color: colors.text }]}>
                      {activeArticle.author}
                    </Text>
                    <Text style={[styles.modalAuthorTitle, { color: colors.textMuted }]}>
                      {activeArticle.authorTitle}
                    </Text>
                  </View>
                </View>
                <View style={styles.reviewedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.floTeal} />
                  <Text style={[styles.reviewedBadgeText, { color: Colors.floTeal }]}>
                    {activeArticle.reviewedBy}
                  </Text>
                </View>
              </View>

              {/* Article Paragraphs */}
              <View style={styles.paragraphsBox}>
                {activeArticle.content.map((p, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.paragraphText,
                      { color: colors.text, lineHeight: 26 },
                    ]}
                  >
                    {p}
                  </Text>
                ))}
              </View>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {activeArticle.tags.map(tag => (
                  <View
                    key={tag}
                    style={[
                      styles.tagChip,
                      { backgroundColor: isDark ? colors.card : '#F3F4F6' },
                    ]}
                  >
                    <Text style={[styles.tagChipText, { color: colors.textMuted }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  screenTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  screenSubtitle: { fontSize: 13, marginTop: 2 },
  badgePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  catScroll: { gap: 8, paddingVertical: 4 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  catChipText: { fontSize: 13 },
  contentScroll: { paddingHorizontal: 20, paddingTop: 10 },
  loadingBox: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, marginTop: 10 },
  emptyBox: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  quickResourceRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quickResCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  quickResIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  quickResTitle: { fontSize: 13, fontWeight: '800' },
  quickResSub: { fontSize: 10.5, marginTop: 1 },
  featuredCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  featuredHeroImg: { width: '100%', height: 140, borderRadius: 16, marginBottom: 12 },
  featuredBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryTagText: { fontSize: 11, fontWeight: '700' },
  audioTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.floPurpleLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  audioTagText: { fontSize: 11, fontWeight: '700', color: Colors.floPurple },
  featuredTitle: { fontSize: 18, fontWeight: '800', lineHeight: 24, marginBottom: 6 },
  featuredSubtitle: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  authorAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  authorName: { fontSize: 12, fontWeight: '700' },
  authorTitle: { fontSize: 10 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  articleCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  articleCardBody: {},
  articleTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  articleCategory: { fontSize: 11, fontWeight: '700' },
  articleMetaRow: { flexDirection: 'row', alignItems: 'center' },
  articleReadTime: { fontSize: 11, fontWeight: '500' },
  articleTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  articleSummary: { fontSize: 12, lineHeight: 17, marginBottom: 10 },
  articleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' },
  articleAuthor: { fontSize: 11, fontWeight: '500' },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalHeaderActions: { flexDirection: 'row', gap: 8 },
  modalActionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalScroll: { paddingHorizontal: 20, paddingTop: 8 },
  modalHeroImg: { width: '100%', height: 160, borderRadius: 20, marginBottom: 16 },
  modalCategoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalReadTime: { fontSize: 12, fontWeight: '600' },
  modalTitle: { fontSize: 22, fontWeight: '800', lineHeight: 28, marginBottom: 8 },
  modalSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  authorReviewCard: { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  authorDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  authorAvatarLarge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modalAuthorName: { fontSize: 14, fontWeight: '700' },
  modalAuthorTitle: { fontSize: 12 },
  reviewedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.08)' },
  reviewedBadgeText: { fontSize: 12, fontWeight: '600' },
  audioPlayerBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 20 },
  playIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.floPurple, alignItems: 'center', justifyContent: 'center' },
  audioTitleText: { fontSize: 13, fontWeight: '700', color: Colors.floPurple },
  audioTimeText: { fontSize: 11, color: Colors.floPurple, opacity: 0.8 },
  paragraphsBox: { gap: 14, marginBottom: 24 },
  paragraphText: { fontSize: 15 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagChipText: { fontSize: 12, fontWeight: '600' },
});

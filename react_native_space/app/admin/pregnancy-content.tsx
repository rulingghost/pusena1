import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, Pressable, TextInput, StyleSheet, Alert, Modal,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import {
  adminClient,
  type PregnancyWeekListItem,
  type PregnancyWeekDetail,
  type SymptomTypeItem,
  type BabyNameItem,
  type AdminArticleItem,
  type AdminFaqItem,
  type AdminMythItem,
} from '@/src/api/adminClient';
import { getErrorMessage } from '@/src/api/customFetch';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type ContentTab = 'weeks' | 'symptoms' | 'names' | 'articles' | 'faqs' | 'myths';

const TABS: { id: ContentTab; label: string }[] = [
  { id: 'weeks', label: 'Haftalar' },
  { id: 'symptoms', label: 'Semptomlar' },
  { id: 'names', label: 'İsimler' },
  { id: 'articles', label: 'Makaleler' },
  { id: 'faqs', label: 'SSS' },
  { id: 'myths', label: 'Mitler' },
];

function splitList(val: string) {
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function AdminContentScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<ContentTab>('weeks');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const [editWeek, setEditWeek] = useState<PregnancyWeekDetail | null>(null);
  const [editSymptom, setEditSymptom] = useState<SymptomTypeItem | null>(null);
  const [editName, setEditName] = useState<BabyNameItem | null>(null);
  const [editArticle, setEditArticle] = useState<AdminArticleItem | null>(null);
  const [editFaq, setEditFaq] = useState<AdminFaqItem | null>(null);
  const [editMyth, setEditMyth] = useState<AdminMythItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const weeksQuery = useQuery({
    queryKey: ['admin-content', 'weeks'],
    queryFn: () => adminClient.getPregnancyWeeks(),
  });
  const symptomsQuery = useQuery({
    queryKey: ['admin-content', 'symptoms'],
    queryFn: () => adminClient.getSymptomTypes(),
  });
  const namesQuery = useQuery({
    queryKey: ['admin-content', 'names'],
    queryFn: () => adminClient.getBabyNames(1, 500),
  });
  const articlesQuery = useQuery({
    queryKey: ['admin-content', 'articles'],
    queryFn: () => adminClient.getArticlesContent(),
  });

  const invalidateAppContent = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-content'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/pregnancy/weeks'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] }),
    ]);
  };

  const q = search.trim().toLowerCase();
  const weeks = useMemo(
    () => (weeksQuery.data ?? []).filter((w) => !q || `${w.weekNumber} ${w.title} ${w.babySize}`.toLowerCase().includes(q)),
    [weeksQuery.data, q],
  );
  const symptoms = useMemo(
    () => (symptomsQuery.data ?? []).filter((s) => !q || `${s.name} ${s.category}`.toLowerCase().includes(q)),
    [symptomsQuery.data, q],
  );
  const names = useMemo(
    () => (namesQuery.data?.items ?? []).filter((n) => !q || `${n.name} ${n.origin} ${n.meaning}`.toLowerCase().includes(q)),
    [namesQuery.data, q],
  );
  const articles = useMemo(
    () => (articlesQuery.data?.articles ?? []).filter((a) => !q || `${a.title} ${a.summary}`.toLowerCase().includes(q)),
    [articlesQuery.data, q],
  );
  const faqs = useMemo(
    () => (articlesQuery.data?.faqs ?? []).filter((f) => !q || `${f.question} ${f.answer}`.toLowerCase().includes(q)),
    [articlesQuery.data, q],
  );
  const myths = useMemo(
    () => (articlesQuery.data?.myths ?? []).filter((m) => !q || `${m.statement} ${m.explanation}`.toLowerCase().includes(q)),
    [articlesQuery.data, q],
  );

  const refreshing =
    weeksQuery.isRefetching || symptomsQuery.isRefetching || namesQuery.isRefetching || articlesQuery.isRefetching;

  const onRefresh = () => {
    weeksQuery.refetch();
    symptomsQuery.refetch();
    namesQuery.refetch();
    articlesQuery.refetch();
  };

  const openWeek = async (weekNumber: number) => {
    setLoadingDetail(true);
    try {
      const detail = await adminClient.getPregnancyWeekDetail(weekNumber);
      setEditWeek({
        ...detail,
        letterFromBaby: detail.letterFromBaby ?? '',
        commonSymptoms: detail.commonSymptoms ?? [],
        tips: detail.tips ?? [],
        warnings: detail.warnings ?? [],
      });
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Hafta içeriği yüklenemedi.'));
    } finally {
      setLoadingDetail(false);
    }
  };

  const saveWeek = async () => {
    if (!editWeek) return;
    setSaving(true);
    try {
      await adminClient.updatePregnancyWeek(editWeek.weekNumber, {
        title: editWeek.title,
        babyDevelopment: editWeek.babyDevelopment,
        babySize: editWeek.babySize,
        babyWeight: editWeek.babyWeight,
        organDevelopment: editWeek.organDevelopment,
        motherChanges: editWeek.motherChanges,
        letterFromBaby: editWeek.letterFromBaby ?? '',
        commonSymptoms: editWeek.commonSymptoms,
        tips: editWeek.tips,
        warnings: editWeek.warnings,
      });
      await invalidateAppContent();
      setEditWeek(null);
      Alert.alert('Kaydedildi', `Hafta ${editWeek.weekNumber} web ve mobil uygulamada güncellendi.`);
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const saveSymptom = async () => {
    if (!editSymptom) return;
    setSaving(true);
    try {
      await adminClient.updateSymptomType(editSymptom.id, {
        category: editSymptom.category,
        name: editSymptom.name,
        displayOrder: Number(editSymptom.displayOrder) || 0,
      });
      await invalidateAppContent();
      setEditSymptom(null);
      Alert.alert('Kaydedildi', 'Semptom tipi güncellendi.');
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const saveName = async () => {
    if (!editName) return;
    setSaving(true);
    try {
      await adminClient.updateBabyName(editName.id, {
        name: editName.name,
        gender: editName.gender,
        meaning: editName.meaning,
        origin: editName.origin,
        isPopular: editName.isPopular,
      });
      await invalidateAppContent();
      setEditName(null);
      Alert.alert('Kaydedildi', 'Bebek ismi güncellendi.');
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const saveArticle = async () => {
    if (!editArticle) return;
    setSaving(true);
    try {
      await adminClient.updateArticle(editArticle.id, {
        title: editArticle.title,
        summary: editArticle.summary,
        content: editArticle.content,
      });
      await invalidateAppContent();
      setEditArticle(null);
      Alert.alert('Kaydedildi', 'Makale web ve mobil uygulamada güncellendi.');
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const saveFaq = async () => {
    if (!editFaq) return;
    setSaving(true);
    try {
      await adminClient.updateFaq(editFaq.id, { question: editFaq.question, answer: editFaq.answer });
      await invalidateAppContent();
      setEditFaq(null);
      Alert.alert('Kaydedildi', 'SSS güncellendi.');
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const saveMyth = async () => {
    if (!editMyth) return;
    setSaving(true);
    try {
      await adminClient.updateMyth(editMyth.id, { statement: editMyth.statement, explanation: editMyth.explanation });
      await invalidateAppContent();
      setEditMyth(null);
      Alert.alert('Kaydedildi', 'Mit güncellendi.');
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Kaydedilemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (tab === 'weeks') {
      const w = item as PregnancyWeekListItem;
      return (
        <Pressable style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => openWeek(w.weekNumber)}>
          <View style={[styles.badge, { backgroundColor: Colors.pregnancy + '20' }]}>
            <Text style={{ color: Colors.pregnancy, fontWeight: '800' }}>{w.weekNumber}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{w.title}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>{w.babySize} · {w.babyWeight}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </Pressable>
      );
    }
    if (tab === 'symptoms') {
      const s = item as SymptomTypeItem;
      return (
        <Pressable style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setEditSymptom({ ...s })}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{s.name}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>{s.category} · sıra {s.displayOrder}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </Pressable>
      );
    }
    if (tab === 'names') {
      const n = item as BabyNameItem;
      return (
        <Pressable style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setEditName({ ...n })}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{n.name}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>{n.gender} · {n.origin}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </Pressable>
      );
    }
    if (tab === 'articles') {
      const a = item as AdminArticleItem;
      return (
        <Pressable style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setEditArticle({ ...a, content: [...(a.content ?? [])] })}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{a.title}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>{a.categoryName || a.summary}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </Pressable>
      );
    }
    if (tab === 'faqs') {
      const f = item as AdminFaqItem;
      return (
        <Pressable style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setEditFaq({ ...f })}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{f.question}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>{f.answer}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </Pressable>
      );
    }
    const m = item as AdminMythItem;
    return (
      <Pressable style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setEditMyth({ ...m })}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{m.statement}</Text>
          <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>{m.explanation}</Text>
        </View>
        <Ionicons name="create-outline" size={18} color={Colors.primary} />
      </Pressable>
    );
  };

  const data =
    tab === 'weeks' ? weeks
      : tab === 'symptoms' ? symptoms
        : tab === 'names' ? names
          : tab === 'articles' ? articles
            : tab === 'faqs' ? faqs
              : myths;

  const loading =
    (tab === 'weeks' && weeksQuery.isLoading)
    || (tab === 'symptoms' && symptomsQuery.isLoading)
    || (tab === 'names' && namesQuery.isLoading)
    || ((tab === 'articles' || tab === 'faqs' || tab === 'myths') && articlesQuery.isLoading);

  const field = (label: string, value: string, onChange: (v: string) => void, multiline = false) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border },
        ]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <AdminHeader title="İçerik Yönetimi" subtitle="Web paneli ile aynı veritabanı" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => { setTab(t.id); setSearch(''); }}
            style={[styles.tab, tab === t.id && { backgroundColor: Colors.primary }]}
          >
            <Text style={{ color: tab === t.id ? '#FFF' : colors.text, fontWeight: '700', fontSize: 12 }}>{t.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <TextInput
          style={[styles.search, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="Listede ara..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, i) => String((item as any).id ?? (item as any).weekNumber ?? i)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>{loading || loadingDetail ? 'Yükleniyor...' : 'Kayıt yok'}</Text>
        }
      />

      <Modal visible={!!editWeek || loadingDetail} transparent animationType="slide" onRequestClose={() => setEditWeek(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Hafta {editWeek?.weekNumber ?? ''} Düzenle</Text>
                <Pressable onPress={() => setEditWeek(null)}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
              </View>
              {loadingDetail || !editWeek ? (
                <ActivityIndicator color={Colors.primary} style={{ marginVertical: 40 }} />
              ) : (
                <ScrollView keyboardShouldPersistTaps="handled">
                  {field('Başlık', editWeek.title, (v) => setEditWeek({ ...editWeek, title: v }))}
                  {field('Bebek boyutu', editWeek.babySize, (v) => setEditWeek({ ...editWeek, babySize: v }))}
                  {field('Bebek ağırlığı', editWeek.babyWeight, (v) => setEditWeek({ ...editWeek, babyWeight: v }))}
                  {field('Bebek gelişimi', editWeek.babyDevelopment, (v) => setEditWeek({ ...editWeek, babyDevelopment: v }), true)}
                  {field('Organ gelişimi', editWeek.organDevelopment, (v) => setEditWeek({ ...editWeek, organDevelopment: v }), true)}
                  {field('Anne değişimleri', editWeek.motherChanges, (v) => setEditWeek({ ...editWeek, motherChanges: v }), true)}
                  {field('Bebekten mektup', editWeek.letterFromBaby ?? '', (v) => setEditWeek({ ...editWeek, letterFromBaby: v }), true)}
                  {field('Yaygın semptomlar (virgülle)', (editWeek.commonSymptoms ?? []).join(', '), (v) => setEditWeek({ ...editWeek, commonSymptoms: splitList(v) }))}
                  {field('İpuçları (virgülle)', (editWeek.tips ?? []).join(', '), (v) => setEditWeek({ ...editWeek, tips: splitList(v) }))}
                  {field('Uyarılar (virgülle)', (editWeek.warnings ?? []).join(', '), (v) => setEditWeek({ ...editWeek, warnings: splitList(v) }))}
                </ScrollView>
              )}
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={saveWeek} disabled={saving || loadingDetail}>
                <Text style={styles.saveTxt}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!editSymptom} transparent animationType="slide" onRequestClose={() => setEditSymptom(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Semptom Tipi</Text>
                <Pressable onPress={() => setEditSymptom(null)}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
              </View>
              {editSymptom && (
                <ScrollView keyboardShouldPersistTaps="handled">
                  {field('Kategori', editSymptom.category, (v) => setEditSymptom({ ...editSymptom, category: v }))}
                  {field('Ad', editSymptom.name, (v) => setEditSymptom({ ...editSymptom, name: v }))}
                  {field('Sıra', String(editSymptom.displayOrder), (v) => setEditSymptom({ ...editSymptom, displayOrder: Number(v) || 0 }))}
                </ScrollView>
              )}
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={saveSymptom} disabled={saving}>
                <Text style={styles.saveTxt}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!editName} transparent animationType="slide" onRequestClose={() => setEditName(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Bebek İsmi</Text>
                <Pressable onPress={() => setEditName(null)}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
              </View>
              {editName && (
                <ScrollView keyboardShouldPersistTaps="handled">
                  {field('İsim', editName.name, (v) => setEditName({ ...editName, name: v }))}
                  {field('Anlam', editName.meaning, (v) => setEditName({ ...editName, meaning: v }))}
                  {field('Köken', editName.origin, (v) => setEditName({ ...editName, origin: v }))}
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Cinsiyet</Text>
                  <View style={styles.chips}>
                    {['girl', 'boy', 'unisex'].map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setEditName({ ...editName, gender: g })}
                        style={[styles.chip, { backgroundColor: editName.gender === g ? Colors.primary : colors.inputBg }]}
                      >
                        <Text style={{ color: editName.gender === g ? '#FFF' : colors.text, fontWeight: '700', fontSize: 12 }}>
                          {g === 'girl' ? 'Kız' : g === 'boy' ? 'Erkek' : 'Unisex'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Pressable onPress={() => setEditName({ ...editName, isPopular: !editName.isPopular })} style={styles.switchRow}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>Popüler</Text>
                    <Text style={{ color: editName.isPopular ? Colors.success : colors.textMuted }}>{editName.isPopular ? 'Evet' : 'Hayır'}</Text>
                  </Pressable>
                </ScrollView>
              )}
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={saveName} disabled={saving}>
                <Text style={styles.saveTxt}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!editArticle} transparent animationType="slide" onRequestClose={() => setEditArticle(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Makale</Text>
                <Pressable onPress={() => setEditArticle(null)}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
              </View>
              {editArticle && (
                <ScrollView keyboardShouldPersistTaps="handled">
                  {field('Başlık', editArticle.title, (v) => setEditArticle({ ...editArticle, title: v }))}
                  {field('Özet', editArticle.summary, (v) => setEditArticle({ ...editArticle, summary: v }), true)}
                  {field('İçerik (paragraf / satır)', (editArticle.content ?? []).join('\n'), (v) => setEditArticle({
                    ...editArticle,
                    content: v.split('\n').map((s) => s.trim()).filter(Boolean),
                  }), true)}
                </ScrollView>
              )}
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={saveArticle} disabled={saving}>
                <Text style={styles.saveTxt}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!editFaq} transparent animationType="slide" onRequestClose={() => setEditFaq(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>SSS</Text>
                <Pressable onPress={() => setEditFaq(null)}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
              </View>
              {editFaq && (
                <ScrollView keyboardShouldPersistTaps="handled">
                  {field('Soru', editFaq.question, (v) => setEditFaq({ ...editFaq, question: v }), true)}
                  {field('Cevap', editFaq.answer, (v) => setEditFaq({ ...editFaq, answer: v }), true)}
                </ScrollView>
              )}
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={saveFaq} disabled={saving}>
                <Text style={styles.saveTxt}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!editMyth} transparent animationType="slide" onRequestClose={() => setEditMyth(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Mit</Text>
                <Pressable onPress={() => setEditMyth(null)}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
              </View>
              {editMyth && (
                <ScrollView keyboardShouldPersistTaps="handled">
                  {field('İfade', editMyth.statement, (v) => setEditMyth({ ...editMyth, statement: v }), true)}
                  {field('Açıklama', editMyth.explanation, (v) => setEditMyth({ ...editMyth, explanation: v }), true)}
                </ScrollView>
              )}
              <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary }]} onPress={saveMyth} disabled={saving}>
                <Text style={styles.saveTxt}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.04)' },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  badge: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  multiline: { minHeight: 88 },
  saveBtn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  saveTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
});

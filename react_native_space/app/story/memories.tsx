import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Image, ActivityIndicator, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import { useMemories, useCreateMemory, useDeleteMemory } from '@/src/api/bloomClient';
import { getErrorMessage } from '@/src/api/customFetch';
import { localDateKey } from '@/src/utils/dateOnly';
import { resolveMediaUrl } from '@/src/utils/mediaUrl';

const MAX_IMAGES = 2;

const CATEGORIES = ['Özel An', 'İlkler', 'Özel Günler', 'Bebek', 'Tatil', 'Sürpriz'];

const EMOJIS = ['✨', '💍', '☕', '💓', '🌊', '🎂', '🎁', '👶', '🏖️', '🌸'];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MemoriesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const { data, isLoading, refetch } = useMemories();
  const createMemory = useCreateMemory();
  const deleteMemory = useDeleteMemory();

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(localDateKey());
  const [newNotes, setNewNotes] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newEmoji, setNewEmoji] = useState(EMOJIS[0]);
  const [images, setImages] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const memories = data?.items ?? [];

  const pickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('Sınıra ulaşıldı', `Bir anıya en fazla ${MAX_IMAGES} fotoğraf ekleyebilirsiniz.`);
      return;
    }
    try {
      setPicking(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri izni vermeniz gerekiyor.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.4,
        base64: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setImages((prev) => [...prev, uri].slice(0, MAX_IMAGES));
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir sorun oluştu.');
    } finally {
      setPicking(false);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDate(localDateKey());
    setNewNotes('');
    setNewCategory(CATEGORIES[0]);
    setNewEmoji(EMOJIS[0]);
    setImages([]);
  };

  const handleAddMemory = () => {
    if (!newTitle.trim()) {
      Alert.alert('Eksik bilgi', 'Lütfen anıya bir başlık verin.');
      return;
    }
    createMemory.mutate(
      {
        title: newTitle.trim(),
        date: newDate,
        category: newCategory,
        emoji: newEmoji,
        notes: newNotes.trim() || null,
        imageUrls: images,
      },
      {
        onSuccess: () => {
          Alert.alert('Anı Eklendi 📸', `"${newTitle.trim()}" anı defterinize kaydedildi.`);
          resetForm();
          setShowAdd(false);
        },
        onError: (e) => Alert.alert('Hata', getErrorMessage(e, 'Anı kaydedilemedi.')),
      },
    );
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Anıyı sil', `"${title}" anısı silinsin mi?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () =>
          deleteMemory.mutate(id, {
            onError: () => Alert.alert('Hata', 'Anı silinemedi.'),
          }),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Anı Defterimiz 📸</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {memories.length > 0 ? `${memories.length} anı biriktirdiniz` : 'Birlikte biriktirdiğiniz özel anlar'}
          </Text>
        </View>
        <Pressable style={[styles.addTopBtn, { backgroundColor: Colors.relationship }]} onPress={() => setShowAdd(!showAdd)}>
          <Ionicons name={showAdd ? 'close' : 'add'} size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroScrapbookCard}>
          <Image source={AppImages.loveLetterScrapbook} style={styles.heroScrapbookImg} resizeMode="cover" />
        </View>

        {showAdd && (
          <View style={[styles.addCard, { backgroundColor: colors.card, borderColor: Colors.relationship }]}>
            <Text style={[styles.addTitle, { color: colors.text }]}>Yeni Bir Anı Ölümsüzleştir</Text>

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Anı Başlığı (örn. İlk Tatilimiz)"
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Tarih (YYYY-AA-GG)"
              placeholderTextColor={colors.textMuted}
              value={newDate}
              onChangeText={setNewDate}
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Kategori</Text>
            <View style={styles.chipWrap}>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setNewCategory(c)}
                  style={[
                    styles.chip,
                    {
                      borderColor: newCategory === c ? Colors.relationship : colors.border,
                      backgroundColor: newCategory === c ? Colors.relationship + '15' : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: newCategory === c ? Colors.relationship : colors.textSecondary }]}>{c}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Simge</Text>
            <View style={styles.chipWrap}>
              {EMOJIS.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setNewEmoji(e)}
                  style={[
                    styles.emojiChip,
                    {
                      borderColor: newEmoji === e ? Colors.relationship : colors.border,
                      backgroundColor: newEmoji === e ? Colors.relationship + '15' : 'transparent',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{e}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={[styles.input, { height: 70, color: colors.text, borderColor: colors.border, textAlignVertical: 'top' }]}
              placeholder="Bu anı sizin için neden çok özeldi?"
              placeholderTextColor={colors.textMuted}
              multiline
              value={newNotes}
              onChangeText={setNewNotes}
            />

            <View style={styles.photoHeaderRow}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 0 }]}>
                Fotoğraflar ({images.length}/{MAX_IMAGES})
              </Text>
              <Text style={[styles.photoHint, { color: colors.textMuted }]}>En fazla {MAX_IMAGES} fotoğraf</Text>
            </View>

            <View style={styles.photoRow}>
              {images.map((uri, idx) => (
                <View key={idx} style={styles.photoThumbWrap}>
                  <Pressable onPress={() => setPreview(uri)}>
                    <Image source={{ uri }} style={styles.photoThumb} />
                  </Pressable>
                  <Pressable
                    style={styles.photoRemove}
                    onPress={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    hitSlop={6}
                  >
                    <Ionicons name="close" size={13} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
              {images.length < MAX_IMAGES && (
                <Pressable
                  style={[styles.photoAddBtn, { borderColor: colors.border }]}
                  onPress={pickImage}
                  disabled={picking}
                >
                  {picking ? (
                    <ActivityIndicator size="small" color={Colors.relationship} />
                  ) : (
                    <>
                      <Ionicons name="camera-outline" size={22} color={Colors.relationship} />
                      <Text style={[styles.photoAddText, { color: Colors.relationship }]}>Ekle</Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>

            <Pressable
              style={[styles.saveBtn, { backgroundColor: Colors.relationship, opacity: createMemory.isPending ? 0.6 : 1 }]}
              onPress={handleAddMemory}
              disabled={createMemory.isPending}
            >
              {createMemory.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="heart" size={18} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Anıyı Deftere Kaydet</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={Colors.relationship} />
        ) : memories.length === 0 ? (
          <Pressable style={styles.emptyState} onPress={() => setShowAdd(true)}>
            <Ionicons name="images-outline" size={44} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Henüz anı eklemediniz</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              İlk anınızı ekleyin — fotoğraflarıyla birlikte burada zaman tüneli olarak saklanacak.
            </Text>
          </Pressable>
        ) : (
          <View style={styles.timeline}>
            {memories.map((mem, idx) => (
              <View key={mem.id} style={styles.timelineItem}>
                <View style={styles.tlLeft}>
                  <View style={[styles.tlEmojiBox, { backgroundColor: Colors.relationship + '15' }]}>
                    <Text style={{ fontSize: 20 }}>{mem.emoji}</Text>
                  </View>
                  {idx < memories.length - 1 && <View style={[styles.tlLine, { backgroundColor: Colors.relationship + '30' }]} />}
                </View>

                <View style={[styles.memCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.memCardTop}>
                    <Text style={[styles.memDate, { color: Colors.relationship }]}>{formatDate(mem.date)}</Text>
                    <View style={styles.memTopRight}>
                      <View style={[styles.memCatPill, { backgroundColor: isDark ? '#3D2032' : '#FFF0F6' }]}>
                        <Text style={[styles.memCatText, { color: Colors.floPink }]}>{mem.category}</Text>
                      </View>
                      <Pressable onPress={() => handleDelete(mem.id, mem.title)} hitSlop={8}>
                        <Ionicons name="trash-outline" size={15} color={colors.textMuted} />
                      </Pressable>
                    </View>
                  </View>
                  <Text style={[styles.memTitle, { color: colors.text }]}>{mem.title}</Text>
                  {!!mem.notes && <Text style={[styles.memNotes, { color: colors.textSecondary }]}>{mem.notes}</Text>}

                  {mem.imageUrls?.length > 0 && (
                    <View style={styles.memPhotoRow}>
                      {mem.imageUrls.map((uri, i) => (
                        <Pressable key={i} style={styles.memPhotoWrap} onPress={() => setPreview(resolveMediaUrl(uri) ?? uri)}>
                          <Image source={{ uri: resolveMediaUrl(uri) }} style={styles.memPhoto} resizeMode="cover" />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <Pressable style={styles.previewBackdrop} onPress={() => setPreview(null)}>
          {preview && <Image source={{ uri: preview }} style={styles.previewImg} resizeMode="contain" />}
          <View style={styles.previewClose}>
            <Ionicons name="close-circle" size={34} color="#FFFFFF" />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  addTopBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroScrapbookCard: { width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', marginVertical: 10 },
  heroScrapbookImg: { width: '100%', height: '100%' },
  addCard: { padding: 18, borderRadius: 22, borderWidth: 1.5, marginVertical: 12 },
  addTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  input: { minHeight: 44, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 8 },
  fieldLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 6, marginBottom: 6 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },
  emojiChip: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  photoHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
  photoHint: { fontSize: 11 },
  photoRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  photoThumbWrap: { position: 'relative' },
  photoThumb: { width: 86, height: 86, borderRadius: 14 },
  photoRemove: {
    position: 'absolute', top: -5, right: -5, width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center',
  },
  photoAddBtn: {
    width: 86, height: 86, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  photoAddText: { fontSize: 11, fontWeight: '700' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, marginTop: 10 },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  timeline: { marginTop: 12 },
  timelineItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  tlLeft: { alignItems: 'center', width: 44 },
  tlEmojiBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  tlLine: { width: 2, flex: 1, marginVertical: 4 },
  memCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1 },
  memCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 },
  memTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memDate: { fontSize: 11.5, fontWeight: '800', flexShrink: 1 },
  memCatPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  memCatText: { fontSize: 10, fontWeight: '800' },
  memTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  memNotes: { fontSize: 13, lineHeight: 18 },
  memPhotoRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  memPhotoWrap: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  memPhoto: { width: '100%', height: 110 },
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 50, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginTop: 6 },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  previewBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  previewImg: { width: '92%', height: '75%' },
  previewClose: { position: 'absolute', top: 56, right: 22 },
});

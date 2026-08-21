import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useCommunityControllerCreatePost } from '@/src/api/generated/api';
import { useQueryClient } from '@tanstack/react-query';

const CATEGORIES = [
  { key: 'genel', label: 'Genel' },
  { key: 'gebelik', label: 'Gebelik' },
  { key: 'regl', label: 'Regl' },
  { key: 'ilişki', label: 'İlişki' },
  { key: 'sağlık', label: 'Sağlık' },
];

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useCommunityControllerCreatePost();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('genel');

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir şeyler yazın.');
      return;
    }
    createMutation.mutate(
      { data: { content: content.trim(), category } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
          router.back();
        },
        onError: () => Alert.alert('Hata', 'Paylaşım oluşturulamadı.'),
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Yeni Paylaşım</Text>
        <Pressable
          style={[styles.postBtn, { backgroundColor: content.trim() ? Colors.primary : colors.inputBg }]}
          onPress={handlePost}
          disabled={createMutation.isPending || !content.trim()}
        >
          <Text style={[styles.postBtnText, { color: content.trim() ? '#fff' : colors.textMuted }]}>
            {createMutation.isPending ? '...' : 'Paylaş'}
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.chipRow}>
          {CATEGORIES.map(c => (
            <Pressable
              key={c.key}
              style={[styles.chip, { backgroundColor: category === c.key ? Colors.community : colors.inputBg }]}
              onPress={() => setCategory(c.key)}
            >
              <Text style={[styles.chipText, { color: category === c.key ? '#fff' : colors.text }]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={[styles.textArea, { color: colors.text }]}
          placeholder="Düşüncelerinizi paylaşın..."
          placeholderTextColor={colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
          textAlignVertical="top"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  postBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  postBtnText: { fontSize: 14, fontWeight: '700' },
  scroll: { paddingHorizontal: 20 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  chipText: { fontSize: 13, fontWeight: '600' },
  textArea: { fontSize: 16, lineHeight: 24, minHeight: 200 },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { useUsersControllerUpdateProfile } from '@/src/api/generated/api';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { resolveMediaUrl } from '@/src/utils/mediaUrl';

const GENDER_OPTIONS = [
  { key: 'female', label: 'Kadın', icon: 'female-outline' as const },
  { key: 'male', label: 'Erkek', icon: 'male-outline' as const },
  { key: 'other', label: 'Belirtmek istemiyorum', icon: 'ellipsis-horizontal-outline' as const },
];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, refreshUser, updateUser } = useAuth();
  const updateMutation = useUsersControllerUpdateProfile();
  const [name, setName] = useState(user?.name ?? '');
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [biography, setBiography] = useState(user?.biography ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl ?? null);
  const [gender, setGender] = useState<string | null>((user as any)?.gender ?? null);
  const [birthYear, setBirthYear] = useState<string>(
    (user as any)?.birthYear ? String((user as any).birthYear) : '',
  );
  const [pickingImage, setPickingImage] = useState(false);

  const handlePickImage = async () => {
    try {
      setPickingImage(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri izni vermeniz gerekmektedir.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.45,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setAvatarUrl(dataUri);
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilemedi.');
    } finally {
      setPickingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert('Fotoğrafı Kaldır', 'Profil fotoğrafınızı kaldırmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Kaldır', style: 'destructive', onPress: () => setAvatarUrl(null) },
    ]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Uyarı', 'Ad boş olamaz.');
      return;
    }
    const parsedYear = parseInt(birthYear, 10);
    const validYear = !Number.isNaN(parsedYear) && parsedYear >= 1940 && parsedYear <= new Date().getFullYear();
    if (birthYear.trim() && !validYear) {
      Alert.alert('Uyarı', 'Geçerli bir doğum yılı girin.');
      return;
    }

    if (!gender) {
      Alert.alert('Cinsiyet gerekli', 'Çift eşleşmesi ve tema için cinsiyetinizi seçin.');
      return;
    }
    const payload: any = {
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      biography: biography.trim() || undefined,
      gender,
      ...(validYear ? { birthYear: parsedYear } : {}),
    };
    if (avatarUrl === null) payload.avatarUrl = null;
    else if (avatarUrl?.startsWith('data:')) payload.avatarUrl = avatarUrl;
    updateMutation.mutate(
      { data: payload },
      {
        onSuccess: (saved) => {
          const nextAvatar = (saved as { avatarUrl?: string | null } | undefined)?.avatarUrl ?? avatarUrl;
          updateUser({
            name: name.trim(),
            nickname: nickname.trim() || undefined,
            biography: biography.trim() || undefined,
            avatarUrl: nextAvatar ?? undefined,
            gender,
          } as any);
          refreshUser();
          queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
          Alert.alert('Kaydedildi', 'Profiliniz güncellendi.');
          router.back();
        },
        onError: () => Alert.alert('Fotoğraf kaydedilemedi', 'Görsel 2.5 MB altında JPEG/PNG olmalı. Tekrar deneyin.'),
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profili Düzenle 🌸</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Avatar Section */}
        <View style={[styles.avatarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: resolveMediaUrl(avatarUrl) }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarLg, { backgroundColor: Colors.lavender }]}>
                <Text style={{ fontSize: 34, color: Colors.primary, fontWeight: '700' }}>
                  {(name ?? '?')?.[0]?.toLocaleUpperCase('tr-TR')}
                </Text>
              </View>
            )}
            <Pressable style={[styles.cameraBtn, { backgroundColor: Colors.primary }]} onPress={handlePickImage} disabled={pickingImage}>
              {pickingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </Pressable>
          </View>

          <View style={styles.avatarActions}>
            <Pressable style={[styles.photoActionBtn, { backgroundColor: Colors.primary + '15', borderColor: Colors.primary + '30' }]} onPress={handlePickImage}>
              <Ionicons name="image-outline" size={16} color={Colors.primary} />
              <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 12.5 }}>
                {avatarUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
              </Text>
            </Pressable>
            {avatarUrl && (
              <Pressable style={[styles.photoActionBtn, { backgroundColor: Colors.danger + '10', borderColor: Colors.danger + '25' }]} onPress={handleRemovePhoto}>
                <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                <Text style={{ color: Colors.danger, fontWeight: '700', fontSize: 12.5 }}>Kaldır</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Form */}
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Ad Soyad</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={18} color={Colors.primary + '90'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Adınız"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Topluluk Takma İsmi (Rumuz)</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="at-outline" size={18} color={Colors.primary + '90'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="İsteğe bağlı takma isim"
              placeholderTextColor={colors.textMuted}
              maxLength={30}
            />
          </View>
          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            Topluluk gönderilerinde ve yorumlarda bu isim görünür.
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Hakkımda / Biyografi</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            value={biography}
            onChangeText={setBiography}
            placeholder="Kendiniz hakkında kısa bir şeyler yazın..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={300}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>{biography?.length ?? 0}/300</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Cinsiyet</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((g) => {
              const active = gender === g.key;
              return (
                <Pressable
                  key={g.key}
                  onPress={() => setGender(active ? null : g.key)}
                  style={[
                    styles.genderChip,
                    {
                      borderColor: active ? Colors.primary : colors.border,
                      backgroundColor: active ? Colors.primary + '15' : colors.inputBg,
                    },
                  ]}
                >
                  <Ionicons name={g.icon} size={17} color={active ? Colors.primary : colors.textMuted} />
                  <Text style={[styles.genderText, { color: active ? Colors.primary : colors.text }]}>{g.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            Partner rehberi ve öneriler cinsiyetinize göre kişiselleştirilir.
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Doğum Yılı</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary + '90'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={birthYear}
              onChangeText={(v) => setBirthYear(v.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="Örn. 1995"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            Yaş, doğurganlık analizinizde kullanılan en belirleyici faktördür.
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>E-posta (Değiştirilemez)</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>{user?.email ?? ''}</Text>
          </View>

          <Pressable
            style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
            onPress={handleSave}
            disabled={updateMutation.isPending}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>{updateMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</Text>
          </Pressable>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genderChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5,
  },
  genderText: { fontSize: 13, fontWeight: '600' },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  avatarCard: {
    borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 14, borderWidth: 1,
    shadowColor: Colors.primary, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  avatarWrapper: { position: 'relative', width: 92, height: 92, marginBottom: 14 },
  avatarImage: { width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: Colors.lavender },
  avatarLg: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
  },
  avatarActions: { flexDirection: 'row', gap: 10 },
  photoActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1,
  },

  formCard: {
    borderRadius: 24, padding: 20, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10, marginLeft: 2 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, height: 50, marginBottom: 4,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  textArea: {
    borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 14.5,
    minHeight: 90, marginBottom: 4,
  },
  helperText: { fontSize: 11.5, marginBottom: 4, marginTop: 2, marginLeft: 4 },
  charCount: { fontSize: 11, textAlign: 'right', marginBottom: 4 },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 16, marginTop: 20,
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

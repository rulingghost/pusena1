import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuthControllerChangePassword, useAuthControllerDeleteAccount } from '@/src/api/generated/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { customFetch } from '@/src/api/customFetch';

const DELETE_REASONS = [
  'Artık ihtiyacım yok',
  'Başka bir uygulama kullanıyorum',
  'Gizlilik ve güvenlik endişeleri',
  'Teknik sorunlar yaşıyorum',
  'Geçici olarak ara veriyorum',
  'Diğer bir neden',
];

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { logout } = useAuth();
  const changePwMutation = useAuthControllerChangePassword();
  const deleteAccMutation = useAuthControllerDeleteAccount();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(DELETE_REASONS[0]);
  const [deleteNote, setDeleteNote] = useState('');
  const [deletePw, setDeletePw] = useState('');

  const handleChangePassword = () => {
    if (!currentPw || !newPw) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Uyarı', 'Şifreler eşleşmiyor.');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    changePwMutation.mutate(
      { data: { currentPassword: currentPw, newPassword: newPw } },
      {
        onSuccess: () => {
          Alert.alert('Başarılı ✨', 'Şifreniz başarıyla güncellendi.');
          setCurrentPw('');
          setNewPw('');
          setConfirmPw('');
        },
        onError: () => Alert.alert('Hata', 'Şifre güncellenemedi. Mevcut şifrenizi kontrol edin.'),
      }
    );
  };

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deletePw) {
      Alert.alert('Uyarı', 'Hesabınızı silmek için mevcut şifrenizi girmeniz gerekmektedir.');
      return;
    }

    try {
      setIsDeletingAccount(true);
      await customFetch('/api/auth/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePw, reason: selectedReason, note: deleteNote.trim() || undefined }),
      });
      setShowDeleteModal(false);
      Alert.alert('Hesabınız Silindi 🌸', 'Hesabınız ve tüm verileriniz başarıyla silindi. Sizi tekrar aramızda görmekten mutluluk duyarız.');
      await logout();
      router.replace('/auth/login');
    } catch (err: any) {
      if (err?.status === 401) {
        Alert.alert('Hata', 'Mevcut şifreniz yanlış. Lütfen şifrenizi doğru girdiğinizden emin olun.');
      } else {
        // If account was deleted in backend but response parsing failed, force logout
        setShowDeleteModal(false);
        Alert.alert('Hesabınız Silindi 🌸', 'Hesabınız başarıyla silinmiştir.');
        await logout();
        router.replace('/auth/login');
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Hesap Ayarları 🔒</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Change Password Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Şifre Değiştir</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Mevcut Şifre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Mevcut şifreniz"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={currentPw}
            onChangeText={setCurrentPw}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Yeni Şifre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Yeni şifreniz (en az 6 karakter)"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={newPw}
            onChangeText={setNewPw}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Yeni Şifre (Tekrar)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Yeni şifrenizi doğrulayın"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={confirmPw}
            onChangeText={setConfirmPw}
          />

          <Pressable
            style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
            onPress={handleChangePassword}
            disabled={changePwMutation.isPending}
          >
            <Ionicons name="key-outline" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>{changePwMutation.isPending ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</Text>
          </Pressable>
        </View>

        {/* Delete Account Section */}
        <View style={[styles.dangerCard, { backgroundColor: Colors.danger + '08', borderColor: Colors.danger + '25' }]}>
          <View style={styles.dangerHeader}>
            <Ionicons name="warning-outline" size={22} color={Colors.danger} />
            <Text style={[styles.dangerTitle, { color: Colors.danger }]}>Hesabı Kalıcı Olarak Sil</Text>
          </View>
          <Text style={[styles.dangerText, { color: colors.textSecondary }]}>
            Hesabınızı sildiğinizde gebelik, regl, ilişki kayıtlarınız ve tüm özel günleriniz kalıcı olarak silinecektir.
          </Text>

          <Pressable
            style={[styles.deleteTriggerBtn, { backgroundColor: Colors.danger }]}
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.deleteBtnText}>Hesabımı Sil</Text>
          </Pressable>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* Account Deletion Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide" onRequestClose={() => setShowDeleteModal(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Aramızdan Ayrılıyor Musunuz? 🥺</Text>
                  <Text style={[styles.modalSub, { color: colors.textMuted }]}>Geri bildiriminiz bizim için çok değerlidir.</Text>
                </View>
                <Pressable onPress={() => setShowDeleteModal(false)} style={styles.iconBtn}>
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 4 }]}>Neden silmek istiyorsunuz?</Text>
                {DELETE_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <Pressable
                      key={reason}
                      style={[
                        styles.reasonChip,
                        {
                          backgroundColor: isSelected ? Colors.danger + '12' : colors.inputBg,
                          borderColor: isSelected ? Colors.danger : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedReason(reason)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={isSelected ? Colors.danger : colors.textMuted}
                      />
                      <Text style={[styles.reasonText, { color: isSelected ? Colors.danger : colors.text }]}>{reason}</Text>
                    </Pressable>
                  );
                })}

                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Eklemek İstediğiniz Not (Opsiyonel)</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  placeholder="Deneyiminizi geliştirmemiz için öneriniz..."
                  placeholderTextColor={colors.textMuted}
                  value={deleteNote}
                  onChangeText={setDeleteNote}
                  multiline
                  numberOfLines={3}
                />

                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Onaylamak İçin Şifrenizi Girin</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: Colors.danger + '50' }]}
                  placeholder="Mevcut şifreniz"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={deletePw}
                  onChangeText={setDeletePw}
                />
              </ScrollView>

              <Pressable
                style={[styles.finalDeleteBtn, { backgroundColor: Colors.danger }]}
                onPress={handleConfirmDelete}
                disabled={deleteAccMutation.isPending}
              >
                <Ionicons name="trash" size={18} color="#fff" />
                <Text style={styles.deleteBtnText}>{deleteAccMutation.isPending ? 'Hesap Siliniyor...' : 'Onaylıyorum, Hesabımı Kalıcı Olarak Sil'}</Text>
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
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  card: {
    borderRadius: 24, padding: 20, borderWidth: 1, marginBottom: 18,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10, marginLeft: 2 },
  input: {
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, height: 50, fontSize: 15, marginBottom: 4,
  },
  textArea: {
    borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 14, minHeight: 70, textAlignVertical: 'top',
  },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 50, borderRadius: 16, marginTop: 18,
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  dangerCard: {
    borderRadius: 24, padding: 20, borderWidth: 1,
  },
  dangerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dangerTitle: { fontSize: 16, fontWeight: '700' },
  dangerText: { fontSize: 12.5, lineHeight: 18, marginBottom: 16 },
  deleteTriggerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: 16,
  },
  deleteBtnText: { color: '#fff', fontSize: 14.5, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, borderWidth: 1,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSub: { fontSize: 12, marginTop: 2 },

  reasonChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 6,
  },
  reasonText: { fontSize: 13.5, fontWeight: '600' },

  finalDeleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 16, marginTop: 16,
  },
});

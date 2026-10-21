import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useKeyboardOverlap } from '@/src/hooks/useKeyboardOverlap';
import { apiClient } from '@/src/api/client';
import { customFetch } from '@/src/api/customFetch';
import { useRouter } from 'expo-router';
import { BrandLogo } from '@/src/components/BrandLogo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  options?: string[];
  timestamp: string;
}

const AI_CONSENT_KEY = 'pusena_ai_consent_accepted';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardOverlap = useKeyboardOverlap();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [insight, setInsight] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // AI Consent state
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  // AI Report state
  const [reportingMsg, setReportingMsg] = useState<ChatMessage | null>(null);
  const [reportReason, setReportReason] = useState<string>('Hatalı veya Yanıltıcı Tıbbi Bilgi');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(AI_CONSENT_KEY).then(val => {
      setHasConsent(val === 'true');
    }).catch(() => setHasConsent(false));
  }, []);

  const handleAcceptConsent = async () => {
    try {
      await AsyncStorage.setItem(AI_CONSENT_KEY, 'true');
      setHasConsent(true);
    } catch {
      setHasConsent(true);
    }
  };

  const submitReport = async () => {
    if (!reportingMsg) return;
    setIsSubmittingReport(true);
    try {
      await customFetch('/api/assistant/report', {
        method: 'POST',
        body: JSON.stringify({
          messageId: reportingMsg.id,
          responseText: reportingMsg.text,
          reason: reportReason,
        }),
      });
      setReportingMsg(null);
      Alert.alert('Geri Bildirim Alındı', 'Bu yanıt moderasyon incelemesine iletildi. Teşekkür ederiz.');
    } catch {
      Alert.alert('Hata', 'Şikayet iletilemedi. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const fetchDailyInsight = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await apiClient.get<any>('/api/assistant/daily-insight');
      const data = res?.data || res;
      if (data && data.phaseName) {
        setInsight(data);
        if (data.conversation && data.conversation.length > 0) {
          setMessages(data.conversation);
        } else {
          setMessages([{
            id: 'init-1',
            sender: 'assistant',
            text: data.phaseDescription || 'Merhaba! Bugün size nasıl yardımcı olabilirim?',
            options: ['Bugün ne yemeliyim?', 'Semptomlarım normal mi?', 'Döngü evrem hakkında bilgi'],
            timestamp: 'Bugün',
          }]);
        }
      }
    } catch (e) {
      console.warn('Failed to load assistant daily insight', e);
      setLoadError('Asistan yüklenemedi. İnternet bağlantınızı ve backend sunucusunu kontrol edin.');
      setInsight(null);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyInsight();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    if (hasConsent === false) {
      Alert.alert(
        'Açık Rıza Gerekli',
        'Yapay zekâ asistanı ile soru-cevap yapabilmek için lütfen yukarıdaki bilgilendirme kutusundaki "Anladım ve Kabul Ediyorum" onayını verin.',
      );
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Şimdi',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const payload = {
        question: text.trim(),
        history: messages.slice(-8).map((m) => ({ sender: m.sender, text: m.text })),
      };
      const res = await apiClient.post<any>('/api/assistant/chat', payload);
      const msg = res?.data || res;
      if (msg && msg.text) {
        setMessages(prev => [...prev, msg as ChatMessage]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: 'Şu anda yanıt üretemedim. Bağlantıyı kontrol edip tekrar deneyin — uydurma sağlık tavsiyesi vermiyorum.',
          options: ['Semptom kaydet', 'Makalelere göz at'],
          timestamp: 'Şimdi',
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleOptionPress = (opt: string) => {
    if (opt === 'Semptom kaydet' || opt === 'Semptom ekle') {
      router.push('/period/symptoms');
    } else if (opt === 'Makalelere göz at' || opt === 'Daha fazla bilgi') {
      router.push('/tabs/articles');
    } else if (opt === 'Partnerime yaz' || opt === 'Partnerimle paylaş') {
      router.push('/story/couple-chat');
    } else if (opt === 'Gebelik takibi') {
      router.push('/pregnancy');
    } else {
      sendMessage(opt);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: isDark ? colors.card : '#F3F4F6', borderColor: colors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>

          <View style={[styles.avatarRow, { flex: 1, marginLeft: 10 }]}>
            <BrandLogo size={36} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                {insight?.title || 'Pusena Asistanı'}
              </Text>
              <View style={styles.statusRow}>
                <View style={styles.onlineDot} />
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                  {insight?.phaseName || 'Sağlık Rehberi'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.actionPill, { backgroundColor: isDark ? colors.card : '#F3F4F6' }]}
            onPress={() => router.push('/period/symptoms')}
          >
            <Ionicons name="add" size={16} color={Colors.floPink} />
            <Text style={[styles.actionPillText, { color: Colors.floPink }]}>Semptom</Text>
          </Pressable>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase Hero Card */}
        {insight && (
          <View
            style={[
              styles.phaseCard,
              {
                backgroundColor: isDark ? colors.card : '#FFFFFF',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.phaseCardHeader}>
              <View style={[styles.phaseTag, { backgroundColor: Colors.floPinkLight }]}>
                <Ionicons name="calendar-outline" size={13} color={Colors.floPink} />
                <Text style={styles.phaseTagText}>
                  {insight.mode === 'pregnancy'
                    ? `${insight.cycleDay}. Hafta`
                    : `Döngü Günü ${insight.cycleDay}`}
                </Text>
              </View>
              <Text style={[styles.phaseNameBadge, { color: Colors.floPink }]}>
                {insight.phaseName}
              </Text>
            </View>

            <Text style={[styles.phaseHeadline, { color: colors.text }]}>
              {insight.headline || 'Bugün Bedeninizde Neler Oluyor?'}
            </Text>
            <Text style={[styles.phaseDesc, { color: colors.textMuted }]}>
              {insight.phaseDescription || insight.cardPrompt}
            </Text>
          </View>
        )}

        {/* AI Consent Card */}
        {hasConsent === false && (
          <View
            style={[
              styles.consentCard,
              {
                backgroundColor: isDark ? colors.card : '#FFF8F9',
                borderColor: Colors.floPink + '40',
              },
            ]}
          >
            <View style={styles.consentHeader}>
              <View style={[styles.consentIconCircle, { backgroundColor: Colors.floPinkLight }]}>
                <Ionicons name="sparkles" size={18} color={Colors.floPink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.consentTitle, { color: colors.text }]}>Yapay Zekâ Asistanı Açık Rıza</Text>
                <Text style={[styles.consentSub, { color: colors.textMuted }]}>Groq AI ile Güvenli Veri İşleme</Text>
              </View>
            </View>
            <Text style={[styles.consentBody, { color: colors.textSecondary }]}>
              Pusena Sağlık Asistanı genel bilgilendirme amacıyla Groq AI altyapısını kullanır.{'\n\n'}
              🔒 <Text style={{ fontWeight: '700' }}>Kimlik Verisi Paylaşılmaz:</Text> Adınız, e-postanız gibi kişisel kimlik bilgileriniz asla AI servisine aktarılmaz.{'\n\n'}
              🩺 <Text style={{ fontWeight: '700' }}>Tıbbi Sorumluluk Reddi:</Text> Yanıtlar bilgilendirme amaçlıdır; tıbbi tanı veya klinik tavsiye yerine geçmez.
            </Text>
            <Pressable style={[styles.consentBtn, { backgroundColor: Colors.floPink }]} onPress={handleAcceptConsent}>
              <Text style={styles.consentBtnText}>Anladım ve Kabul Ediyorum ✨</Text>
            </Pressable>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.floPink} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Asistan hazırlanıyor...
            </Text>
          </View>
        ) : loadError ? (
          <View style={styles.loadingBox}>
            <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.loadingText, { color: colors.textMuted, textAlign: 'center', paddingHorizontal: 24 }]}>
              {loadError}
            </Text>
            <Pressable style={[styles.retryBtn, { backgroundColor: Colors.floPink }]} onPress={fetchDailyInsight}>
              <Text style={{ color: '#FFF', fontWeight: '700' }}>Tekrar Dene</Text>
            </Pressable>
          </View>
        ) : (
          messages.map(msg => {
            const isAsst = msg.sender === 'assistant';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isAsst ? styles.assistantWrapper : styles.userWrapper,
                ]}
              >
                {isAsst && (
                  <View style={[styles.msgAvatar, { backgroundColor: Colors.floPinkLight }]}>
                    <Ionicons name="flower-outline" size={14} color={Colors.floPink} />
                  </View>
                )}
                <View style={{ maxWidth: '82%' }}>
                  <View
                    style={[
                      styles.messageBubble,
                      isAsst
                        ? [
                            styles.asstBubble,
                            {
                              backgroundColor: isDark ? colors.card : '#FFFFFF',
                              borderColor: colors.border,
                            },
                          ]
                        : [styles.userBubble, { backgroundColor: Colors.floPink }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: isAsst ? colors.text : '#FFFFFF' },
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>

                  {/* Options Chips */}
                  {isAsst && msg.options && msg.options.length > 0 && (
                    <View style={styles.optionsRow}>
                      {msg.options.map((opt, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.optChip,
                            {
                              backgroundColor: isDark ? colors.card : '#FFF0F3',
                              borderColor: Colors.floPinkLight,
                            },
                          ]}
                          onPress={() => handleOptionPress(opt)}
                        >
                          <Text style={styles.optChipText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  {/* Flag / Report AI response */}
                  {isAsst && (
                    <Pressable
                      onPress={() => setReportingMsg(msg)}
                      style={styles.flagBtn}
                      hitSlop={8}
                    >
                      <Ionicons name="flag-outline" size={11} color={colors.textMuted} />
                      <Text style={[styles.flagBtnText, { color: colors.textMuted }]}>Yanıtı Bildir</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })
        )}

        {isSending && (
          <View style={[styles.messageWrapper, styles.assistantWrapper]}>
            <View style={[styles.msgAvatar, { backgroundColor: Colors.floPinkLight }]}>
              <Ionicons name="flower-outline" size={14} color={Colors.floPink} />
            </View>
            <View
              style={[
                styles.messageBubble,
                styles.asstBubble,
                { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border },
              ]}
            >
              <ActivityIndicator size="small" color={Colors.floPink} />
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Input Bar */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderTopColor: colors.border,
            paddingBottom: keyboardOverlap > 0 ? 12 : Math.max(insets.bottom, 12),
            marginBottom: keyboardOverlap,
          },
        ]}
      >
        <TextInput
          style={[
            styles.chatInput,
            {
              backgroundColor: isDark ? '#2D2030' : '#F9F7F8',
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Asistana bir soru sorun..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage(inputText)}
          onFocus={() => setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 120)}
          returnKeyType="send"
        />
        <Pressable
          style={[
            styles.sendBtn,
            {
              backgroundColor: inputText.trim() ? Colors.floPink : colors.border,
            },
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isSending}
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* AI Report Modal */}
      <Modal
        visible={!!reportingMsg}
        transparent
        animationType="fade"
        onRequestClose={() => setReportingMsg(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconBox, { backgroundColor: Colors.floPinkLight }]}>
                <Ionicons name="flag" size={18} color={Colors.floPink} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Yapay Zekâ Yanıtını Bildir</Text>
            </View>
            <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
              Bu yanıt neden uygunsuz veya yanıltıcı? Lütfen gerekçeyi seçin:
            </Text>
            {[
              'Hatalı veya Yanıltıcı Tıbbi Bilgi',
              'Güvensiz Sağlık Önerisi',
              'Uygunsuz Dil veya İfade',
              'Alakasız / Anlamsız Yanıt',
            ].map((r) => (
              <Pressable
                key={r}
                style={[
                  styles.reasonOption,
                  {
                    backgroundColor: reportReason === r ? Colors.floPink + '15' : isDark ? colors.background : '#F9FAFB',
                    borderColor: reportReason === r ? Colors.floPink : colors.border,
                  },
                ]}
                onPress={() => setReportReason(r)}
              >
                <Ionicons
                  name={reportReason === r ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={reportReason === r ? Colors.floPink : colors.textMuted}
                />
                <Text
                  style={[
                    styles.reasonText,
                    { color: colors.text, fontWeight: reportReason === r ? '700' : '500' },
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            ))}
            <View style={styles.modalBtnRow}>
              <Pressable
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setReportingMsg(null)}
              >
                <Text style={[styles.modalCancelText, { color: colors.textMuted }]}>İptal</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmitBtn, { backgroundColor: Colors.floPink }]}
                onPress={submitReport}
                disabled={isSubmittingReport}
              >
                {isSubmittingReport ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.modalSubmitText}>Bildir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.06)' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  assistantAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.floTeal },
  headerSubtitle: { fontSize: 12 },
  actionPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  actionPillText: { fontSize: 12, fontWeight: '700' },
  chatScroll: { paddingHorizontal: 16, paddingTop: 16 },
  phaseCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  phaseCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  phaseTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  phaseTagText: { fontSize: 11, fontWeight: '700', color: Colors.floPink },
  phaseNameBadge: { fontSize: 12, fontWeight: '800' },
  phaseHeadline: { fontSize: 16, fontWeight: '800', lineHeight: 22, marginBottom: 4 },
  phaseDesc: { fontSize: 13, lineHeight: 18 },
  loadingBox: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, marginTop: 8 },
  retryBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  messageWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', gap: 8 },
  assistantWrapper: { justifyContent: 'flex-start' },
  userWrapper: { justifyContent: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  asstBubble: { borderWidth: 1, borderBottomLeftRadius: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 20 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  optChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  optChipText: { fontSize: 12, fontWeight: '600', color: Colors.floPink },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  chatInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  flagBtnText: {
    fontSize: 11,
  },
  consentCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  consentIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  consentSub: {
    fontSize: 11.5,
  },
  consentBody: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  consentBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  consentBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  modalIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 13,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});

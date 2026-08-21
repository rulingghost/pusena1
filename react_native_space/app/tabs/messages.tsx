import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { apiClient } from '@/src/api/client';
import { invokeAssistantChat, isAssistantEdgeConfigured } from '@/src/api/assistantEdge';
import { useRouter } from 'expo-router';
import { BrandLogo } from '@/src/components/BrandLogo';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  options?: string[];
  timestamp: string;
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [insight, setInsight] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

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
      let msg: { text?: string } | null = null;
      if (isAssistantEdgeConfigured()) {
        msg = await invokeAssistantChat(payload);
      } else {
        const res = await apiClient.post<any>('/api/assistant/chat', payload);
        msg = res?.data || res;
      }
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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
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
            paddingBottom: Math.max(insets.bottom, 12),
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
    </KeyboardAvoidingView>
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
});

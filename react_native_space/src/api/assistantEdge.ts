import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const TOKEN_KEY = process.env.EXPO_PUBLIC_AUTH_TOKEN_KEY ?? 'auth_token';

export function isAssistantEdgeConfigured(): boolean {
  return false;
}

export async function invokeAssistantChat(params: {
  question: string;
  history: Array<{ sender?: string; text?: string }>;
}): Promise<{ id: string; sender: 'assistant'; text: string; options?: string[]; timestamp: string }> {
  if (!isAssistantEdgeConfigured()) {
    throw new Error('Supabase asistan yapılandırması eksik');
  }

  const userToken = await AsyncStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${SUPABASE_URL}/functions/v1/assistant-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...(userToken ? { 'x-pusena-token': userToken } : {}),
    },
    body: JSON.stringify(params),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.text) {
    throw new Error(typeof data?.error === 'string' ? data.error : 'Asistan yanıtı alınamadı');
  }
  return data;
}

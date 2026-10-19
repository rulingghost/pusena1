import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/src/theme/colors';

export type CoupleTool = {
  id: string;
  title: string;
  sub: string;
  icon: string;
  route?: string;
  color: string;
  note?: string;
  custom?: boolean;
};

const KEY = 'couple_tools_v1';

export const DEFAULT_COUPLE_TOOLS: CoupleTool[] = [
  { id: 'chat', title: 'Sohbet', sub: 'Sadece ikiniz', icon: 'chatbubble-ellipses', route: '/story/couple-chat', color: Colors.relationship },
  { id: 'requests', title: 'İstekler', sub: 'Masaj, huzur', icon: 'hand-left', route: '/story/couple-requests', color: Colors.floPink },
  { id: 'location', title: 'Konum', sub: 'Açıkken paylaşılır', icon: 'location', route: '/story/couple-location', color: Colors.floTeal },
  { id: 'dailyq', title: 'Günün sorusu', sub: 'Her gün bir soru', icon: 'chatbubbles', route: '/story/daily-questions', color: Colors.relationship },
  { id: 'memories', title: 'Anılar', sub: 'Dönüm noktaları', icon: 'camera', route: '/story/memories', color: Colors.floPink },
  { id: 'notes', title: 'Notlar', sub: 'Aşk ve teşekkür', icon: 'mail', route: '/story/love-notes', color: Colors.floPurple },
  { id: 'guide', title: 'Rehber', sub: 'Nasıl destek olunur', icon: 'people', route: '/story/partner-guide', color: '#0284C7' },
];

type Stored = { hidden: string[]; custom: CoupleTool[] };

async function read(): Promise<Stored> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { hidden: [], custom: [] };
    const parsed = JSON.parse(raw) as Stored;
    return { hidden: parsed.hidden ?? [], custom: parsed.custom ?? [] };
  } catch {
    return { hidden: [], custom: [] };
  }
}

async function write(data: Stored) {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function loadCoupleTools(): Promise<{ visible: CoupleTool[]; hidden: CoupleTool[] }> {
  const stored = await read();
  const defaults = DEFAULT_COUPLE_TOOLS.filter((t) => !stored.hidden.includes(t.id));
  const hidden = DEFAULT_COUPLE_TOOLS.filter((t) => stored.hidden.includes(t.id));
  return { visible: [...defaults, ...stored.custom], hidden };
}

export async function hideCoupleTool(id: string) {
  const stored = await read();
  if (DEFAULT_COUPLE_TOOLS.some((t) => t.id === id)) {
    if (!stored.hidden.includes(id)) stored.hidden.push(id);
  } else {
    stored.custom = stored.custom.filter((t) => t.id !== id);
  }
  await write(stored);
}

export async function restoreCoupleTool(id: string) {
  const stored = await read();
  stored.hidden = stored.hidden.filter((x) => x !== id);
  await write(stored);
}

export async function addCustomCoupleTool(tool: Omit<CoupleTool, 'id' | 'custom'>) {
  const stored = await read();
  stored.custom.push({
    ...tool,
    id: `c-${Date.now()}`,
    custom: true,
    color: tool.color || Colors.floPurple,
  });
  await write(stored);
}

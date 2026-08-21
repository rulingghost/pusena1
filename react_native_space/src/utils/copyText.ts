import { Share } from 'react-native';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    const Clipboard = await import('expo-clipboard');
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    try {
      await Share.share({ message: text });
    } catch {
      /* ignore */
    }
    return false;
  }
}

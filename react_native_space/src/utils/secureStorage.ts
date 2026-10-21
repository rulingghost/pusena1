import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Platform-aware secure storage.
 * Uses Keychain on iOS and Keystore on Android via expo-secure-store.
 * Gracefully falls back to AsyncStorage on web or when SecureStore is unavailable.
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  try {
    const val = await SecureStore.getItemAsync(key);
    if (val !== null) return val;
    // Fallback & automatic migration check from AsyncStorage
    const legacyVal = await AsyncStorage.getItem(key);
    if (legacyVal !== null) {
      // Migrate to SecureStore silently
      await SecureStore.setItemAsync(key, legacyVal).catch(() => {});
      await AsyncStorage.removeItem(key).catch(() => {});
      return legacyVal;
    }
    return null;
  } catch {
    return AsyncStorage.getItem(key);
  }
}

export async function removeSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(key).catch(() => {}),
      AsyncStorage.removeItem(key).catch(() => {}),
    ]);
  } catch {
    await AsyncStorage.removeItem(key).catch(() => {});
  }
}

/**
 * Expo Go SDK 53+ throws when the main `expo-notifications` barrel loads,
 * because it auto-registers remote push tokens (removed from Expo Go).
 * Local scheduling still works if we import only those modules.
 */
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import cancelScheduledNotificationAsync from 'expo-notifications/build/cancelScheduledNotificationAsync';
import getAllScheduledNotificationsAsync from 'expo-notifications/build/getAllScheduledNotificationsAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import getPresentedNotificationsAsync from 'expo-notifications/build/getPresentedNotificationsAsync';
import dismissNotificationAsync from 'expo-notifications/build/dismissNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
} from 'expo-notifications/build/NotificationChannelManager.types';

try {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  /* yerel gösterici yoksa sessizce geç */
}

export const Notifications = {
  setNotificationHandler,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  setNotificationChannelAsync,
  getPresentedNotificationsAsync,
  dismissNotificationAsync,
  SchedulableTriggerInputTypes,
  AndroidImportance,
  AndroidNotificationVisibility,
};

export {
  setNotificationHandler,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  setNotificationChannelAsync,
  getPresentedNotificationsAsync,
  dismissNotificationAsync,
  SchedulableTriggerInputTypes,
  AndroidImportance,
  AndroidNotificationVisibility,
};

/**
 * Expo Go SDK 53 throws if remote push modules load.
 * Metro remaps those files here so local scheduling still works.
 */
export async function setAutoServerRegistrationEnabledAsync() {
  return undefined;
}

export function addPushTokenListener() {
  return { remove() {} };
}

export function addPushTokenReceivedListener() {
  return { remove() {} };
}

export default async function getExpoPushTokenAsync() {
  return { type: 'expo', data: '' };
}

export async function getDevicePushTokenAsync() {
  return { type: 'android', data: '' };
}

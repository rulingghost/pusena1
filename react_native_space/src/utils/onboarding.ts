import { settingsControllerCompleteSetup } from '@/src/api/generated/api';

/** Kurulumu kapatıp ana ekrana geçmek için tek yer. */
export async function finishOnboarding(refreshUser: () => Promise<void>) {
  await settingsControllerCompleteSetup();
  await refreshUser();
}

import { Stack } from 'expo-router';
import { PartnerGate } from '@/src/components/PartnerGate';

export default function StoryLayout() {
  return (
    <PartnerGate>
      <Stack screenOptions={{ headerShown: false }} />
    </PartnerGate>
  );
}

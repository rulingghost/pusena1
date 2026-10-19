import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/src/contexts/AuthContext';
import { startPartnerLocationShare, stopPartnerLocationShare } from '@/src/location/backgroundShare';

const SHARING_FLAG = 'partner_location_sharing';

/**
 * Paylaşımın açık olup olmadığını yerel bayraktan okur.
 *
 * Eskiden bu bileşen `useCoupleLocation` ile 45 saniyede bir sunucuya soruyordu;
 * paylaşım kapalı olan kullanıcılarda bile sürekli istek üretiyordu.
 */
export function PartnerLocationSync() {
  const { isAuthenticated } = useAuth();
  const applied = useRef<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      applied.current = null;
      stopPartnerLocationShare();
      return;
    }

    AsyncStorage.getItem(SHARING_FLAG)
      .then((flag) => {
        if (cancelled) return;
        const enabled = flag === '1';
        if (applied.current === enabled) return;
        applied.current = enabled;
        if (enabled) startPartnerLocationShare();
        else stopPartnerLocationShare();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return null;
}

export async function setLocationSharingFlag(enabled: boolean) {
  await AsyncStorage.setItem(SHARING_FLAG, enabled ? '1' : '0').catch(() => {});
}

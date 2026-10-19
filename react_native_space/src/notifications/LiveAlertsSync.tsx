import { useAuth } from '@/src/contexts/AuthContext';
import { useLiveAlerts } from '@/src/notifications/useLiveAlerts';

export function LiveAlertsSync() {
  const { isAuthenticated } = useAuth();
  useLiveAlerts(isAuthenticated);
  return null;
}

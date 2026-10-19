import { useEffect } from 'react';
import { useSettingsControllerGetSettings, useSpecialDatesControllerGetAll, usePregnancyControllerGet, usePeriodControllerGet } from '@/src/api/generated/api';
import { syncBloomAlerts, syncDailyQuestionAlert, type AlertPrefs } from '@/src/notifications/bloomAlerts';
import { useCoupleQuestions } from '@/src/api/bloomClient';

export function useBloomAlertSync(enabled: boolean) {
  const { data: settings } = useSettingsControllerGetSettings({ query: { enabled } });
  const { data: dates } = useSpecialDatesControllerGetAll({ page: 1, limit: 50 }, { query: { enabled } });
  const { data: pregnancy } = usePregnancyControllerGet({ query: { enabled, retry: false } });
  const { data: period } = usePeriodControllerGet({ query: { enabled, retry: false } });
  const { data: coupleQ } = useCoupleQuestions(enabled);

  useEffect(() => {
    if (!enabled || !settings?.notifications) return;
    const n = settings.notifications as unknown as Partial<AlertPrefs> & Record<string, unknown>;
    const prefs: AlertPrefs = {
      medicationReminder: n.medicationReminder !== false,
      countdownReminder: n.countdownReminder !== false,
      specialDateReminder: n.specialDateReminder !== false,
      periodReminder: n.periodReminder !== false,
      reminderOffsets: Array.isArray(n.reminderOffsets) ? n.reminderOffsets : [30, 7, 3, 1],
    };

    const specialDates = (dates?.items ?? []).map((d) => ({
      id: d.id,
      title: d.title,
      date: new Date(d.date),
    }));

    const due = (pregnancy as any)?.dueDate ? new Date((pregnancy as any).dueDate) : null;
    const nextPeriodRaw = (period as any)?.currentCycle?.nextPeriodDate ?? (period as any)?.nextPeriodDate;
    const nextPeriod = nextPeriodRaw ? new Date(nextPeriodRaw) : null;

    syncBloomAlerts({ prefs, specialDates, dueDate: due, nextPeriod })
      .then(() => syncDailyQuestionAlert(!!coupleQ?.today?.myAnswer))
      .catch(() => {});
  }, [enabled, settings, dates, pregnancy, period, coupleQ?.today?.myAnswer]);
}

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/src/contexts/ThemeContext';
import { Colors } from '@/src/theme/colors';

const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const toValidDate = (val: unknown): Date => {
  if (!val) return new Date();
  if (val instanceof Date) return isNaN(val.getTime()) ? new Date() : val;
  const parsed = new Date(String(val));
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date | string | null;
  currentDate?: Date | string | null;
  value?: Date | string | null;
  maxDate?: Date | string | null;
  minDate?: Date | string | null;
  accentColor?: string;
}

type ViewMode = 'calendar' | 'year' | 'month';

export function DatePickerModal({
  visible,
  onClose,
  onSelect,
  selectedDate,
  currentDate,
  value,
  maxDate,
  minDate,
  accentColor,
}: DatePickerModalProps) {
  const { colors } = useAppTheme();
  const accent = accentColor ?? Colors.primary;

  const targetDate = useMemo(() => toValidDate(selectedDate ?? currentDate ?? value), [selectedDate, currentDate, value]);
  const max = useMemo(() => (maxDate ? toValidDate(maxDate) : undefined), [maxDate]);
  const min = useMemo(() => (minDate ? toValidDate(minDate) : undefined), [minDate]);

  const [viewDate, setViewDate] = useState<Date>(targetDate);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  useEffect(() => {
    if (visible) {
      setViewDate(targetDate);
      setViewMode('calendar');
    }
  }, [visible, targetDate]);

  const year = isNaN(viewDate.getFullYear()) ? new Date().getFullYear() : viewDate.getFullYear();
  const month = isNaN(viewDate.getMonth()) ? new Date().getMonth() : viewDate.getMonth();

  // Year range for picker
  const currentYear = new Date().getFullYear();
  const minYear = min ? min.getFullYear() : (currentYear - 60);
  const maxYear = max ? max.getFullYear() : (currentYear + 10);

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = maxYear; y >= minYear; y--) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [year, month]);

  const prevYear = () => {
    const d = new Date(year - 1, month, 1);
    if (min && d < new Date(min.getFullYear(), min.getMonth(), 1)) return;
    setViewDate(d);
  };

  const nextYear = () => {
    const d = new Date(year + 1, month, 1);
    if (max && d > new Date(max.getFullYear(), max.getMonth() + 1, 0)) return;
    setViewDate(d);
  };

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    if (min && d < new Date(min.getFullYear(), min.getMonth(), 1)) return;
    setViewDate(d);
  };

  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    if (max && d > new Date(max.getFullYear(), max.getMonth() + 1, 0)) return;
    setViewDate(d);
  };

  const isSelected = (day: number) => {
    return targetDate.getDate() === day && targetDate.getMonth() === month && targetDate.getFullYear() === year;
  };

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (max && d > max) return true;
    if (min && d < min) return true;
    return false;
  };

  const isToday = (day: number) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;
  };

  const handleSelect = (day: number) => {
    if (isDisabled(day)) return;
    const d = new Date(year, month, day, 12, 0, 0);
    onSelect(d);
    onClose();
  };

  const handleMonthSelect = (m: number) => {
    setViewDate(new Date(year, m, 1));
    setViewMode('calendar');
  };

  const handleYearSelect = (y: number) => {
    setViewDate(new Date(y, month, 1));
    setViewMode('calendar');
  };

  const isMonthDisabled = (m: number) => {
    if (min && year === min.getFullYear() && m < min.getMonth()) return true;
    if (max && year === max.getFullYear() && m > max.getMonth()) return true;
    return false;
  };

  const displayMonth = MONTHS_TR[month] || 'Ocak';
  const displayYear = String(year);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modal, { backgroundColor: colors.card }]} onPress={() => {}}>
          {viewMode === 'calendar' ? (
            <>
              {/* Header - Yıl ve Ay Değiştirme Butonları */}
              <View style={styles.calHeader}>
                <View style={styles.navGroup}>
                  <Pressable onPress={prevYear} style={styles.navBtn} hitSlop={6} accessibilityLabel="Önceki Yıl">
                    <Ionicons name="play-back" size={16} color={accent} />
                  </Pressable>
                  <Pressable onPress={prevMonth} style={styles.navBtn} hitSlop={6} accessibilityLabel="Önceki Ay">
                    <Ionicons name="chevron-back" size={20} color={accent} />
                  </Pressable>
                </View>

                <View style={styles.centerSelectors}>
                  <Pressable onPress={() => setViewMode('month')} style={[styles.monthYearBtn, { backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.calMonthText, { color: colors.text }]}>{displayMonth}</Text>
                    <Ionicons name="chevron-down" size={14} color={accent} style={{ marginLeft: 3 }} />
                  </Pressable>
                  <Pressable onPress={() => setViewMode('year')} style={[styles.monthYearBtn, { backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.calYearText, { color: accent, fontWeight: '700' }]}>{displayYear}</Text>
                    <Ionicons name="chevron-down" size={14} color={accent} style={{ marginLeft: 3 }} />
                  </Pressable>
                </View>

                <View style={styles.navGroup}>
                  <Pressable onPress={nextMonth} style={styles.navBtn} hitSlop={6} accessibilityLabel="Sonraki Ay">
                    <Ionicons name="chevron-forward" size={20} color={accent} />
                  </Pressable>
                  <Pressable onPress={nextYear} style={styles.navBtn} hitSlop={6} accessibilityLabel="Sonraki Yıl">
                    <Ionicons name="play-forward" size={16} color={accent} />
                  </Pressable>
                </View>
              </View>

              {/* Day headers */}
              <View style={styles.dayHeaders}>
                {DAYS_TR.map((d) => (
                  <Text key={d} style={[styles.dayHeader, { color: colors.textMuted }]}>{d}</Text>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={styles.grid}>
                {calendarDays.map((day, idx) => (
                  <View key={idx} style={styles.dayCell}>
                    {day !== null ? (
                      <Pressable
                        style={[
                          styles.dayBtn,
                          isSelected(day) && { backgroundColor: accent },
                          isToday(day) && !isSelected(day) && { borderWidth: 1.5, borderColor: accent },
                        ]}
                        onPress={() => handleSelect(day)}
                        disabled={isDisabled(day)}
                      >
                        <Text style={[
                          styles.dayText,
                          { color: colors.text },
                          isSelected(day) && { color: '#fff', fontWeight: '700' },
                          isDisabled(day) && { color: colors.textMuted, opacity: 0.3 },
                          isToday(day) && !isSelected(day) && { color: accent, fontWeight: '700' },
                        ]}>{day}</Text>
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Pressable style={[styles.todayBtn, { borderColor: accent }]} onPress={() => {
                  const today = new Date();
                  setViewDate(today);
                  if (!max || today <= max) {
                    onSelect(today);
                    onClose();
                  }
                }}>
                  <Text style={[styles.todayText, { color: accent }]}>Bugün</Text>
                </Pressable>
                <Pressable style={[styles.closeBtn, { backgroundColor: accent }]} onPress={onClose}>
                  <Text style={styles.closeBtnText}>Kapat</Text>
                </Pressable>
              </View>
            </>
          ) : viewMode === 'year' ? (
            /* Year Picker Grid */
            <>
              <View style={styles.pickerHeader}>
                <Pressable onPress={() => setViewMode('calendar')} style={styles.navBtn}>
                  <Ionicons name="arrow-back" size={22} color={accent} />
                </Pressable>
                <Text style={[styles.pickerTitle, { color: colors.text }]}>Yıl Seçin</Text>
                <View style={{ width: 36 }} />
              </View>

              <ScrollView style={styles.yearGridScroll} contentContainerStyle={styles.yearGrid}>
                {years.map((y) => (
                  <Pressable
                    key={y}
                    style={[
                      styles.yearCell,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      year === y && { backgroundColor: accent, borderColor: accent },
                    ]}
                    onPress={() => handleYearSelect(y)}
                  >
                    <Text style={[
                      styles.yearCellText,
                      { color: colors.text },
                      year === y && { color: '#fff', fontWeight: '700' },
                    ]}>{y}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            /* Month Picker Grid */
            <>
              <View style={styles.pickerHeader}>
                <Pressable onPress={() => setViewMode('calendar')} style={styles.navBtn}>
                  <Ionicons name="arrow-back" size={22} color={accent} />
                </Pressable>
                <Text style={[styles.pickerTitle, { color: colors.text }]}>{displayYear} Yılı - Ay Seçin</Text>
                <View style={{ width: 36 }} />
              </View>

              <View style={styles.monthGrid}>
                {MONTHS_TR.map((m, idx) => (
                  <Pressable
                    key={m}
                    style={[
                      styles.monthChip,
                      { backgroundColor: colors.inputBg },
                      month === idx && { backgroundColor: accent },
                      isMonthDisabled(idx) && { opacity: 0.3 },
                    ]}
                    onPress={() => handleMonthSelect(idx)}
                    disabled={isMonthDisabled(idx)}
                  >
                    <Text style={[
                      styles.monthChipText,
                      { color: colors.text },
                      month === idx && { color: '#fff', fontWeight: '700' },
                    ]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { borderRadius: 24, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navBtn: { padding: 6, borderRadius: 8 },
  centerSelectors: { flexDirection: 'row', gap: 6 },
  monthYearBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  calMonthText: { fontSize: 15, fontWeight: '600' },
  calYearText: { fontSize: 15 },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, padding: 2 },
  dayBtn: { flex: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  todayBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, height: 44, justifyContent: 'center', alignItems: 'center' },
  todayText: { fontSize: 14, fontWeight: '700' },
  closeBtn: { flex: 1, borderRadius: 12, height: 44, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pickerTitle: { fontSize: 18, fontWeight: '700' },
  yearGridScroll: { maxHeight: 260 },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 10 },
  yearCell: { width: '22.5%', paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  yearCellText: { fontSize: 15, fontWeight: '600' },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 10 },
  monthChip: { width: '30.5%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  monthChipText: { fontSize: 14, fontWeight: '600' },
});

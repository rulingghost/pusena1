import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/useTheme';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertState = {
  title: string;
  message?: string;
  buttons: AlertButton[];
};

type ShowFn = (title: string, message?: string, buttons?: AlertButton[]) => void;

const AlertCtx = createContext<ShowFn>(() => {});

export function useAppAlert() {
  return useContext(AlertCtx);
}

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const { colors, isDark } = useTheme();
  const [state, setState] = useState<AlertState | null>(null);

  const show = useCallback<ShowFn>((title, message, buttons) => {
    const list = buttons?.length ? buttons : [{ text: 'Tamam', style: 'default' as const }];
    setState({ title, message, buttons: list });
  }, []);

  const close = useCallback((btn?: AlertButton) => {
    setState(null);
    btn?.onPress?.();
  }, []);

  React.useEffect(() => {
    const original = Alert.alert;
    Alert.alert = ((title: string, message?: string, buttons?: AlertButton[]) => {
      show(title, message, buttons);
    }) as typeof Alert.alert;
    return () => {
      Alert.alert = original;
    };
  }, [show]);

  const value = useMemo(() => show, [show]);

  return (
    <AlertCtx.Provider value={value}>
      {children}
      <Modal visible={!!state} transparent animationType="fade" onRequestClose={() => close()}>
        <View style={styles.overlay}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.accent, { backgroundColor: Colors.primary }]} />
            <Text style={[styles.title, { color: colors.text }]}>{state?.title}</Text>
            {!!state?.message && (
              <Text style={[styles.message, { color: colors.textSecondary }]}>{state.message}</Text>
            )}
            <View style={styles.actions}>
              {state?.buttons.map((btn, idx) => {
                const destructive = btn.style === 'destructive';
                const cancel = btn.style === 'cancel';
                const primary = !destructive && !cancel && (state.buttons.length === 1 || idx === state.buttons.length - 1);
                return (
                  <Pressable
                    key={`${btn.text}-${idx}`}
                    onPress={() => close(btn)}
                    style={[
                      styles.btn,
                      primary && { backgroundColor: Colors.primary },
                      destructive && { backgroundColor: Colors.danger },
                      cancel && { backgroundColor: isDark ? colors.inputBg : Colors.floPinkLight, borderWidth: 1, borderColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        { color: primary || destructive ? '#fff' : colors.text },
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertCtx.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 12, 24, 0.45)',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    borderWidth: 1,
  },
  accent: { height: 3, width: 42, borderRadius: 2, marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  message: { fontSize: 14, lineHeight: 21, marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  btn: { minHeight: 42, paddingHorizontal: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 14, fontWeight: '800' },
});

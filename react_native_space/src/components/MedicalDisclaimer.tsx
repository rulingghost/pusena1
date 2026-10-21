import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';

export interface MedicalDisclaimerProps {
  variant?: 'fertility' | 'pregnancy' | 'general';
  style?: StyleProp<ViewStyle>;
}

export function MedicalDisclaimer({ variant = 'general', style }: MedicalDisclaimerProps) {
  const { colors, isDark } = useTheme();

  const getDetails = () => {
    switch (variant) {
      case 'fertility':
        return {
          icon: 'flower-outline' as const,
          color: Colors.period,
          bgColor: isDark ? '#3D1C28' : '#FFF0F3',
          borderColor: Colors.period + '30',
          title: 'Yasal ve Tıbbi Uyarı',
          text: 'Bu takvim ve doğurganlık hesaplamaları istatistiki tahminlere dayanır; kesin doğum kontrol yöntemi veya tıbbi tanı niteliği taşımaz. Sağlık kararlarınız için mutlaka bir hekime danışınız.',
        };
      case 'pregnancy':
        return {
          icon: 'shield-checkmark-outline' as const,
          color: Colors.pregnancy,
          bgColor: isDark ? '#3D2D20' : '#FFF5E6',
          borderColor: Colors.pregnancy + '35',
          title: 'Genel Bilgilendirme',
          text: 'Gebelik haftası ve gelişim rehberi genel bilgilendirme amaçlıdır; klinik tanı, ultrason veya doktor tavsiyesi yerine geçmez. Acil durumlarda derhal sağlık kuruluşuna başvurunuz.',
        };
      case 'general':
      default:
        return {
          icon: 'information-circle-outline' as const,
          color: Colors.primary,
          bgColor: isDark ? '#2D1B33' : '#FFF8F9',
          borderColor: Colors.primary + '25',
          title: 'Tıbbi Sorumluluk Reddi',
          text: 'Pusena sağlık ve takip araçları yalnızca kişisel farkındalık ve kayıt tutma amaçlıdır; tıbbi teşhis veya tedavi sunmaz. Sağlık endişelerinizde daima doktorunuza danışınız.',
        };
    }
  };

  const details = getDetails();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: details.bgColor,
          borderColor: details.borderColor,
        },
        style,
      ]}
    >
      <View style={styles.iconBox}>
        <Ionicons name={details.icon} size={18} color={details.color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: details.color }]}>{details.title}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>{details.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  iconBox: {
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  text: {
    fontSize: 11.5,
    lineHeight: 16.5,
  },
});

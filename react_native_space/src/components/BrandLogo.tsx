import React from 'react';
import { Image, View, StyleSheet, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';

const LOGO = require('@/assets/images/pusena-logo.png');

const SIZES = {
  xs: 28,
  sm: 48,
  md: 88,
  lg: 132,
  xl: 168,
} as const;

type SizeKey = keyof typeof SIZES;

interface BrandLogoProps {
  size?: SizeKey | number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function BrandLogo({ size = 'md', style, imageStyle }: BrandLogoProps) {
  const dim = typeof size === 'number' ? size : SIZES[size];
  return (
    <View style={[{ width: dim, height: dim }, styles.wrap, style]}>
      <Image
        source={LOGO}
        style={[{ width: dim, height: dim }, imageStyle]}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Pusena"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

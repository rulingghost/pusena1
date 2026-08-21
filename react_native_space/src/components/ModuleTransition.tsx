import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

/** Modül değişiminde kısa fade. Eski içerik kaybolmadan önce tutulur; beyaz boşluk olmaz. */
export function ModuleTransition({
  activeKey,
  children,
  backgroundColor,
}: {
  activeKey: string;
  children: React.ReactNode;
  backgroundColor?: string;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const prevKey = useRef(activeKey);
  const childrenRef = useRef(children);
  childrenRef.current = children;
  const [display, setDisplay] = useState(children);

  useEffect(() => {
    if (prevKey.current === activeKey) {
      setDisplay(children);
    }
  }, [children, activeKey]);

  useEffect(() => {
    if (prevKey.current === activeKey) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 8, duration: 150, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished) return;
      prevKey.current = activeKey;
      setDisplay(childrenRef.current);
      translateY.setValue(-6);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  }, [activeKey, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], backgroundColor }}>
      {display}
    </Animated.View>
  );
}

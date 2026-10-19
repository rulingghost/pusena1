import { useEffect, useState } from 'react';
import { Keyboard, Platform, useWindowDimensions, type KeyboardEvent } from 'react-native';

/**
 * Klavyenin pencerenin altını ne kadar kapattığını (px) döndürür.
 *
 * `KeyboardAvoidingView` yerine bunu kullanıyoruz: Android'de pencere zaten
 * küçülüyorsa örtüşme 0 çıkar, küçülmüyorsa (edge-to-edge) gerçek yükseklik
 * çıkar. Böylece iki platformda da yazı alanı klavyenin altında kalmaz.
 */
export function useKeyboardOverlap() {
  const { height: windowHeight } = useWindowDimensions();
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const apply = (event: KeyboardEvent) => {
      const endY = event.endCoordinates?.screenY ?? windowHeight;
      setOverlap(Math.max(0, Math.round(windowHeight - endY)));
    };
    const reset = () => setOverlap(0);

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, apply);
    const hideSub = Keyboard.addListener(hideEvent, reset);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [windowHeight]);

  return overlap;
}

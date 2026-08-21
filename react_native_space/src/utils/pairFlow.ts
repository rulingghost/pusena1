import { Alert } from 'react-native';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { genderLabelTr } from '@/src/utils/gender';

export async function confirmPartnerPair(opts: {
  partnerCode: string;
  myGender?: string | null;
  onNeedGender: () => void;
}): Promise<boolean> {
  if (!opts.myGender) {
    Alert.alert(
      'Önce cinsiyetiniz',
      'Çift eşleşmesinde genellikle bir kadın ve bir erkek partner olur. Eşleşmeden önce profilinizde cinsiyetinizi kaydedin.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Profili aç', onPress: opts.onNeedGender },
      ],
    );
    return false;
  }

  try {
    const preview = await customFetch<{ name: string; gender: string | null; sameGender?: boolean }>(
      '/api/relationship/lookup',
      { method: 'POST', body: JSON.stringify({ partnerCode: opts.partnerCode }) },
    );
    const theirGender = genderLabelTr(preview.gender);
    const sameNote = preview.sameGender
      ? `\n\nİkiniz de ${theirGender} görünüyorsunuz. Bu uygulamada çiftler genelde kadın + erkek olarak eşleşir. Yine de devam edebilirsiniz.`
      : `\n\nÇiftlerde genelde bir kadın ve bir erkek partner olur. ${preview.name} profili: ${theirGender}.`;

    return await new Promise((resolve) => {
      Alert.alert(
        'Eşleşmeyi onayla',
        `${preview.name} ile bağlanmak üzeresiniz.${sameNote}`,
        [
          { text: 'Vazgeç', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Eşleş', onPress: () => resolve(true) },
        ],
      );
    });
  } catch (e) {
    Alert.alert('Eşleştirme', getErrorMessage(e, 'Partner kodu doğrulanamadı.'));
    return false;
  }
}

const appJson = require('./app.json');

/**
 * Sunucu adresi tek yerden gelir: app.json > extra.productionApiUrl.
 * Yayın (preview/production) derlemelerinde her zaman bu adres gömülür, böylece
 * kullanıcı hiçbir şey girmez. Yalnızca yerel geliştirmede .env içindeki
 * EXPO_PUBLIC_API_URL (LAN IP) öne geçer.
 *
 * Gizli anahtar (Groq, JWT, Google) buraya KONULMAZ.
 */
const PRODUCTION_API_URL = appJson.expo.extra?.productionApiUrl ?? null;
const isReleaseBuild = process.env.APP_ENV === 'preview' || process.env.APP_ENV === 'production';

const apiUrl = isReleaseBuild
  ? PRODUCTION_API_URL
  : process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API_URL;

module.exports = () => ({
  ...appJson.expo,
  extra: {
    ...(appJson.expo.extra || {}),
    apiUrl,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? null,
    eas: {
      ...(appJson.expo.extra?.eas || {}),
      projectId: process.env.EAS_PROJECT_ID || appJson.expo.extra?.eas?.projectId,
    },
  },
});

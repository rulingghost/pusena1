const appJson = require('./app.json');

function isPrivateApiUrl(url) {
  if (!url) return true;
  try {
    const href = /^https?:\/\//i.test(url) ? url : `http://${url}`;
    const host = new URL(href).hostname;
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.local') ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    );
  } catch {
    return true;
  }
}

/**
 * Sunucu adresi tek yerden gelir: app.json > extra.productionApiUrl.
 * Ev ağı (192.168...) gömülmez; başka şehirdeki kullanıcı o adrese ulaşamaz.
 * Yerel API yalnızca gizli "Sunucu adresi" ekranından o cihaza yazılır.
 */
module.exports = ({ config }) => {
  const base = { ...appJson.expo, ...config };
  const PRODUCTION_API_URL = base.extra?.productionApiUrl ?? 'https://pusena-api-live.onrender.com';
  const isReleaseBuild =
    process.env.APP_ENV === 'preview' || process.env.APP_ENV === 'production';
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  const apiUrl = isReleaseBuild
    ? PRODUCTION_API_URL
    : fromEnv && !isPrivateApiUrl(fromEnv)
      ? fromEnv
      : PRODUCTION_API_URL;

  return {
    ...base,
    extra: {
      ...(base.extra || {}),
      apiUrl,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? null,
      eas: {
        ...(base.extra?.eas || {}),
        projectId: process.env.EAS_PROJECT_ID || base.extra?.eas?.projectId,
      },
    },
  };
};

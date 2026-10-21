import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: (failureCount, error) => {
        const status = (error as { status?: number } | undefined)?.status;
        if (status === 401 || status === 404) return false;
        return failureCount < 1;
      },
    },
  },
});

/**
 * Kullanıcı değiştiğinde veya çıkış yapıldığında bellekteki tüm sorgu ve bekleyen
 * mutasyonları güvenli biçimde durdurup temizler.
 */
export async function resetQueryClientForUserChange(): Promise<void> {
  try {
    // Devam eden arka plan veya ön plan sorgu isteklerini iptal et
    await queryClient.cancelQueries();
  } catch {
    /* sessizce geç */
  }

  try {
    // Bekleyen mutasyonları iptal et ve temizle
    queryClient.getMutationCache().clear();
  } catch {
    /* sessizce geç */
  }

  try {
    // Önbellekteki tüm sorgu kayıtlarını sıfırla
    queryClient.clear();
  } catch {
    /* sessizce geç */
  }
}

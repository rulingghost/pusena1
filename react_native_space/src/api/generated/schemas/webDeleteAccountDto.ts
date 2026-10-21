// @ts-nocheck

export interface WebDeleteAccountDto {
  /** Kayıtlı e-posta adresi */
  email: string;
  /** Hesap şifresi */
  password: string;
  /** Hesap silme nedeni */
  reason?: string;
  /** Ek açıklama veya not */
  note?: string;
}

// @ts-nocheck

export interface ReportAssistantResponseDto {
  /** Şikayet edilen asistan mesaj IDsi */
  messageId?: string;
  /** Kullanıcının sorduğu soru */
  question?: string;
  /** Şikayet edilen yapay zeka yanıt metni */
  responseText: string;
  /** Şikayet nedeni */
  reason: string;
}

// @ts-nocheck
import type { ChatMessageItemDto } from './chatMessageItemDto';

export interface ChatAssistantDto {
  /** Kullanıcının asistan sorusu */
  question: string;
  /** Önceki mesaj geçmişi */
  history?: ChatMessageItemDto[];
}

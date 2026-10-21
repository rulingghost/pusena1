// @ts-nocheck

export type RelationshipControllerListMessagesParams = {
/**
 * Sayfa numarası (varsayılan: 1)
 */
page?: number;
/**
 * Sayfa başına mesaj (varsayılan: 50, azami: 100)
 */
limit?: number;
/**
 * Cursor ISO tarih filtresi
 */
before?: string;
};

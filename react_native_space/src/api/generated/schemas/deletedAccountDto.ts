// @ts-nocheck

export interface DeletedAccountDto {
  id: string;
  email: string;
  name: string;
  reason: string;
  /** @nullable */
  note: string | null;
  createdAt: string;
}

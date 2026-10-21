// @ts-nocheck

export type InsightItemDtoLevel = typeof InsightItemDtoLevel[keyof typeof InsightItemDtoLevel];


export const InsightItemDtoLevel = {
  info: 'info',
  tip: 'tip',
  warning: 'warning',
  danger: 'danger',
  success: 'success',
} as const;

import { customFetch } from './customFetch';

export const apiClient = {
  get: <T = any>(url: string) => customFetch<T>(url, { method: 'GET' }),
  post: <T = any>(url: string, body?: any) =>
    customFetch<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    }),
  patch: <T = any>(url: string, body?: any) =>
    customFetch<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    }),
  delete: <T = any>(url: string) => customFetch<T>(url, { method: 'DELETE' }),
};

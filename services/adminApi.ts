import { supabase } from '../lib/supabase';
import type { CreatePaymentIntentPayload } from '../types';

const postJson = async <TResponse>(url: string, payload: object): Promise<TResponse> => {
  const accessToken = (await supabase?.auth.getSession())?.data.session?.access_token;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as TResponse;
};

export const adminApi = {
  async requestAnalyticsExport(exportType: 'full' | 'orders') {
    return postJson<{ ok: boolean; message: string }>('/api/admin/export-analytics', { exportType });
  },

  async createPaymentIntent(payload: CreatePaymentIntentPayload) {
    return postJson<{ ok: boolean; intentId: string; orderId: string | null; amount: number; currency: string; checkoutUrl: string }>(
      '/api/payments/create-intent',
      payload
    );
  },

  async confirmPaymentIntent(payload: { intentId: string; orderId?: string | null }) {
    return postJson<{ ok: boolean; orderStatus: string; message: string; intentId: string; orderId: string | null }>(
      '/api/payments/confirm-intent',
      payload
    );
  },
};

import type { Currency, OrderStatus, PaymentStatus } from '../../types';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const MAX_AMOUNT = 50_000_000;
export const MAX_QUANTITY_PER_ITEM = 99;

export const resolveMarketFromCurrency = (currency: Currency) =>
  currency === 'PLN' ? 'Poland' : 'Nigeria';

export const orderStatusFromPaymentStatus = (status: PaymentStatus): OrderStatus => {
  switch (status) {
    case 'succeeded':
      return 'Confirmed';
    case 'failed':
    case 'refunded':
      return 'Cancelled';
    default:
      return 'Processing';
  }
};

export const applyPaymentUpdate = async (payload: {
  eventId: string;
  intentId: string;
  status: PaymentStatus;
  providerReference?: string | null;
  source: string;
  rawPayload: Record<string, unknown>;
  orderId?: string | null;
}) => {
  if (!supabaseAdmin) {
    return { ok: false, reason: 'supabase_unavailable' as const };
  }

  const { data: existingEvent } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('event_id', payload.eventId)
    .maybeSingle();

  if (existingEvent?.id) {
    return { ok: true, deduplicated: true as const };
  }

  await supabaseAdmin.from('webhook_events').insert({
    event_id: payload.eventId,
    payment_intent_id: payload.intentId,
    payload: {
      ...payload.rawPayload,
      source: payload.source,
    },
  });

  await supabaseAdmin
    .from('payments')
    .update({
      status: payload.status,
      ...(payload.providerReference ? { provider_reference: payload.providerReference } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('payment_intent_id', payload.intentId);

  const resolvedOrderId =
    payload.orderId ??
    (
      await supabaseAdmin
        .from('payments')
        .select('order_id')
        .eq('payment_intent_id', payload.intentId)
        .maybeSingle()
    ).data?.order_id ??
    null;

  if (resolvedOrderId) {
    await supabaseAdmin
      .from('orders')
      .update({
        status: orderStatusFromPaymentStatus(payload.status),
        updated_at: new Date().toISOString(),
      })
      .eq('id', resolvedOrderId);
  }

  return { ok: true, deduplicated: false as const, orderId: resolvedOrderId };
};

export const resolveCatalogPricing = async (
  items: Array<{ product_id: string; quantity: number }>,
  currency: Currency
) => {
  if (!supabaseAdmin) return { ok: false as const, message: 'Database configuration is required for checkout.' };

  const productIds = [...new Set(items.map((item) => item.product_id))];
  if (productIds.length === 0) {
    return { ok: false as const, message: 'Checkout cart is empty.' };
  }

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, price_ngn, price_pln, status, is_published')
    .in('id', productIds);

  if (error) {
    return { ok: false as const, message: 'Unable to verify cart pricing.' };
  }

  const productMap = new Map(
    (products ?? []).map((product) => [product.id as string, product as {
      id: string;
      name: string;
      price_ngn: number;
      price_pln: number;
      status: string;
      is_published: boolean;
    }])
  );

  let total = 0;
  const normalizedItems: Array<{
    product_id: string;
    quantity: number;
    unit_price_ngn: number;
    unit_price_pln: number;
    product_name: string;
  }> = [];

  for (const item of items) {
    const product = productMap.get(item.product_id);
    if (!product || !product.is_published || product.status === 'Out of Stock') {
      return { ok: false as const, message: 'One or more cart items are unavailable.' };
    }

    const quantity = Math.min(Math.max(1, Math.floor(Number(item.quantity))), MAX_QUANTITY_PER_ITEM);
    const unitPriceNgn = Number(product.price_ngn ?? 0);
    const unitPricePln = Number(product.price_pln ?? 0);
    const lineTotal = quantity * (currency === 'NGN' ? unitPriceNgn : unitPricePln);
    total += lineTotal;

    normalizedItems.push({
      product_id: item.product_id,
      quantity,
      unit_price_ngn: unitPriceNgn,
      unit_price_pln: unitPricePln,
      product_name: product.name,
    });
  }

  if (!Number.isFinite(total) || total <= 0 || total > MAX_AMOUNT) {
    return { ok: false as const, message: 'Calculated checkout amount is invalid.' };
  }

  return {
    ok: true as const,
    total,
    items: normalizedItems,
  };
};

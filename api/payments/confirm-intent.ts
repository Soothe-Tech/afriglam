import type { VercelRequest, VercelResponse } from '@vercel/node';
import { badRequest, methodNotAllowed, serverError, unauthorized } from '../_utils/http';
import { logger } from '../../lib/logger';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { getUserFromRequest } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const intentId = String(req.body?.intentId ?? '');
  const orderId = String(req.body?.orderId ?? '');
  if (!intentId.startsWith('intent_')) {
    return badRequest(res, 'Invalid intent id');
  }

  try {
    if (supabaseAdmin) {
      const user = await getUserFromRequest(req);
      if (!user) return unauthorized(res, 'Authentication required to confirm payment');

      let resolvedOrderId = orderId;
      if (!resolvedOrderId) {
        const { data: payment } = await supabaseAdmin
          .from('payments')
          .select('order_id')
          .eq('payment_intent_id', intentId)
          .maybeSingle();
        resolvedOrderId = payment?.order_id ?? '';
      }
      if (resolvedOrderId) {
        const { data: order } = await supabaseAdmin.from('orders').select('user_id').eq('id', resolvedOrderId).single();
        if (order && order.user_id !== user.id) {
          const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role !== 'ADMIN') {
            return unauthorized(res, 'Not authorized to confirm this order');
          }
        }
      }

      const { data: paymentRow } = await supabaseAdmin
        .from('payments')
        .select('status, provider')
        .eq('payment_intent_id', intentId)
        .maybeSingle();

      const provider = paymentRow?.provider ?? 'mockpay';
      if (provider !== 'mockpay') {
        return res.status(200).json({
          ok: true,
          orderStatus: paymentRow?.status === 'succeeded' ? 'Confirmed' : 'Processing',
          intentId,
          orderId: orderId || null,
          message: 'Payment status is updated by the payment provider. Refresh to see latest.',
        });
      }

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'succeeded',
          provider_reference: `mockpay_${Date.now()}`,
          updated_at: new Date().toISOString(),
        })
        .eq('payment_intent_id', intentId)
        .neq('status', 'succeeded');

      if (resolvedOrderId) {
        await supabaseAdmin
          .from('orders')
          .update({
            status: 'Confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', resolvedOrderId);
      }
    }

    return res.status(200).json({
      ok: true,
      orderStatus: 'Confirmed',
      intentId,
      orderId: orderId || null,
      message: 'Payment confirmed and order finalized',
    });
  } catch (error) {
    logger.error('confirm_intent_failed', { error: String(error), intentId, orderId });
    return serverError(res, 'Failed to confirm payment');
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserFromRequest } from '../_utils/auth';
import { badRequest, methodNotAllowed, unauthorized, serviceUnavailable } from '../_utils/http';
import { logger } from '../../lib/logger';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

const allowedTypes = new Set(['full', 'orders']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const exportType = String(req.body?.exportType ?? 'full');
  if (!allowedTypes.has(exportType)) {
    return badRequest(res, 'Invalid export type');
  }

  if (!supabaseAdmin) {
    return serviceUnavailable(res, 'Analytics export requires database configuration');
  }

  const user = await getUserFromRequest(req);
  if (!user) return unauthorized(res);
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'ADMIN') {
    return unauthorized(res, 'Admin access required');
  }

  logger.info('analytics_export_requested', { exportType });

  return res.status(200).json({
    ok: true,
    message: exportType === 'orders' ? 'Orders export queued.' : 'Full analytics export queued.',
    fileUrl: null,
  });
}

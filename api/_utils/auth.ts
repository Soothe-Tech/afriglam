import type { VercelRequest } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const getBearerToken = (req: VercelRequest): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  if (!header.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
};

export const getUserFromRequest = async (req: VercelRequest) => {
  const token = getBearerToken(req);
  if (!token || !supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
};

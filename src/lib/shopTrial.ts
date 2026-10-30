import { createHash } from 'crypto';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FREE_BOOKS = 2;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export function requestIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfIp = req.headers.get('cf-connecting-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || cfIp || '127.0.0.1';
}

function ipHash(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

function trialToken(ip: string, orderId: string): string {
  const safeOrder = (orderId || 'book').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48);
  return `shoptrial_${ipHash(ip)}_${safeOrder}`;
}

async function usedCount(ip: string): Promise<number | null> {
  const prefix = `shoptrial_${ipHash(ip)}_`;
  const { count, error } = await supabase
    .from('orders')
    .select('order_token', { count: 'exact', head: true })
    .like('order_token', `${prefix}%`);
  if (error) {
    console.warn('[SHOP_TRIAL_COUNT]', error.message);
    return null;
  }
  return count || 0;
}

export async function shopTrialRemaining(ip: string): Promise<{ remaining: number; allowed: boolean; reason?: string }> {
  const used = await usedCount(ip);
  if (used === null) {
    return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
  }
  const remaining = Math.max(0, FREE_BOOKS - used);
  return {
    remaining,
    allowed: remaining > 0,
    reason: remaining > 0 ? undefined : 'This connection already used its 2 free shop books.',
  };
}

export async function reserveShopTrial(ip: string, orderId: string, shopName: string): Promise<{ remaining: number; allowed: boolean; reason?: string }> {
  const token = trialToken(ip, orderId);
  const { data: existing, error: existingError } = await supabase
    .from('orders')
    .select('order_token')
    .eq('order_token', token)
    .maybeSingle();

  if (existingError) {
    console.warn('[SHOP_TRIAL_LOOKUP]', existingError.message);
    return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
  }

  const status = await shopTrialRemaining(ip);
  if (existing) return { remaining: status.remaining, allowed: true };

  if (!status.allowed) return status;

  const { error } = await supabase.from('orders').insert([
    {
      order_token: token,
      child_name: (shopName || 'Shop').slice(0, 80),
      theme: 'shop-trial',
      package_size: '8',
      orientation: 'portrait',
      status: 'completed',
      pdf_url: null,
    },
  ]);

  if (error) {
    if (error.code === '23505' || /duplicate|unique/i.test(error.message)) {
      return { remaining: Math.max(0, status.remaining - 1), allowed: true };
    }
    console.warn('[SHOP_TRIAL_INSERT]', error.message);
    return { remaining: 0, allowed: false, reason: 'Could not save the free book. Try again in a moment.' };
  }

  return { remaining: Math.max(0, status.remaining - 1), allowed: true };
}

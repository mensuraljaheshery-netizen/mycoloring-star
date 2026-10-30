import { createHash } from 'crypto';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { shopSlug } from '@/lib/shop';

type ShopTrialResult = { remaining: number; allowed: boolean; reason?: string };

const FREE_BOOKS = 2;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
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

function missingTable(message: string): boolean {
  return /shop_activity|schema cache|does not exist|could not find the table/i.test(message);
}

async function freeBooksOnIp(ip: string): Promise<number | 'missing' | null> {
  const { count, error } = await supabase
    .from('shop_activity')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('kind', 'free');
  if (error) {
    if (missingTable(error.message)) return 'missing';
    console.warn('[SHOP_ACTIVITY_COUNT]', error.message);
    return null;
  }
  return count || 0;
}

async function legacyUsed(ip: string): Promise<number | null> {
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

function statusFromUsed(used: number) {
  const remaining = Math.max(0, FREE_BOOKS - used);
  return {
    remaining,
    allowed: remaining > 0,
    reason: remaining > 0 ? undefined : 'This connection already used its 2 free shop books.',
  };
}

export async function shopTrialRemaining(ip: string): Promise<ShopTrialResult> {
  const used = await freeBooksOnIp(ip);
  if (used === 'missing') {
    const legacy = await legacyUsed(ip);
    if (legacy === null) return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
    return statusFromUsed(legacy);
  }
  if (used === null) return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
  return statusFromUsed(used);
}

export async function reserveShopTrial(ip: string, orderId: string, shopName: string): Promise<ShopTrialResult> {
  const token = trialToken(ip, orderId);
  const name = (shopName || 'Shop').slice(0, 80);
  const { data: existing, error: existingError } = await supabase
    .from('shop_activity')
    .select('order_token')
    .eq('order_token', token)
    .maybeSingle();

  if (existingError && missingTable(existingError.message)) {
    return reserveLegacy(ip, orderId, name);
  }
  if (existingError) {
    console.warn('[SHOP_ACTIVITY_LOOKUP]', existingError.message);
    return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
  }

  const status = await shopTrialRemaining(ip);
  if (existing) return { remaining: status.remaining, allowed: true };
  if (!status.allowed) return status;

  const { error } = await supabase.from('shop_activity').insert([
    {
      shop_name: name,
      slug: shopSlug(name),
      ip_address: ip,
      order_token: token,
      kind: 'free',
    },
  ]);

  if (error) {
    if (error.code === '23505' || /duplicate|unique/i.test(error.message)) {
      return { remaining: Math.max(0, status.remaining - 1), allowed: true };
    }
    console.warn('[SHOP_ACTIVITY_INSERT]', error.message);
    return { remaining: 0, allowed: false, reason: 'Could not save the shop book. Try again in a moment.' };
  }

  return { remaining: Math.max(0, status.remaining - 1), allowed: true };
}

async function reserveLegacy(ip: string, orderId: string, shopName: string): Promise<ShopTrialResult> {
  const token = trialToken(ip, orderId);
  const { data: existing, error: existingError } = await supabase
    .from('orders')
    .select('order_token')
    .eq('order_token', token)
    .maybeSingle();
  if (existingError) {
    return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
  }
  const used = await legacyUsed(ip);
  if (used === null) return { remaining: 0, allowed: false, reason: 'Could not check the free books. Try again in a moment.' };
  const status = statusFromUsed(used);
  if (existing) return { remaining: status.remaining, allowed: true };
  if (!status.allowed) return status;
  const { error } = await supabase.from('orders').insert([
    {
      order_token: token,
      child_name: shopName,
      theme: 'shop-trial',
      package_size: '8',
      orientation: 'portrait',
      status: 'completed',
      pdf_url: null,
    },
  ]);
  if (error && !(error.code === '23505' || /duplicate|unique/i.test(error.message))) {
    return { remaining: 0, allowed: false, reason: 'Could not save the free book. Try again in a moment.' };
  }
  return { remaining: Math.max(0, status.remaining - 1), allowed: true };
}

export type ShopSummary = {
  shopName: string;
  ipAddress: string;
  freeBooks: number;
  paidBooks: number;
  firstSeen: string;
  lastSeen: string;
};

export async function listShops(): Promise<{ shops: ShopSummary[]; error?: string }> {
  const { data, error } = await supabase
    .from('shop_activity')
    .select('shop_name, ip_address, kind, created_at')
    .order('created_at', { ascending: false })
    .limit(300);

  if (error) {
    return {
      shops: [],
      error: missingTable(error.message)
        ? 'The shop_activity table is not in Supabase yet. Run the SQL once, then refresh.'
        : error.message,
    };
  }

  const grouped = new Map<string, ShopSummary>();
  for (const row of data || []) {
    const key = `${row.shop_name}|${row.ip_address}`;
    const seen = row.created_at || '';
    const current = grouped.get(key) || {
      shopName: row.shop_name,
      ipAddress: row.ip_address,
      freeBooks: 0,
      paidBooks: 0,
      firstSeen: seen,
      lastSeen: seen,
    };
    if (row.kind === 'paid') current.paidBooks += 1;
    else current.freeBooks += 1;
    if (seen < current.firstSeen) current.firstSeen = seen;
    if (seen > current.lastSeen) current.lastSeen = seen;
    grouped.set(key, current);
  }

  return { shops: Array.from(grouped.values()) };
}

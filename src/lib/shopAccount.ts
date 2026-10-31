import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { cleanShopName, shopSlug } from '@/lib/shop';

const COOKIE = 'mcs_shop';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const SHOP_CREDIT_PACKS: Record<string, { books: number; url?: string }> = {
  shop_15: { books: 10, url: process.env.WHOP_PAYLINK_SHOP_15 || 'https://whop.com/checkout/plan_RkPjeG1sLebpi' },
  shop_30: { books: 25, url: process.env.WHOP_PAYLINK_SHOP_30 },
  shop_60: { books: 60, url: process.env.WHOP_PAYLINK_SHOP_60 },
};

type Details = Record<string, unknown>;

export type ShopAccount = {
  slug: string;
  shopName: string;
  email: string;
  credits: number;
};

function secret() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mcs-shop-session';
}

function readDetails(raw: unknown): Details {
  if (!raw || typeof raw !== 'string') return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

export function checkPassword(password: string, stored: string) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const next = crypto.scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, 'hex');
  if (next.length !== prev.length) return false;
  return crypto.timingSafeEqual(next, prev);
}

export function sessionCookieValue(slug: string) {
  const exp = Date.now() + 180 * 24 * 60 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ slug, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function slugFromCookie(value: string | undefined) {
  if (!value || !value.includes('.')) return '';
  const [body, sig] = value.split('.');
  const expected = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return '';
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!parsed?.slug || Number(parsed.exp) < Date.now()) return '';
    return String(parsed.slug);
  } catch {
    return '';
  }
}

export const SHOP_COOKIE = COOKIE;

function accountFromRow(row: { slug: string; shop_name: string; details: unknown } | null): ShopAccount | null {
  if (!row) return null;
  const details = readDetails(row.details);
  return {
    slug: row.slug,
    shopName: row.shop_name,
    email: String(details.email || ''),
    credits: Math.max(0, Number(details.credits || 0)),
  };
}

export async function findShopBySlug(slug: string) {
  const { data, error } = await supabase
    .from('shop_profiles')
    .select('slug, shop_name, details')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return { row: null, error: error.message };
  return { row: data, error: '' };
}

function nameKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function listShops() {
  const { data, error } = await supabase.from('shop_profiles').select('slug, shop_name, details').limit(500);
  return { rows: data || [], error: error?.message || '' };
}

async function connectionAlreadyUsed(ip: string) {
  if (!ip || ip === '127.0.0.1') return false;
  const { count, error } = await supabase
    .from('shop_activity')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .in('kind', ['signup', 'free']);
  if (!error && (count || 0) > 0) return true;
  const shops = await listShops();
  return shops.rows.some((row) => String(readDetails(row.details).signupIp || '') === ip);
}

async function rememberSignup(slug: string, shopName: string, ip: string) {
  if (!ip) return;
  await supabase.from('shop_activity').insert([{
    shop_name: shopName,
    slug,
    ip_address: ip,
    order_token: `signup_${slug}`,
    kind: 'signup',
  }]);
}

export async function findShopByEmail(email: string) {
  const shops = await listShops();
  if (shops.error) return { row: null, error: shops.error };
  const row = shops.rows.find((item) => String(readDetails(item.details).email || '').toLowerCase() === email);
  return { row: row || null, error: '' };
}

export async function createShopAccount(shopName: string, email: string, password: string, ip = '') {
  const name = cleanShopName(shopName);
  const slug = shopSlug(name);
  const normalized = email.trim().toLowerCase();
  if (name.length < 2 || !normalized.includes('@') || password.length < 6) {
    return { account: null, note: '', error: 'Use a shop name, a real email, and a password of at least 6 characters.' };
  }
  const existingEmail = await findShopByEmail(normalized);
  if (existingEmail.error) return { account: null, note: '', error: existingEmail.error };
  if (existingEmail.row) return { account: null, note: '', error: 'That email already has a shop. Log in instead.' };
  const shops = await listShops();
  if (shops.error) return { account: null, note: '', error: shops.error };
  const key = nameKey(name);
  if (shops.rows.some((row) => row.slug === slug || nameKey(row.shop_name) === key)) {
    return { account: null, note: '', error: 'That shop name is already used. Log in, or pick another name.' };
  }

  const alreadyUsed = await connectionAlreadyUsed(ip);
  const credits = alreadyUsed ? 0 : 2;
  const details = JSON.stringify({
    email: normalized,
    passwordHash: hashPassword(password),
    credits,
    plan: 'book',
    signupIp: ip,
    freeGranted: credits === 2,
  });
  const { error } = await supabase.from('shop_profiles').upsert(
    [{ slug, shop_name: name, details, updated_at: new Date().toISOString() }],
    { onConflict: 'slug' }
  );
  if (error) {
    const readable = /row-level security/i.test(error.message)
      ? 'The shop table is blocking new accounts. In Supabase, open SQL and run: alter table public.shop_profiles disable row level security;'
      : error.message;
    return { account: null, note: '', error: readable };
  }
  await rememberSignup(slug, name, ip);
  const note = credits === 2
    ? '2 free books are on this shop. Buy a pack when they are used.'
    : 'This connection already used the free books, so this shop starts at 0. Buy a pack to make books.';
  return { account: { slug, shopName: name, email: normalized, credits } as ShopAccount, note, error: '' };
}

export async function loginShopAccount(email: string, password: string, ip = '') {
  const found = await findShopByEmail(email.trim().toLowerCase());
  if (found.error) return { account: null, error: found.error };
  if (!found.row) return { account: null, error: 'No shop uses that email.' };
  const details = readDetails(found.row.details);
  if (!checkPassword(password, String(details.passwordHash || ''))) {
    return { account: null, error: 'Wrong password.' };
  }
  if (ip && !details.signupIp) {
    details.signupIp = ip;
    await writeDetails(found.row.slug, details);
    await rememberSignup(found.row.slug, found.row.shop_name, ip);
  }
  return { account: accountFromRow(found.row), error: '' };
}

export async function accountFromSlug(slug: string) {
  const found = await findShopBySlug(slug);
  if (found.error || !found.row) return null;
  const details = readDetails(found.row.details);
  if (!details.email || !details.passwordHash) return null;
  return accountFromRow(found.row);
}

async function writeDetails(slug: string, details: Details) {
  const { error } = await supabase
    .from('shop_profiles')
    .update({ details: JSON.stringify(details), updated_at: new Date().toISOString() })
    .eq('slug', slug);
  return error?.message || '';
}

export async function beginPack(slug: string, packKey: string) {
  const pack = SHOP_CREDIT_PACKS[packKey];
  if (!pack?.url) return { url: '', error: 'That pack is not ready yet.' };
  const found = await findShopBySlug(slug);
  if (found.error || !found.row) return { url: '', error: found.error || 'Log in first.' };
  const details = readDetails(found.row.details);
  details.pending = { pack: packKey, books: pack.books, at: Date.now() };
  const error = await writeDetails(slug, details);
  if (error) return { url: '', error };
  return { url: pack.url, error: '' };
}

export async function confirmPending(slug: string) {
  const found = await findShopBySlug(slug);
  if (found.error || !found.row) return { credits: 0, added: 0, error: found.error || 'Log in first.' };
  const details = readDetails(found.row.details);
  const pending = details.pending as { books?: number; at?: number } | undefined;
  const books = Math.max(0, Number(pending?.books || 0));
  const at = Number(pending?.at || 0);
  if (!books || Date.now() - at < 20000) {
    return { credits: Math.max(0, Number(details.credits || 0)), added: 0, error: '' };
  }
  const credits = Math.max(0, Number(details.credits || 0)) + books;
  details.credits = credits;
  details.bought = Math.max(0, Number(details.bought || 0)) + books;
  delete details.pending;
  const error = await writeDetails(slug, details);
  return { credits, added: error ? 0 : books, error };
}

export async function accountCredits(slug: string) {
  const found = await findShopBySlug(shopSlug(slug));
  if (!found.row) return 0;
  return Math.max(0, Number(readDetails(found.row.details).credits || 0));
}

export async function spendAccountCredit(slug: string) {
  const found = await findShopBySlug(shopSlug(slug));
  if (found.error || !found.row) return { ok: false, credits: 0 };
  const details = readDetails(found.row.details);
  const credits = Math.max(0, Number(details.credits || 0));
  if (credits < 1) return { ok: false, credits: 0 };
  details.credits = credits - 1;
  details.used = Math.max(0, Number(details.used || 0)) + 1;
  const error = await writeDetails(found.row.slug, details);
  if (error) return { ok: false, credits };
  return { ok: true, credits: credits - 1 };
}

export async function listShopAccounts() {
  const { data, error } = await supabase
    .from('shop_profiles')
    .select('slug, shop_name, details, updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);
  if (error) return { accounts: [], error: error.message };
  const accounts = (data || [])
    .map((row) => {
      const details = readDetails(row.details);
      if (!details.email) return null;
      return {
        shopName: row.shop_name,
        email: String(details.email),
        credits: Math.max(0, Number(details.credits || 0)),
        used: Math.max(0, Number(details.used || 0)),
        bought: Math.max(0, Number(details.bought || 0)),
        freeBooks: details.freeGranted ? 2 : 0,
        updatedAt: row.updated_at || '',
      };
    })
    .filter(Boolean);
  return { accounts, error: '' };
}

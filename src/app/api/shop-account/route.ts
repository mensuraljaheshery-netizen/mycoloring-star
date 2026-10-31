import { NextRequest, NextResponse } from 'next/server';
import { requestIp } from '@/lib/shopTrial';
import {
  SHOP_COOKIE,
  accountFromSlug,
  beginPack,
  confirmPending,
  createShopAccount,
  loginShopAccount,
  sessionCookieValue,
  slugFromCookie,
} from '@/lib/shopAccount';

export const dynamic = 'force-dynamic';

function withCookie(body: unknown, slug: string) {
  const res = NextResponse.json(body);
  res.cookies.set(SHOP_COOKIE, sessionCookieValue(slug), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 180 * 24 * 60 * 60,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const slug = slugFromCookie(req.cookies.get(SHOP_COOKIE)?.value);
  const account = slug ? await accountFromSlug(slug) : null;
  if (!account) return NextResponse.json({ account: null });
  const confirmed = await confirmPending(account.slug);
  return NextResponse.json({
    account: { ...account, credits: confirmed.error ? account.credits : confirmed.credits },
    added: confirmed.added,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || '');

  if (action === 'logout') {
    const res = NextResponse.json({ account: null });
    res.cookies.set(SHOP_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  }

  if (action === 'signup') {
    const ip = requestIp(req);
    const result = await createShopAccount(String(body.shopName || ''), String(body.email || ''), String(body.password || ''), ip);
    if (!result.account) return NextResponse.json({ error: result.error }, { status: 400 });
    return withCookie({ account: result.account, note: result.note }, result.account.slug);
  }

  if (action === 'login') {
    const result = await loginShopAccount(String(body.email || ''), String(body.password || ''), requestIp(req));
    if (!result.account) return NextResponse.json({ error: result.error }, { status: 400 });
    return withCookie({ account: result.account }, result.account.slug);
  }

  const slug = slugFromCookie(req.cookies.get(SHOP_COOKIE)?.value);
  if (!slug) return NextResponse.json({ error: 'Log in first.' }, { status: 401 });

  if (action === 'buy') {
    const result = await beginPack(slug, String(body.pack || ''));
    if (!result.url) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ checkoutUrl: result.url });
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}

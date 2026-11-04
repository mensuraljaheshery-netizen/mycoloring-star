import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requestIp } from '@/lib/shopTrial';
import {
  SHOP_COOKIE,
  accountFromSlug,
  applyPasswordReset,
  beginPack,
  confirmPending,
  createPasswordReset,
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

  if (action === 'forgot') {
    const result = await createPasswordReset(String(body.email || ''));
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: 'Password email is not set up yet. Write to support@mycoloringstar.com.' }, { status: 500 });
    }
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mycoloringstar.com';
    const resetUrl = `${origin.replace(/\/$/, '')}/business?reset=${encodeURIComponent(result.token)}`;
    const resend = new Resend(resendKey);
    const sender = process.env.NODE_ENV === 'production' && !process.env.RESEND_USE_ONBOARDING
      ? 'MyColoringStar <orders@mycoloringstar.com>'
      : 'MyColoringStar <onboarding@resend.dev>';
    const sent = await resend.emails.send({
      from: sender,
      to: [String(body.email || '').trim()],
      subject: 'Reset your MyColoringStar shop password',
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h1 style="font-size:22px;color:#0f172a">Reset the password for ${result.shopName}</h1>
        <p style="color:#475569;line-height:1.5">This link works for 2 hours. After you choose a new password, the old one stops working.</p>
        <p style="margin:28px 0"><a href="${resetUrl}" style="background:#f97316;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:bold">Choose a new password</a></p>
        <p style="color:#94a3b8;font-size:12px">If you did not ask for this, you can ignore the email.</p>
      </div>`,
    });
    if (sent.error) return NextResponse.json({ error: sent.error.message }, { status: 500 });
    return NextResponse.json({ sent: true });
  }

  if (action === 'reset') {
    const result = await applyPasswordReset(String(body.token || ''), String(body.password || ''));
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

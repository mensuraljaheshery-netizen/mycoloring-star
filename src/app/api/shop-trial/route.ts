import { NextRequest, NextResponse } from 'next/server';
import { accountCredits, spendAccountCredit } from '@/lib/shopAccount';
import { shopSlug } from '@/lib/shop';
import { requestIp, reserveShopTrial, shopTrialRemaining } from '@/lib/shopTrial';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const slug = shopSlug(req.nextUrl.searchParams.get('shop') || '');
  const status = await shopTrialRemaining(requestIp(req));
  const paid = slug ? await accountCredits(slug) : 0;
  return NextResponse.json({ ...status, remaining: status.remaining + paid, paid });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  const shopName = String(body.shopName || 'Shop');
  const slug = shopSlug(String(body.slug || shopName));
  if (!orderId) {
    return NextResponse.json({ allowed: false, remaining: 0, reason: 'Missing order.' }, { status: 400 });
  }
  const status = await reserveShopTrial(requestIp(req), orderId, shopName);
  const paidBefore = await accountCredits(slug);
  if (status.allowed) return NextResponse.json({ ...status, paid: paidBefore });
  const paid = await spendAccountCredit(slug);
  if (!paid.ok) {
    return NextResponse.json({ allowed: false, remaining: 0, reason: 'Ask the shop to add book credits.' }, { status: 403 });
  }
  return NextResponse.json({ allowed: true, remaining: paid.credits, paid: paid.credits });
}

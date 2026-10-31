import { NextRequest, NextResponse } from 'next/server';
import { accountCredits, spendAccountCredit } from '@/lib/shopAccount';
import { shopSlug } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const slug = shopSlug(req.nextUrl.searchParams.get('shop') || '');
  const paid = slug ? await accountCredits(slug) : 0;
  return NextResponse.json({ remaining: paid, paid, allowed: paid > 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  const slug = shopSlug(String(body.slug || body.shopName || ''));
  if (!orderId) {
    return NextResponse.json({ allowed: false, remaining: 0, reason: 'Missing order.' }, { status: 400 });
  }
  const paid = await spendAccountCredit(slug);
  if (!paid.ok) {
    return NextResponse.json({ allowed: false, remaining: 0, paid: 0, reason: 'Ask the shop to add book credits.' }, { status: 403 });
  }
  return NextResponse.json({ allowed: true, remaining: paid.credits, paid: paid.credits });
}
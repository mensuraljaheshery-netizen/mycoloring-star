import { NextRequest, NextResponse } from 'next/server';
import { requestIp, reserveShopTrial, shopTrialRemaining } from '@/lib/shopTrial';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const status = await shopTrialRemaining(requestIp(req));
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  const shopName = String(body.shopName || 'Shop');
  if (!orderId) {
    return NextResponse.json({ allowed: false, remaining: 0, reason: 'Missing order.' }, { status: 400 });
  }
  const status = await reserveShopTrial(requestIp(req), orderId, shopName);
  return NextResponse.json(status, { status: status.allowed ? 200 : 403 });
}

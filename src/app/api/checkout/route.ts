import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CHECKOUT_PAYLINKS: Record<string, string | undefined> = {
  // Single Books
  '4': process.env.WHOP_PAYLINK_4,
  '8': process.env.WHOP_PAYLINK_8,
  '16': process.env.WHOP_PAYLINK_16,
  '32': process.env.WHOP_PAYLINK_32,
  '48': process.env.WHOP_PAYLINK_48,

  // Second child, after a paid book: $3, $5, $8, $11
  '4s': process.env.WHOP_PAYLINK_4_SIBLING || 'https://whop.com/checkout/plan_x55BkgBOEVEO2',
  '8s': process.env.WHOP_PAYLINK_8_SIBLING || 'https://whop.com/checkout/plan_9EUcbKuvPC4Ii',
  '16s': process.env.WHOP_PAYLINK_16_SIBLING || 'https://whop.com/checkout/plan_v0WrfWW8t48Ny',
  '32s': process.env.WHOP_PAYLINK_32_SIBLING || 'https://whop.com/checkout/plan_5tXmuLK76QRCD',

  // 3-Book Bundles
  'bundle_3x16': process.env.WHOP_PAYLINK_BUNDLE_3X16,
  'bundle_3x32': process.env.WHOP_PAYLINK_BUNDLE_3X32,
  'bundle_3x48': process.env.WHOP_PAYLINK_BUNDLE_3X48,

  // $1.00 Test Tier (3 Kids x 3 Pages)
  'test_mini_3kids': process.env.WHOP_PAYLINK_TEST_MINI_3KIDS || process.env.WHOP_PAYLINK_8,
};

export async function GET() {
  const siblingReady = ['4s', '8s', '16s', '32s'].every((key) => Boolean(CHECKOUT_PAYLINKS[key]));
  return NextResponse.json({ siblingReady });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageSize } = body;

    const pkgKey = String(packageSize || '16');
    const fullPriceKey = pkgKey.endsWith('s') ? pkgKey.slice(0, -1) : '';
    const checkoutUrl = CHECKOUT_PAYLINKS[pkgKey] || (fullPriceKey ? CHECKOUT_PAYLINKS[fullPriceKey] : undefined) || CHECKOUT_PAYLINKS['16'];

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: `Checkout link for "${pkgKey}" is not configured in environment variables.` },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CHECKOUT_PAYLINKS: Record<string, string | undefined> = {
  // Single Books
  '4': process.env.WHOP_PAYLINK_4,
  '8': process.env.WHOP_PAYLINK_8,
  '16': process.env.WHOP_PAYLINK_16,
  '32': process.env.WHOP_PAYLINK_32,
  '48': process.env.WHOP_PAYLINK_48,

  // 3-Book Bundles
  'bundle_3x16': process.env.WHOP_PAYLINK_BUNDLE_3X16,
  'bundle_3x32': process.env.WHOP_PAYLINK_BUNDLE_3X32,
  'bundle_3x48': process.env.WHOP_PAYLINK_BUNDLE_3X48,

  // $1.00 Test Tier (3 Kids x 3 Pages)
  'test_mini_3kids': process.env.WHOP_PAYLINK_TEST_MINI_3KIDS || process.env.WHOP_PAYLINK_8,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageSize } = body;

    const pkgKey = String(packageSize || '16');
    const checkoutUrl = CHECKOUT_PAYLINKS[pkgKey] || CHECKOUT_PAYLINKS['16'];

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
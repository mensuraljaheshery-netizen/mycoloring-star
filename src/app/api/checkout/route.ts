import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const fourDollar = process.env.WHOP_PAYLINK_4;

const CHECKOUT_PAYLINKS: Record<string, string | undefined> = {
  '4': fourDollar,
  '8': fourDollar,
  '16': fourDollar,
  '32': fourDollar,
  '48': process.env.WHOP_PAYLINK_48,

  'bundle_3x16': process.env.WHOP_PAYLINK_BUNDLE_3X16,
  'bundle_3x32': process.env.WHOP_PAYLINK_BUNDLE_3X32,
  'bundle_3x48': process.env.WHOP_PAYLINK_BUNDLE_3X48,

  'test_mini_3kids': process.env.WHOP_PAYLINK_TEST_MINI_3KIDS || fourDollar,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pkgKey = String(body.packageSize || '4').replace(/s$/, '');
    const checkoutUrl = CHECKOUT_PAYLINKS[pkgKey] || fourDollar;

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
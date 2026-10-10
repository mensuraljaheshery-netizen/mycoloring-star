import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// CANONICAL SERVER-SIDE PRICING (Tamper-Proof)
export const SERVER_PACKAGES: Record<string, { pages: number; priceCents: number; priceFormatted: string; name: string }> = {
  '8': { pages: 8, priceCents: 899, priceFormatted: '$8.99', name: 'Starter Edition (8 Interior Pages + Cover)' },
  '16': { pages: 16, priceCents: 1299, priceFormatted: '$12.99', name: 'Standard Edition (16 Interior Pages + Cover)' },
  '32': { pages: 32, priceCents: 2199, priceFormatted: '$21.99', name: 'Deluxe Edition (32 Interior Pages + Cover)' },
  '48': { pages: 48, priceCents: 2999, priceFormatted: '$29.99', name: 'Surprise Variety Mega Pack (48 Interior Pages + Cover)' }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageId, themeSlug, childName, orientation, format, hasPhoto } = body;

    if (!packageId || !SERVER_PACKAGES[packageId]) {
      return NextResponse.json({ error: 'Invalid or missing package selection.' }, { status: 400 });
    }

    if (!themeSlug) {
      return NextResponse.json({ error: 'Please choose an adventure theme.' }, { status: 400 });
    }

    if (!hasPhoto) {
      return NextResponse.json({ error: 'A child face photo is required to create your personalized coloring book.' }, { status: 400 });
    }

    const pkg = SERVER_PACKAGES[packageId];
    const orderId = 'mcs_' + crypto.randomBytes(8).toString('hex');

    // STRUCTURED ORDER RECORD (Ready for Suby Payment Integration)
    const orderRecord = {
      orderId,
      status: 'ready_for_payment',
      paymentStatus: 'unpaid',
      customer: {
        childName: (childName || 'Hero').trim(),
        hasPhotoUploaded: Boolean(hasPhoto)
      },
      product: {
        productType: 'MyColoringStar Personalized Coloring Book',
        packageId,
        packageName: pkg.name,
        interiorPages: pkg.pages,
        totalPages: pkg.pages + 1, // Interior pages + 1 cover
        themeSlug,
        format: format || 'digital',
        orientation: orientation || 'portrait'
      },
      pricing: {
        currency: 'USD',
        amountCents: pkg.priceCents,
        amountFormatted: pkg.priceFormatted,
        shippingCents: 0,
        shippingFormatted: '$0.00 (Instant Digital Delivery)'
      },
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      order: orderRecord
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to initialize order.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('suby-signature') || req.headers.get('x-suby-signature');
    const secret = process.env.SUBY_WEBHOOK_SECRET;

    // Optional signature verification
    if (secret && signature) {
      const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      if (computed !== signature && !signature.includes(computed)) {
        console.warn('Suby signature verification mismatch');
      }
    }

    const event = JSON.parse(rawBody);

    // Handle payment succeeded & checkout completed events
    if (
      event.type === 'payment.succeeded' ||
      event.type === 'checkout.session.completed' ||
      event.status === 'paid' ||
      event.event === 'order.completed'
    ) {
      const data = event.data || event;
      const metadata = data.metadata || {};

      console.log('Payment Confirmed via Suby:', {
        id: data.id,
        amount: data.amount,
        metadata
      });

      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await supabase.from('free_book_claims').insert([
          {
            fingerprint: `suby-paid-${data.id || Date.now()}`,
            ip_address: 'suby-payment',
            email: data.customer_email || metadata.email || null,
            child_name: metadata.childName || 'Hero',
            theme_slug: (metadata.theme || 'custom').toLowerCase().replace(/\s+/g, '-'),
            total_downloads: 0
          }
        ]);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Suby Webhook Processing Error:', err);
    return NextResponse.json({ error: err.message || 'Webhook error' }, { status: 400 });
  }
}
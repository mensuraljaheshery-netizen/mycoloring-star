import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const { orderToken, childName, theme, packageSize, orientation, pdfUrl } = await req.json();

    const { data, error } = await supabaseAdmin
      .from('orders')
      .upsert(
        [
          {
            order_token: orderToken,
            child_name: childName || 'Hero',
            theme: theme || 'superhero',
            package_size: packageSize || '4',
            orientation: orientation || 'portrait',
            status: 'completed',
            pdf_url: pdfUrl || null
          }
        ],
        { onConflict: 'order_token' }
      );

    if (error) {
      console.error('Supabase order insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Order recording exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
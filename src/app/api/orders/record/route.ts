import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export async function POST(req: NextRequest) {
  try {
    const { orderToken, childName, theme, packageSize, orientation, pdfUrl } = await req.json();

    const { data, error } = await supabase
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
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cleanShopName, shopSlug } from '@/lib/shop';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  { auth: { persistSession: false, autoRefreshToken: false } }
);

function missing(message: string) {
  return /shop_profiles|schema cache|does not exist|could not find the table/i.test(message);
}

export async function GET(req: NextRequest) {
  const slug = shopSlug(req.nextUrl.searchParams.get('slug') || '');
  const { data, error } = await supabase
    .from('shop_profiles')
    .select('shop_name, logo_data')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({
      shopName: '',
      logo: '',
      saved: false,
      reason: missing(error.message) ? 'Run the shop_profiles SQL in Supabase so logos show on every phone.' : error.message,
    });
  }

  return NextResponse.json({
    shopName: data?.shop_name || '',
    logo: data?.logo_data || '',
    saved: true,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const shopName = cleanShopName(String(body.shopName || ''));
  const slug = shopSlug(String(body.slug || shopName));
  const logo = String(body.logo || '');
  if (!shopName || logo.length > 180000 || (logo && !logo.startsWith('data:image/'))) {
    return NextResponse.json({ saved: false, reason: 'Add a shop name and a small logo.' }, { status: 400 });
  }

  const { error } = await supabase.from('shop_profiles').upsert(
    [{ slug, shop_name: shopName, logo_data: logo || null, updated_at: new Date().toISOString() }],
    { onConflict: 'slug' }
  );

  if (error) {
    return NextResponse.json({
      saved: false,
      reason: missing(error.message) ? 'Run the shop_profiles SQL in Supabase so logos show on every phone.' : error.message,
    }, { status: 500 });
  }

  return NextResponse.json({ saved: true, slug });
}

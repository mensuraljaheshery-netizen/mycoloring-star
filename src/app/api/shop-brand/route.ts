import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cleanShopName, shopSlug } from '@/lib/shop';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  { auth: { persistSession: false, autoRefreshToken: false } }
);

function missing(message: string) {
  return /shop_profiles|schema cache|does not exist|could not find the table/i.test(message);
}

function readDetails(raw: unknown) {
  if (!raw || typeof raw !== 'string') return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  const slug = shopSlug(req.nextUrl.searchParams.get('slug') || '');
  const { data, error } = await supabase
    .from('shop_profiles')
    .select('shop_name, logo_data, details')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    const bare = await supabase.from('shop_profiles').select('shop_name, logo_data').eq('slug', slug).maybeSingle();
    if (bare.error) {
      return NextResponse.json({
        shopName: '',
        logo: '',
        plan: 'book',
        credits: 0,
        saved: false,
        reason: missing(bare.error.message) ? 'Run the shop_profiles SQL in Supabase.' : bare.error.message,
      });
    }
    return NextResponse.json({
      shopName: bare.data?.shop_name || '',
      logo: bare.data?.logo_data || '',
      plan: 'book',
      credits: 0,
      saved: true,
    });
  }

  const details = readDetails(data?.details) as Record<string, unknown>;
  const plan = details.plan === 'monthly' ? 'monthly' : 'book';
  return NextResponse.json({
    shopName: data?.shop_name || '',
    logo: data?.logo_data || '',
    headline: String(details.headline || ''),
    about: String(details.about || ''),
    phone: String(details.phone || ''),
    city: String(details.city || ''),
    address: String(details.address || ''),
    email: String(details.email || ''),
    plan,
    credits: Number(details.credits || 0),
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

  const existing = await supabase.from('shop_profiles').select('details').eq('slug', slug).maybeSingle();
  const previous = readDetails(existing.data?.details) as Record<string, unknown>;
  const details = JSON.stringify({
    headline: String(body.headline || '').slice(0, 120),
    about: String(body.about || '').slice(0, 280),
    phone: String(body.phone || '').slice(0, 40),
    city: String(body.city || '').slice(0, 80),
    address: String(body.address || '').slice(0, 160),
    email: String(body.email || '').slice(0, 80),
    plan: previous.plan === 'monthly' ? 'monthly' : 'book',
    credits: Math.max(0, Number(previous.credits || body.credits || 0)),
  });

  const full = await supabase.from('shop_profiles').upsert(
    [{ slug, shop_name: shopName, logo_data: logo || null, details, updated_at: new Date().toISOString() }],
    { onConflict: 'slug' }
  );

  const error = full.error
    ? (await supabase.from('shop_profiles').upsert(
        [{ slug, shop_name: shopName, logo_data: logo || null, updated_at: new Date().toISOString() }],
        { onConflict: 'slug' }
      )).error
    : null;

  if (error) {
    return NextResponse.json({
      saved: false,
      reason: missing(error.message) ? 'Run the shop_profiles SQL in Supabase.' : error.message,
    }, { status: 500 });
  }

  return NextResponse.json({ saved: true, slug, detailsSaved: !full.error });
}

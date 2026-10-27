import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfIp = req.headers.get('cf-connecting-ip');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || cfIp || '127.0.0.1');

    const { data: existing, error } = await supabase
      .from('free_book_claims')
      .select('id')
      .eq('ip_address', ip)
      .maybeSingle();

    if (error) {
      console.warn('Free check query warning:', error.message);
      return NextResponse.json({ claimed: false });
    }

    return NextResponse.json({ claimed: Boolean(existing) });
  } catch (err: any) {
    console.error('Free check route error:', err);
    return NextResponse.json({ claimed: false });
  }
}
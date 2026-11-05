import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfIp = req.headers.get('cf-connecting-ip');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || cfIp || '127.0.0.1');

    const { data: rows, error } = await supabaseAdmin
      .from('free_book_claims')
      .select('id')
      .eq('ip_address', ip)
      .limit(1);

    if (error) {
      console.warn('Free check query warning:', error.message);
      return NextResponse.json({ claimed: true });
    }

    return NextResponse.json({ claimed: (rows || []).length > 0 });
  } catch (err: any) {
    console.error('Free check route error:', err);
    return NextResponse.json({ claimed: false });
  }
}
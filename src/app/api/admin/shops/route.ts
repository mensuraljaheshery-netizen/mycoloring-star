import { NextResponse } from 'next/server';
import { listShops } from '@/lib/shopTrial';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await listShops();
  return NextResponse.json(result);
}

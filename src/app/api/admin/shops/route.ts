import { NextResponse } from 'next/server';
import { listShopAccounts } from '@/lib/shopAccount';
import { listShops } from '@/lib/shopTrial';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [accounts, activity] = await Promise.all([listShopAccounts(), listShops()]);
  return NextResponse.json({
    accounts: accounts.accounts,
    shops: activity.shops,
    error: accounts.error || activity.error || '',
  });
}

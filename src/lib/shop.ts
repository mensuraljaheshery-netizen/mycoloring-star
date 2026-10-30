export const SHOP_FREE_BOOKS = 2;
export const SHOP_PACK_SIZE = 10;
export const SHOP_PACK_PRICE = 20;

export function shopSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return slug || 'shop';
}

export function shopNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function cleanShopName(name: string): string {
  return name.replace(/["\n\r]/g, '').trim().slice(0, 40);
}

export function shopCreditKey(slug: string): string {
  return `mcs_shop_credits_${slug}`;
}

export function readShopCredits(slug: string): number {
  try {
    const raw = localStorage.getItem(shopCreditKey(slug));
    if (raw === null) return SHOP_FREE_BOOKS;
    const count = parseInt(raw, 10);
    return Number.isFinite(count) ? Math.max(0, count) : 0;
  } catch {
    return SHOP_FREE_BOOKS;
  }
}

export function spendShopCredit(slug: string): number {
  const next = Math.max(0, readShopCredits(slug) - 1);
  try {
    localStorage.setItem(shopCreditKey(slug), String(next));
  } catch {}
  return next;
}

export function shopFileName(shop: string, child: string, theme: string): string {
  const clean = (value: string) => value.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Book';
  return `${clean(shop)}_${clean(child)}_${clean(theme)}.pdf`;
}

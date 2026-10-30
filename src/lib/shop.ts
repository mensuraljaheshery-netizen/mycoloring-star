const DEVICE_CREDITS = 'mcs_shop_device_credits';
const SAVED_NAME = 'mcs_saved_shop_name';
const SAVED_SLUG = 'mcs_saved_shop_slug';

export const SHOP_FREE_BOOKS = 2;
export const SHOP_PACKS = [
  { name: 'Starter', price: 15, books: 10, each: 1.5 },
  { name: 'Popular', price: 30, books: 25, each: 1.2 },
  { name: 'Best value', price: 60, books: 60, each: 1 },
] as const;

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

export function saveShopProfile(name: string, slug: string) {
  try {
    localStorage.setItem(SAVED_NAME, name);
    localStorage.setItem(SAVED_SLUG, slug);
  } catch {}
}

export function readShopProfile(): { name: string; slug: string } | null {
  try {
    const name = localStorage.getItem(SAVED_NAME) || '';
    const slug = localStorage.getItem(SAVED_SLUG) || '';
    if (!name || !slug) return null;
    return { name, slug };
  } catch {
    return null;
  }
}

export function readShopCredits(): number {
  try {
    const raw = localStorage.getItem(DEVICE_CREDITS);
    if (raw !== null) {
      const count = parseInt(raw, 10);
      return Number.isFinite(count) ? Math.max(0, count) : 0;
    }
    let lowest: number | null = null;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('mcs_shop_credits_')) continue;
      const count = parseInt(localStorage.getItem(key) || '', 10);
      if (!Number.isFinite(count)) continue;
      lowest = lowest === null ? count : Math.min(lowest, count);
    }
    const start = lowest === null ? SHOP_FREE_BOOKS : Math.max(0, lowest);
    localStorage.setItem(DEVICE_CREDITS, String(start));
    return start;
  } catch {
    return SHOP_FREE_BOOKS;
  }
}

export function spendShopCredit(): number {
  const next = Math.max(0, readShopCredits() - 1);
  try {
    localStorage.setItem(DEVICE_CREDITS, String(next));
  } catch {}
  return next;
}

export function shopFileName(shop: string, child: string, theme: string): string {
  const clean = (value: string) => value.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Book';
  return `${clean(shop)}_${clean(child)}_${clean(theme)}.pdf`;
}

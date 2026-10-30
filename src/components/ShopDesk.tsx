'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listPublicThemes } from '@/lib/themes';
import {
  SHOP_PACK_PRICE,
  SHOP_PACK_SIZE,
  cleanShopName,
  saveShopProfile,
  shopNameFromSlug,
} from '@/lib/shop';

export default function ShopDesk({ slug, hintedName }: { slug: string; hintedName: string }) {
  const router = useRouter();
  const shopName = cleanShopName(hintedName) || shopNameFromSlug(slug);
  const themes = useMemo(() => listPublicThemes(), []);
  const [childName, setChildName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [themeName, setThemeName] = useState(themes[0]?.name || 'Superhero');
  const [consent, setConsent] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    saveShopProfile(shopName, slug);
    fetch('/api/shop-trial')
      .then((res) => res.json())
      .then((data) => setCredits(typeof data.remaining === 'number' ? data.remaining : 0))
      .catch(() => setCredits(0));
  }, [slug, shopName]);

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const startBook = async () => {
    if (credits !== null && credits <= 0) {
      setError('This connection already used its 2 free books.');
      return;
    }
    if (!childName.trim() || !photo || !consent) {
      setError('Add the child’s name, a photo, and the parent’s permission.');
      return;
    }
    const orderToken = `ord_${Date.now()}`;
    try {
      const gate = await fetch('/api/shop-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderToken, shopName }),
      });
      const gateData = await gate.json();
      if (!gate.ok || !gateData.allowed) {
        setCredits(0);
        setError(gateData.reason || 'This connection already used its 2 free books.');
        return;
      }
      setCredits(typeof gateData.remaining === 'number' ? gateData.remaining : 0);
    } catch {
      setError('Could not check the free books. Try again.');
      return;
    }
    try {
      localStorage.setItem('hero_child_name', childName.trim());
      localStorage.setItem('hero_child_photo', photo);
      localStorage.setItem('mcs_selected_theme', themeName);
      localStorage.setItem('mcs_selected_package', '8');
      localStorage.setItem('mcs_selected_orientation', 'portrait');
      localStorage.setItem('mcs_current_order_token', orderToken);
      localStorage.setItem('mcs_parent_consent', 'true');
      sessionStorage.setItem('mcs_brand_name', shopName);
      sessionStorage.setItem('mcs_brand_slug', slug);
      sessionStorage.setItem('mcs_brand_order', orderToken);
      sessionStorage.setItem('mcs_current_order_token', orderToken);
    } catch {
      setError('This browser blocked saving the photo. Try again.');
      return;
    }
    router.push(`/order-success?package=8&shop=${encodeURIComponent(slug)}`);
  };

  const packLink = `https://wa.me/15205672374?text=${encodeURIComponent(`Hi, ${shopName} used the free books. I want a pack of ${SHOP_PACK_SIZE} for $${SHOP_PACK_PRICE}.`)}`;

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Coloring book</p>
        <h1 className="text-3xl font-black mt-1">{shopName}</h1>
        <p className="mt-2 text-sm text-slate-600">An 8-page book starring the child. You print it here.</p>
        <p className="mt-2 text-xs font-bold text-slate-500">
          {credits === null ? 'Checking free books...' : `Free books left on this connection: ${credits}`}
        </p>

        {credits === 0 ? (
          <a href={packLink} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-2xl bg-slate-900 text-white text-center font-black py-4">
            Add 10 books for $20
          </a>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block text-xs font-black uppercase text-slate-500">
              Child’s first name
              <input
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-medium text-slate-900"
              />
            </label>
            <label className="block text-xs font-black uppercase text-slate-500">
              Photo
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(event) => onPhoto(event.target.files?.[0])}
                className="mt-1 block w-full text-sm"
              />
            </label>
            {photo && <img src={photo} alt="" className="h-24 w-24 rounded-xl object-cover" />}
            <label className="block text-xs font-black uppercase text-slate-500">
              Theme
              <select
                value={themeName}
                onChange={(event) => setThemeName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-medium"
              >
                {themes.map((theme) => (
                  <option key={theme.slug} value={theme.name}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" />
              The parent agreed we can use this photo to make this book.
            </label>
            {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
            <button type="button" onClick={startBook} className="w-full rounded-2xl bg-slate-900 text-white font-black py-4">
              Make the book
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

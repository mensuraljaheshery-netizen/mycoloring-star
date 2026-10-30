'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ShieldCheck } from 'lucide-react';
import { listPublicThemes } from '@/lib/themes';
import { cleanShopName, saveShopProfile, shopNameFromSlug } from '@/lib/shop';

const FIRST_THEMES = ['superhero', 'princess', 'basketball-champion', 'school-day', 'dinosaur-explorer', 'safari'];

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || 'S') + (parts[1]?.[0] || '')).toUpperCase();
}

export default function ShopDesk({ slug, hintedName }: { slug: string; hintedName: string }) {
  const router = useRouter();
  const shopName = cleanShopName(hintedName) || shopNameFromSlug(slug);
  const themes = useMemo(() => {
    const all = listPublicThemes();
    const rank = new Map(FIRST_THEMES.map((item, index) => [item, index]));
    return [...all].sort((a, b) => (rank.get(a.slug) ?? 99) - (rank.get(b.slug) ?? 99));
  }, []);
  const [childName, setChildName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [themeName, setThemeName] = useState('Superhero');
  const [consent, setConsent] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [logo, setLogo] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    document.title = shopName;
    saveShopProfile(shopName, slug);
    fetch('/api/shop-trial')
      .then((res) => res.json())
      .then((data) => setCredits(typeof data.remaining === 'number' ? data.remaining : 0))
      .catch(() => setCredits(0));
    try {
      const savedLogo = localStorage.getItem(`mcs_logo_${slug}`) || '';
      if (savedLogo) {
        setLogo(savedLogo);
        sessionStorage.setItem('mcs_brand_logo', savedLogo);
      }
    } catch {}
    fetch(`/api/shop-brand?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.logo === 'string' && data.logo) {
          setLogo(data.logo);
          try { sessionStorage.setItem('mcs_brand_logo', data.logo); } catch {}
        }
      })
      .catch(() => {});
  }, [slug, shopName]);

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const startBook = async () => {
    if (credits !== null && credits <= 0) {
      setError('Ask the shop to start this book.');
      return;
    }
    if (!childName.trim() || !photo || !consent) {
      setError('Add the child’s name, a clear photo, and a parent’s permission.');
      return;
    }
    setStarting(true);
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
        setError('Ask the shop to start this book.');
        setStarting(false);
        return;
      }
    } catch {
      setError('Could not start the book. Try again.');
      setStarting(false);
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
      if (logo) sessionStorage.setItem('mcs_brand_logo', logo);
    } catch {
      setError('This browser blocked saving the photo. Try again.');
      setStarting(false);
      return;
    }
    router.push(`/order-success?package=8&shop=${encodeURIComponent(slug)}`);
  };

  const visibleThemes = showAll ? themes : themes.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800">
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2">
          {logo ? (
            <img src={logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center">
              {initials(shopName)}
            </div>
          )}
          <span className="font-black text-slate-900 tracking-tight">{shopName}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-orange-600">Coloring book</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            A book starring your child
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl">
            Add a name and a clear photo. Pick an adventure. The shop prints the 8-page book.
          </p>

          {credits === 0 ? (
            <p className="mt-6 rounded-2xl bg-orange-50 border border-orange-200 px-4 py-4 text-sm font-bold text-slate-800">
              Ask the shop to start this book.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Child’s first name
                <input
                  value={childName}
                  onChange={(event) => setChildName(event.target.value)}
                  placeholder="Liam"
                  className="mt-1 w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-base font-bold text-slate-900"
                />
              </label>

              {photo ? (
                <div className="flex items-center gap-3">
                  <img src={photo} alt="" className="h-16 w-16 rounded-xl object-cover border-2 border-emerald-500" />
                  <button type="button" onClick={() => setPhoto(null)} className="text-xs font-bold text-rose-600">
                    Change photo
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-orange-300 bg-orange-50/40 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Upload a clear front-face photo</span>
                  <input type="file" accept="image/*" capture="user" onChange={(event) => onPhoto(event.target.files?.[0])} className="hidden" />
                </label>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Choose an adventure</p>
                  <button type="button" onClick={() => setShowAll((open) => !open)} className="text-xs font-bold text-orange-600">
                    {showAll ? 'Show less' : 'See more'}
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {visibleThemes.map((theme) => {
                    const selected = theme.name === themeName;
                    return (
                      <button
                        key={theme.slug}
                        type="button"
                        onClick={() => setThemeName(theme.name)}
                        className={`text-left rounded-2xl overflow-hidden border-2 bg-white ${selected ? 'border-orange-500' : 'border-orange-100'}`}
                      >
                        <img src={`/theme-previews/${theme.slug}.png`} alt="" className="h-24 w-full object-cover bg-orange-50" />
                        <span className="block px-3 py-2 text-xs font-black text-slate-900">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" />
                A parent agreed this photo can be used to make this book.
              </label>
              {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
              <button
                type="button"
                onClick={startBook}
                disabled={starting}
                className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black py-4 shadow-md shadow-orange-500/20 disabled:opacity-60"
              >
                {starting ? 'Starting the book...' : 'Make the book'}
              </button>
              <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                The photo is used only to draw this book.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-orange-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <span className="font-black text-slate-900">{shopName}</span>
      </footer>
    </div>
  );
}

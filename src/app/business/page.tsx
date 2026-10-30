'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { readShopProfile, saveShopProfile, shopSlug } from '@/lib/shop';

function shrinkLogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the logo'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result || ''));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        const scale = Math.min(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => reject(new Error('Could not read the logo'));
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

export default function BusinessPage() {
  const [shopName, setShopName] = useState('');
  const [logo, setLogo] = useState('');
  const [link, setLink] = useState('');
  const [qr, setQr] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = readShopProfile();
    if (!saved) return;
    setShopName(saved.name);
    setLink(`${window.location.origin}/s/${saved.slug}?n=${encodeURIComponent(saved.name)}`);
    fetch(`/api/shop-brand?slug=${encodeURIComponent(saved.slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.logo) setLogo(data.logo);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { width: 640, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [link]);

  const saveShop = async () => {
    const name = shopName.trim();
    if (name.length < 2) return;
    const slug = shopSlug(name);
    const url = `${window.location.origin}/s/${slug}?n=${encodeURIComponent(name)}`;
    saveShopProfile(name, slug);
    setLink(url);
    setCopied(false);
    const res = await fetch('/api/shop-brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        shopName: name,
        logo,
        plan: 'book',
        credits: 0,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setNote(data.saved
      ? 'Saved. Parents see MyColoringStar on this link. Your own site turns on with the $29 plan, and any credits you buy stay.'
      : (data.reason || 'Saved on this browser. The public page needs the shop table in Supabase.'));
  };

  return (
    <main className="bg-[#FFFDF9] text-slate-800">
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-xs font-black uppercase tracking-wider text-orange-600">For shops</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
          Buy books in a pack. Credits never expire.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          A shop pays once and keeps the books until they are used. A bigger pack costs less for each book. Parents still see MyColoringStar.
        </p>

        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          {[
            ['Starter', '$15', '10 books', '$1.50 each', false],
            ['Popular', '$30', '25 books', '$1.20 each', true],
            ['Best value', '$60', '60 books', '$1 each', false],
          ] as const).map(([name, price, books, each, popular]) => (
            <a
              key={name}
              href={`https://wa.me/15205672374?text=${encodeURIComponent(`Hi, ${shopName.trim() || 'my shop'} wants the ${name} pack: ${price} for ${books}.`)}`}
              className={`bg-white border-2 rounded-3xl p-5 hover:border-orange-400 ${popular ? 'border-orange-500' : 'border-orange-100'}`}
            >
              <p className="text-xs font-black uppercase tracking-wider text-orange-600">{name}</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">{price}</h2>
              <p className="mt-2 text-sm font-bold text-slate-900">{books}</p>
              <p className="text-sm text-slate-600">{each}</p>
            </a>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-500">One-time packs, not a monthly bill. Credits stay until they are used. These prices can go up after the first shops are buying.</p>

        <div className="mt-8 bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900">Build the shop page</h2>
          <p className="text-sm text-slate-600">Parents who scan the code see MyColoringStar and can make an 8-page book. Your name is on the $29 site only.</p>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Shop name
            <input value={shopName} onChange={(event) => setShopName(event.target.value)} placeholder="Luna's Play" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
          </label>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Logo, only needed for the $29 site
            <input type="file" accept="image/*" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try { setLogo(await shrinkLogo(file)); } catch { setNote('Could not read that logo.'); }
            }} className="mt-2 block w-full text-sm" />
          </label>
          {logo && <img src={logo} alt="" className="h-16 w-16 rounded-xl object-cover border border-orange-200" />}
          <button type="button" onClick={saveShop} className="w-full rounded-2xl bg-orange-500 text-white font-black py-3">
            Save and make the QR
          </button>
          {note && <p className="text-sm font-bold text-slate-700">{note}</p>}
          {link && (
            <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
              {qr && <img src={qr} alt="QR code" className="w-40 h-40 rounded-2xl border border-orange-100" />}
              <div>
                <p className="text-xs font-bold text-slate-500 break-all">{link}</p>
                <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); } catch { setCopied(false); } }} className="mt-2 text-sm font-black text-orange-600">
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                {qr && <a href={qr} download={`${shopSlug(shopName)}-qr.png`} className="ml-4 text-sm font-black text-orange-600">Download QR</a>}
              </div>
            </div>
          )}
        </div>

        <a
          href={`https://wa.me/15205672374?text=${encodeURIComponent(`Hi, ${shopName.trim() || 'my shop'} wants the $29 a month site. Please keep the book credits already bought.`)}`}
          className="inline-flex mt-6 text-sm font-black text-orange-600"
        >
          Ask to turn on the $29 site
        </a>
      </section>
    </main>
  );
}

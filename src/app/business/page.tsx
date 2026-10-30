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
  const [headline, setHeadline] = useState('A coloring book starring your child');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
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
        if (data.headline) setHeadline(data.headline);
        if (data.about) setAbout(data.about);
        if (data.phone) setPhone(data.phone);
        if (data.city) setCity(data.city);
        if (data.address) setAddress(data.address);
        if (data.email) setEmail(data.email);
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
        headline,
        about,
        phone,
        city,
        address,
        email,
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
          $2 a book. Your own site when you want it.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          A small shop does not have to pay every month. Buy books at $2. Credits never expire, and they stay if you later upgrade. Parents still see MyColoringStar. The $29 plan is only for a shop that wants its own name and logo.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-5">
            <p className="text-xs font-black uppercase tracking-wider text-orange-600">Start here</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">$2 a book</h2>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>No monthly bill</li>
              <li>Credits stay until the shop uses them</li>
              <li>MyColoringStar stays on the page and the book</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-orange-500 rounded-3xl p-5">
            <p className="text-xs font-black uppercase tracking-wider text-orange-600">Upgrade</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">$29 a month</h2>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>Their logo, their name, their phone</li>
              <li>Same book maker, none of our name</li>
              <li>Credits already bought are not lost</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900">Build the shop page</h2>
          <p className="text-sm text-slate-600">These answers are what the $29 site uses. Until that plan is on, the public link keeps MyColoringStar.</p>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Shop name
            <input value={shopName} onChange={(event) => setShopName(event.target.value)} placeholder="Luna's Play" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
          </label>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Logo
            <input type="file" accept="image/*" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try { setLogo(await shrinkLogo(file)); } catch { setNote('Could not read that logo.'); }
            }} className="mt-2 block w-full text-sm" />
          </label>
          {logo && <img src={logo} alt="" className="h-16 w-16 rounded-xl object-cover border border-orange-200" />}
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Headline parents should see
            <input value={headline} onChange={(event) => setHeadline(event.target.value)} className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
          </label>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            One line about the shop
            <input value={about} onChange={(event) => setAbout(event.target.value)} placeholder="We print it while you wait." className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Phone
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
            </label>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
            </label>
          </div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Address
            <input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
          </label>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
          </label>
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

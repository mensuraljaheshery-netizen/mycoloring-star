'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { readShopProfile, saveShopProfile, shopSlug } from '@/lib/shop';

const PACK_NOTE = 'Hi, I want a 10-book shop pack for $20. My shop name is ';

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
  const [link, setLink] = useState('');
  const [logo, setLogo] = useState('');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = readShopProfile();
    if (!saved) return;
    setShopName(saved.name);
    const url = `${window.location.origin}/s/${saved.slug}?n=${encodeURIComponent(saved.name)}`;
    setLink(url);
    fetch(`/api/shop-brand?slug=${encodeURIComponent(saved.slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.logo) setLogo(data.logo);
        if (data.reason) setNote(data.reason);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!link) {
      setQr('');
      return;
    }
    QRCode.toDataURL(link, { width: 640, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [link]);

  const createLink = async () => {
    const name = shopName.trim();
    if (name.length < 2) return;
    const slug = shopSlug(name);
    const url = `${window.location.origin}/s/${slug}?n=${encodeURIComponent(name)}`;
    saveShopProfile(name, slug);
    if (logo) localStorage.setItem(`mcs_logo_${slug}`, logo);
    setLink(url);
    setCopied(false);
    if (!logo) return;
    try {
      const res = await fetch('/api/shop-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, shopName: name, logo }),
      });
      const data = await res.json();
      setNote(data.saved ? 'Logo saved. It shows when someone scans the code.' : (data.reason || ''));
    } catch {
      setNote('The logo stayed on this browser only.');
    }
  };

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="bg-[#FFFDF9] text-slate-800">
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-xs font-black uppercase tracking-wider text-orange-600">For shops, playgrounds, and photographers</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900">
          Your logo on the page. Your name on the book.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          Print a QR code for the counter. A parent scans it, uploads a photo, and you print an 8-page book. That page uses your logo and your name. Our name is not on it.
        </p>

        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          {[
            ['Same book, your brand', 'The page looks like a finished shop site, with your logo in the header.'],
            ['Scan and upload', 'The parent uses their phone. You print the PDF and hand it over.'],
            ['You keep the sale', '2 free books on a connection, then $2 each. You charge the parent.'],
          ].map(([title, copy]) => (
            <div key={title} className="bg-white border-2 border-orange-100 rounded-2xl p-4">
              <h2 className="font-black text-sm text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Make the QR code</h2>
          <label className="block mt-4 text-xs font-black uppercase tracking-wider text-slate-500" htmlFor="shop-name">
            Shop name on the book
          </label>
          <input
            id="shop-name"
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            placeholder="Luna's Play"
            className="mt-2 w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-base"
          />
          <label className="block mt-4 text-xs font-black uppercase tracking-wider text-slate-500">
            Shop logo
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try { setLogo(await shrinkLogo(file)); } catch { setNote('Could not read that logo.'); }
              }}
              className="mt-2 block w-full text-sm"
            />
          </label>
          {logo && <img src={logo} alt="" className="mt-3 h-16 w-16 rounded-xl object-cover border border-orange-200" />}
          <button type="button" onClick={createLink} className="mt-4 w-full rounded-2xl bg-orange-500 text-white font-black py-3 shadow-md shadow-orange-500/20">
            Create the shop page
          </button>
          {note && <p className="mt-3 text-sm font-bold text-slate-700">{note}</p>}
          {link && (
            <div className="mt-5 grid sm:grid-cols-[180px_1fr] gap-4 items-center">
              {qr && <img src={qr} alt="QR code for the shop page" className="w-44 h-44 border border-orange-100 rounded-2xl" />}
              <div>
                <p className="text-sm text-slate-600">Print this code and put it where parents can scan it.</p>
                <p className="mt-2 text-xs font-bold text-slate-500 break-all">{link}</p>
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={copyLink} className="text-sm font-black text-orange-600">
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  {qr && (
                    <a href={qr} download={`${shopSlug(shopName)}-qr.png`} className="text-sm font-black text-orange-600">
                      Download QR
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-900">What you pay</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-orange-50 p-3">
              <div className="text-2xl font-black text-slate-900">2</div>
              <div className="text-xs text-slate-500">free books</div>
            </div>
            <div className="rounded-2xl bg-orange-50 p-3">
              <div className="text-2xl font-black text-slate-900">$2</div>
              <div className="text-xs text-slate-500">each after that</div>
            </div>
            <div className="rounded-2xl bg-orange-50 p-3">
              <div className="text-2xl font-black text-slate-900">$20</div>
              <div className="text-xs text-slate-500">pack of 10</div>
            </div>
          </div>
          <a
            href={`https://wa.me/15205672374?text=${encodeURIComponent(PACK_NOTE + (shopName.trim() || 'my shop'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-4 text-sm font-black text-orange-600"
          >
            Message us to buy a 10-pack
          </a>
        </div>
      </section>
    </main>
  );
}

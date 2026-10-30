'use client';

import { useState } from 'react';
import { shopSlug } from '@/lib/shop';

const PACK_NOTE = 'Hi, I want a 10-book shop pack for $20. My shop name is ';

export default function BusinessPage() {
  const [shopName, setShopName] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const createLink = () => {
    const name = shopName.trim();
    if (name.length < 2) return;
    const slug = shopSlug(name);
    const url = `${window.location.origin}/s/${slug}?n=${encodeURIComponent(name)}`;
    setLink(url);
    setCopied(false);
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
    <main className="bg-white text-slate-900">
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">For shops, playgrounds, and photographers</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Your name on the book. Not ours.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl">
          A parent is already in your shop. You take one photo, print an 8-page coloring book of their child, and sell it as your product. Building this yourself means rebuilding the face match, the themes, the failed pages, and the print file.
        </p>

        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          {[
            ['Your brand', 'The cover and the PDF say your shop name. The customer page does not mention us.'],
            ['Already built', 'Likeness, themes, retries, and a letter-size PDF are done. A no-code clone still has to solve those.'],
            ['You keep the sale', 'You charge the parent. A book costs you $2 after the two free ones.'],
          ].map(([title, copy]) => (
            <div key={title} className="border border-slate-200 rounded-2xl p-4">
              <h2 className="font-black text-sm">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-slate-200 rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-black">What you pay</h2>
          <p className="mt-2 text-sm text-slate-600">
            8 pages plus a color cover. Use one tablet at the counter so the free books stay together.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-2xl font-black">2</div>
              <div className="text-xs text-slate-500">free books</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-2xl font-black">$2</div>
              <div className="text-xs text-slate-500">each after that</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-2xl font-black">$20</div>
              <div className="text-xs text-slate-500">pack of 10</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">Shops usually sell the printed book for $10 to $15. You print it. You keep the difference.</p>
          <a
            href={`https://wa.me/15205672374?text=${encodeURIComponent(PACK_NOTE + (shopName.trim() || 'my shop'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-4 text-sm font-bold text-slate-900 underline"
          >
            Message us to buy a 10-pack
          </a>
        </div>

        <div className="mt-8 border border-slate-900 rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-black">Make your customer link</h2>
          <p className="mt-1 text-sm text-slate-600">This is the page you open on the shop tablet. The parent never has to find us.</p>
          <label className="block mt-4 text-xs font-black uppercase tracking-wider text-slate-500" htmlFor="shop-name">
            Shop name, as it should appear on the book
          </label>
          <input
            id="shop-name"
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            placeholder="Luna's Play"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-base"
          />
          <button
            type="button"
            onClick={createLink}
            className="mt-3 w-full rounded-xl bg-slate-900 text-white font-black py-3"
          >
            Create the link
          </button>
          {link && (
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 break-all">{link}</p>
              <button type="button" onClick={copyLink} className="mt-2 text-sm font-black underline">
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

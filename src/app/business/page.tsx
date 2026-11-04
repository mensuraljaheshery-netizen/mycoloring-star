'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const SHOP_PACKS = [
  { name: 'Starter', price: '$15', books: '10 books', each: '$1.50 a book', checkoutKey: 'shop_15' },
  { name: 'Popular', price: '$30', books: '25 books', each: '$1.20 a book', popular: true, checkoutKey: 'shop_30' },
  { name: 'Best value', price: '$60', books: '60 books', each: '$1 a book', checkoutKey: 'shop_60' },
] as const;

const STEPS = [
  { n: '1', title: 'Open a shop account', body: 'You get 2 books. Print the first one and keep it on the counter.' },
  { n: '2', title: 'Make the book at the counter', body: 'Add the child’s name and photo on your tablet. The book has your shop name on it.' },
  { n: '3', title: 'Print and staple', body: 'The pages print like a normal document. Staple the top and hand it over.' },
];

type ShopAccount = { slug: string; shopName: string; email: string; credits: number };

export default function BusinessPage() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState<ShopAccount | null>(null);
  const [link, setLink] = useState('');
  const [qr, setQr] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/api/shop-account')
      .then((res) => res.json())
      .then((data) => {
        if (data.account) setAccount(data.account);
        if (data.added && data.account?.slug) {
          const name = encodeURIComponent(data.account.shopName || '');
          window.location.href = `/s/${data.account.slug}?n=${name}`;
          return;
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!account) return;
    const url = `${window.location.origin}/s/${account.slug}?n=${encodeURIComponent(account.shopName)}`;
    setLink(url);
    QRCode.toDataURL(url, { width: 640, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [account]);

  const printCounterCard = () => {
    if (!account || !qr) return;
    const safeName = account.shopName
      .replace(/&/g, '&' + 'amp;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/'/g, '&#39;');
    const popup = window.open('', '_blank', 'noopener,noreferrer');
    if (!popup) return;
    popup.document.write(`<!doctype html><html><head><title>${safeName} counter card</title>
      <style>
        body { margin: 0; font-family: Georgia, "Times New Roman", serif; color: #1c1917; }
        .card { width: 5in; margin: 0.45in auto; border: 1px solid #fdba74; border-radius: 18px; padding: 36px 32px; text-align: center; }
        h1 { margin: 0; font-size: 32px; letter-spacing: -0.03em; }
        p { margin: 12px 0 0; font-size: 18px; font-family: Arial, sans-serif; color: #44403c; }
        img { width: 200px; height: 200px; margin-top: 18px; }
        ol { text-align: left; margin: 20px auto 0; max-width: 280px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }
      </style></head><body>
      <div class="card">
        <h1>${safeName}</h1>
        <p>A coloring book of your child, made here.</p>
        <img src="${qr}" alt="QR code" />
        <ol>
          <li>Scan this code.</li>
          <li>Add a name and a photo.</li>
          <li>Show the book at the counter so we can print it.</li>
        </ol>
      </div>
      <script>window.onload = () => window.print()<\/script>
      </body></html>`);
    popup.document.close();
  };

  const submitAccount = async () => {
    setBusy(true);
    setNote('');
    const res = await fetch('/api/shop-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: mode, shopName, email, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.account) {
      setNote(data.error || 'Could not save the shop.');
      return;
    }
    setAccount(data.account);
    setPassword('');
    const name = encodeURIComponent(data.account.shopName || '');
    window.location.href = `/s/${data.account.slug}?n=${name}`;
  };

  const buyPack = async (pack: (typeof SHOP_PACKS)[number]) => {
    setNote('');
    const res = await fetch('/api/shop-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'buy', pack: pack.checkoutKey }),
    });
    const data = await res.json();
    if (!res.ok || !data.checkoutUrl) {
      setNote(data.error || 'That pack is not connected yet. The $15 pack is ready.');
      return;
    }
    window.location.href = data.checkoutUrl;
  };

  const logout = async () => {
    await fetch('/api/shop-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setAccount(null);
    setLink('');
    setQr('');
  };

  return (
    <main className="bg-[#FFFDF9] text-slate-800">
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {!ready ? (
          <p className="text-sm font-bold text-slate-500">Loading the shop...</p>
        ) : !account ? (
          <>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">For shops</p>
            <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              Your shop name on the book. No monthly fee.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Make an 8-page coloring book of a child who is already in your shop. You print it, staple the top, and hand it over. Most shops sell it for about $10.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="rounded-3xl border border-orange-100 bg-white p-5">
                  <p className="text-sm font-black text-orange-600">{step.n}</p>
                  <h2 className="mt-2 text-lg font-black text-slate-900">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 max-w-md rounded-3xl border border-orange-100 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex gap-2">
                <button type="button" onClick={() => setMode('signup')} className={`rounded-full px-4 py-2 text-sm font-black ${mode === 'signup' ? 'bg-slate-900 text-white' : 'bg-orange-50 text-slate-700'}`}>Create account</button>
                <button type="button" onClick={() => setMode('login')} className={`rounded-full px-4 py-2 text-sm font-black ${mode === 'login' ? 'bg-slate-900 text-white' : 'bg-orange-50 text-slate-700'}`}>Log in</button>
              </div>
              <div className="mt-4 space-y-3">
                {mode === 'signup' && (
                  <label className="block text-sm font-bold text-slate-700">
                    Shop name
                    <input value={shopName} onChange={(event) => setShopName(event.target.value)} placeholder="Luna's Play" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
                  </label>
                )}
                <label className="block text-sm font-bold text-slate-700">
                  Email
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="shop@email.com" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  Password
                  <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="At least 6 characters" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
                </label>
                <button type="button" onClick={submitAccount} disabled={busy} className="w-full rounded-2xl bg-orange-500 text-white font-black py-3 disabled:opacity-60">
                  {busy ? 'Saving...' : mode === 'signup' ? 'Create the shop' : 'Log in'}
                </button>
                {note && <p className="rounded-2xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm font-bold text-slate-800">{note}</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Your shop</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{account.shopName}</h1>
                  <p className="mt-1 text-sm text-slate-500">{account.email}</p>
                </div>
                <button type="button" onClick={logout} className="text-sm font-bold text-slate-500">Log out</button>
              </div>
              <p className="mt-6 text-4xl font-black tracking-tight text-slate-900">{account.credits}</p>
              <p className="text-sm font-bold text-slate-700">books left</p>
              <p className="mt-1 text-sm text-slate-500">About ${account.credits * 10} if you sell each finished book for $10. Paper and staples are yours.</p>
              <a href={link || '#'} className="mt-6 block w-full rounded-2xl bg-orange-500 text-white font-black py-3 text-center">
                Make a book
              </a>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold">
                <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); } catch { setCopied(false); } }} className="text-orange-700">
                  {copied ? 'Link copied' : 'Copy the book link'}
                </button>
                {qr && <button type="button" onClick={printCounterCard} className="text-orange-700">Print the counter card</button>}
              </div>
              {note && <p className="mt-4 text-sm font-bold text-slate-700">{note}</p>}
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-6 text-center">
              {qr ? <img src={qr} alt="QR code for this shop" className="mx-auto h-44 w-44" /> : <div className="mx-auto h-44 w-44 rounded-2xl bg-orange-50" />}
              <p className="mt-4 text-sm font-black text-slate-900">Counter card</p>
              <p className="mt-1 text-sm text-slate-500">Print this and stand it by the register. The parent starts the book, then you print it.</p>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-lg font-black text-slate-900">Buy more books</h2>
              <p className="mt-1 text-sm text-slate-500">Books you buy stay on this account. They do not expire.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {SHOP_PACKS.map((pack) => (
                  <button
                    key={pack.name}
                    type="button"
                    onClick={() => buyPack(pack)}
                    className={`rounded-3xl border bg-white p-5 text-left ${'popular' in pack && pack.popular ? 'border-orange-500' : 'border-orange-100'}`}
                  >
                    <p className="text-xs font-black uppercase tracking-wider text-orange-600">{pack.name}</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{pack.price}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{pack.books}</p>
                    <p className="text-sm text-slate-500">{pack.each}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

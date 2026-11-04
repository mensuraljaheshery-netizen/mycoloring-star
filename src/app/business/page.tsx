'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const SHOP_PACKS = [
  { name: 'Starter', price: '$15', books: '10 books', each: '$1.50 each', checkoutKey: 'shop_15' },
  { name: 'Popular', price: '$30', books: '25 books', each: '$1.20 each', popular: true, checkoutKey: 'shop_30' },
  { name: 'Best value', price: '$60', books: '60 books', each: '$1 each', checkoutKey: 'shop_60' },
] as const;

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

  useEffect(() => {
    fetch('/api/shop-account')
      .then((res) => res.json())
      .then((data) => {
        if (data.account) setAccount(data.account);
        if (data.added && data.account?.slug) {
          const name = encodeURIComponent(data.account.shopName || '');
          window.location.href = `/s/${data.account.slug}?n=${name}`;
        }
      })
      .catch(() => {});
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
        body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; }
        .card { width: 5in; margin: 0.4in auto; border: 8px solid #f97316; border-radius: 24px; padding: 28px; text-align: center; }
        h1 { margin: 0; font-size: 28px; }
        p { margin: 10px 0 0; font-size: 16px; }
        img { width: 220px; height: 220px; margin-top: 16px; }
        ol { text-align: left; margin: 18px auto 0; max-width: 260px; font-size: 16px; line-height: 1.5; }
      </style></head><body>
      <div class="card">
        <h1>${safeName}</h1>
        <p>Turn your child into a coloring book.</p>
        <img src="${qr}" alt="QR code" />
        <ol>
          <li>Scan the code.</li>
          <li>Add the child’s photo.</li>
          <li>We print the book.</li>
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
      body: JSON.stringify({
        action: mode,
        shopName,
        email,
        password,
      }),
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
      setNote(data.error || 'That pack is not ready yet.');
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
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-xs font-black uppercase tracking-wider text-orange-600">For shops</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
          Your shop name goes on the book.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          Create an account and get 2 free books. Print the first one and keep it as your sample. Use the second with a real customer. You can buy more books at any time.
        </p>

        {!account ? (
          <div className="mt-8 bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode('signup')} className={`rounded-full px-4 py-2 text-sm font-black ${mode === 'signup' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-slate-700'}`}>Create account</button>
              <button type="button" onClick={() => setMode('login')} className={`rounded-full px-4 py-2 text-sm font-black ${mode === 'login' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-slate-700'}`}>Log in</button>
            </div>
            {mode === 'signup' && (
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Shop name
                <input value={shopName} onChange={(event) => setShopName(event.target.value)} placeholder="Luna's Play" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
              </label>
            )}
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="shop@email.com" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
            </label>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="At least 6 characters" className="mt-1 w-full rounded-2xl border border-orange-200 px-4 py-3 text-base font-medium" />
            </label>
            <button type="button" onClick={submitAccount} disabled={busy} className="w-full rounded-2xl bg-orange-500 text-white font-black py-3 disabled:opacity-60">
              {busy ? 'Saving...' : mode === 'signup' ? 'Create the shop' : 'Log in'}
            </button>
            {note && <p className="rounded-2xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm font-bold text-slate-800">{note}</p>}
          </div>
        ) : (
          <>
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              {SHOP_PACKS.map((pack) => (
                <button
                  key={pack.name}
                  type="button"
                  onClick={() => buyPack(pack)}
                  className={`bg-white border-2 rounded-3xl p-5 text-left hover:border-orange-400 ${'popular' in pack && pack.popular ? 'border-orange-500' : 'border-orange-100'}`}
                >
                  <p className="text-xs font-black uppercase tracking-wider text-orange-600">{pack.name}</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">{pack.price}</h2>
                  <p className="mt-2 text-sm font-bold text-slate-900">{pack.books}</p>
                  <p className="text-sm text-slate-600">{pack.each}</p>
                </button>
              ))}
            </div>
            {note && <p className="mt-3 text-sm font-bold text-slate-700">{note}</p>}

            <div className="mt-8 bg-white border-2 border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{account.shopName}</h2>
                  <p className="text-sm text-slate-500">{account.email}</p>
                  <p className="mt-2 text-sm font-black text-orange-600">{account.credits} books left</p>
                  <p className="text-xs font-bold text-slate-500">About ${account.credits * 10} if you sell each for $10</p>
                </div>
                <button type="button" onClick={logout} className="text-sm font-black text-slate-500">Log out</button>
              </div>
              {link && (
                <div className="mt-4 space-y-4">
                  <a href={link} className="block w-full rounded-2xl bg-orange-500 text-white font-black py-3 text-center">
                    Make a book
                  </a>
                  <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
                  {qr && <img src={qr} alt="QR code" className="w-40 h-40 rounded-2xl border border-orange-100" />}
                  <div>
                    <p className="text-xs font-bold text-slate-500 break-all">{link}</p>
                    <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); } catch { setCopied(false); } }} className="mt-2 text-sm font-black text-orange-600">
                      {copied ? 'Copied' : 'Copy link'}
                    </button>
                    {qr && <button type="button" onClick={printCounterCard} className="ml-4 text-sm font-black text-orange-600">Print counter card</button>}
                  </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

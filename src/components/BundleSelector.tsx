'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Check, Sparkles, Layers, ChevronDown } from 'lucide-react';

const BUNDLE_THEMES = [
  { name: 'Surprise Variety Pack', slug: 'variety-pack' },
  { name: 'Superhero', slug: 'superhero' },
  { name: 'Princess', slug: 'princess' },
  { name: 'Astronaut', slug: 'astronaut' },
  { name: 'Dinosaur', slug: 'dinosaur-explorer' },
  { name: 'Fairy Forest', slug: 'fairy-forest' },
  { name: 'Outer Space', slug: 'outer-space' },
  { name: 'Animals', slug: 'playing-with-animals' },
  { name: 'Soccer Stadium', slug: 'soccer-stadium' },
  { name: 'Under the Sea', slug: 'under-the-sea' },
  { name: 'Pirate Adventure', slug: 'pirate-adventure' },
  { name: 'Race Car Driver', slug: 'race-car-driver' },
  { name: 'Firefighter', slug: 'firefighter' },
  { name: 'Knights & Dragons', slug: 'knights-and-dragons' },
  { name: 'Robot World', slug: 'robot-world' },
  { name: 'Ballet & Dance', slug: 'ballet-and-dance' },
  { name: 'Safari', slug: 'safari' },
  { name: 'Wizard Academy', slug: 'magical-wizard-academy' }
];

const BUNDLE_TIERS: Record<'16' | '32' | '48', { pages: number; price: string; orig: string; perBook: string; key: string }> = {
  '16': { pages: 16, price: '$23.99', orig: '$35.97', perBook: '$7.99', key: 'bundle_3x16' },
  '32': { pages: 32, price: '$33.99', orig: '$50.97', perBook: '$11.33', key: 'bundle_3x32' },
  '48': { pages: 48, price: '$43.99', orig: '$65.97', perBook: '$14.66', key: 'bundle_3x48' }
};

interface BookSlot {
  childName: string;
  photo: string | null;
  theme: string;
}

export default function BundleSelector() {
  const [selectedSize, setSelectedSize] = useState<'16' | '32' | '48'>('16');
  const [loading, setLoading] = useState(false);

  const [books, setBooks] = useState<BookSlot[]>([
    { childName: 'Kid 1', photo: null, theme: 'superhero' },
    { childName: 'Kid 2', photo: null, theme: 'princess' },
    { childName: 'Kid 3', photo: null, theme: 'dinosaur-explorer' }
  ]);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('hero_child_name') || sessionStorage.getItem('hero_child_name') || '';
      const savedPhoto = localStorage.getItem('hero_child_photo') || sessionStorage.getItem('hero_child_photo') || null;
      const currentTheme = localStorage.getItem('mcs_selected_theme') || 'superhero';

      setBooks((prev) => [
        { childName: savedName || 'Kid 1', photo: savedPhoto, theme: currentTheme.toLowerCase().replace(/\s+/g, '-') },
        { childName: prev[1].childName || 'Kid 2', photo: prev[1].photo, theme: prev[1].theme },
        { childName: prev[2].childName || 'Kid 3', photo: prev[2].photo, theme: prev[2].theme }
      ]);
    } catch {}
  }, []);

  const handleUpdateBook = (index: number, updates: Partial<BookSlot>) => {
    setBooks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        handleUpdateBook(index, { photo: compressed });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyPhotoFromBook1 = (targetIndex: number) => {
    if (books[0].photo) {
      handleUpdateBook(targetIndex, { photo: books[0].photo });
    }
  };

  const tier = BUNDLE_TIERS[selectedSize];

  const handleExecute = async () => {
    if (!books[0].photo) {
      alert('Please upload a photo for at least Child #1.');
      return;
    }

    setLoading(true);

    // Save bundle configuration for post-payment generation
    const bundlePayload = books.map((b, i) => ({
      bookNumber: i + 1,
      childName: b.childName.trim() || `Child ${i + 1}`,
      theme: b.theme,
      photo: b.photo || books[0].photo,
      pages: tier.pages,
      isMiniTest: false
    }));

    localStorage.setItem('mcs_bundle_data', JSON.stringify(bundlePayload));
    sessionStorage.setItem('mcs_bundle_data', JSON.stringify(bundlePayload));

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageSize: tier.key })
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to initialize checkout.');
        setLoading(false);
      }
    } catch {
      alert('Network error connecting to checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto my-8 p-6 bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-purple-950/30 border border-purple-500/30 rounded-3xl shadow-xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 3-Book Family Bundle &bull; Buy 2, Get 1 Free
          </span>
          <h3 className="text-xl font-black text-white mt-2">Customize 3 Coloring Books</h3>
          <p className="text-xs text-neutral-400">Assign photos, child names, and themes for 1, 2, or 3 kids</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs line-through text-neutral-400 mr-2">{tier.orig}</span>
          <span className="text-3xl font-black text-emerald-400">{tier.price}</span>
          <p className="text-[11px] text-emerald-300/90 font-semibold">{tier.perBook} per book (Save $12+)</p>
        </div>
      </div>

      {/* Package Size Selector */}
      <div className="mb-6">
        <label className="text-[11px] font-black text-neutral-300 uppercase tracking-wider block mb-2">
          Select Page Size (Applied to All 3 Books):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['16', '32', '48'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`p-2.5 text-xs font-bold rounded-xl border transition cursor-pointer flex flex-col items-center justify-center text-center ${
                selectedSize === size
                  ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
              }`}
            >
              <span>{size} Pages Each</span>
              <span className="text-[11px] font-black text-emerald-400 mt-0.5">{BUNDLE_TIERS[size].price} Total</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Individual Book Customizer Cards */}
      <div className="space-y-4 mb-6">
        {books.map((book, idx) => (
          <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Book #{idx + 1}
              </span>
              {idx > 0 && books[0].photo && !book.photo && (
                <button
                  type="button"
                  onClick={() => copyPhotoFromBook1(idx)}
                  className="text-[11px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Same photo as Book 1
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                  Child Name
                </label>
                <input
                  type="text"
                  placeholder={`Child #${idx + 1} Name`}
                  value={book.childName}
                  onChange={(e) => handleUpdateBook(idx, { childName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                  Adventure Theme
                </label>
                <div className="relative">
                  <select
                    value={book.theme}
                    onChange={(e) => handleUpdateBook(idx, { theme: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-xs text-white appearance-none focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {BUNDLE_THEMES.map((t) => (
                      <option key={t.slug} value={t.slug} className="bg-neutral-900 text-white">
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                Child Face Photo {idx === 0 ? '(Primary Photo)' : '(Optional if same kid)'}
              </label>

              {book.photo ? (
                <div className="flex items-center justify-between p-2 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <img
                      src={book.photo}
                      alt={`Book ${idx + 1}`}
                      className="w-9 h-9 rounded-lg object-cover border border-emerald-500"
                    />
                    <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Photo Attached
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateBook(idx, { photo: null })}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-white/20 hover:border-purple-400 bg-white/5 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-white transition">
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  <span>Upload photo for Book #{idx + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(idx, e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleExecute}
        className="w-full py-4 px-4 font-black text-sm rounded-2xl shadow-lg transition transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-950/60"
      >
        {loading ? (
          <span>Connecting to Whop...</span>
        ) : (
          <span>Get 3 Books ({tier.pages} Pages Each) for {tier.price} &rarr;</span>
        )}
      </button>

      <p className="text-[11px] text-center text-neutral-400 mt-2.5">
        Each book generated individually &bull; Instant printable PDF bundle delivered after payment
      </p>
    </div>
  );
}
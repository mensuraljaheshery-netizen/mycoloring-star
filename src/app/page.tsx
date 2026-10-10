'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Check, ShieldCheck, Sparkles, ArrowRight, ArrowDown, ChevronDown, Download, AlertCircle } from 'lucide-react';

interface ThemeItem {
  id: number;
  name: string;
  category: string;
  slug: string;
  previewImage: string;
  genderTarget: 'boy' | 'girl' | 'all';
}

const ALL_34_THEMES: ThemeItem[] = [
  { id: 0, name: 'Surprise Variety Pack', category: 'Special', slug: 'variety-pack', previewImage: '/theme-previews/variety-pack.png', genderTarget: 'all' },
  { id: 1, name: 'Superhero', category: 'Adventure', slug: 'superhero', previewImage: '/theme-previews/superhero.png', genderTarget: 'all' },
  { id: 2, name: 'Princess', category: 'Fantasy', slug: 'princess', previewImage: '/theme-previews/princess.png', genderTarget: 'girl' },
  { id: 3, name: 'Astronaut', category: 'Space', slug: 'astronaut', previewImage: '/theme-previews/astronaut.png', genderTarget: 'all' },
  { id: 4, name: 'School Day', category: 'Jobs', slug: 'school-day', previewImage: '/theme-previews/school-day.png', genderTarget: 'all' },
  { id: 5, name: 'Jungle Explorer', category: 'Adventure', slug: 'jungle-explorer', previewImage: '/theme-previews/jungle-explorer.png', genderTarget: 'all' },
  { id: 6, name: 'Outer Space', category: 'Space', slug: 'outer-space', previewImage: '/theme-previews/outer-space.png', genderTarget: 'all' },
  { id: 7, name: 'Mars Mission', category: 'Space', slug: 'mars-mission', previewImage: '/theme-previews/mars-mission.png', genderTarget: 'all' },
  { id: 8, name: 'Playing with Animals', category: 'Animals and Nature', slug: 'playing-with-animals', previewImage: '/theme-previews/playing-with-animals.png', genderTarget: 'all' },
  { id: 9, name: 'Desert Adventure', category: 'Adventure', slug: 'desert-adventure', previewImage: '/theme-previews/desert-adventure.png', genderTarget: 'all' },
  { id: 10, name: 'Snow and Winter', category: 'Seasonal', slug: 'snow-and-winter', previewImage: '/theme-previews/snow-and-winter.png', genderTarget: 'all' },
  { id: 11, name: 'Soccer Stadium', category: 'Sports', slug: 'soccer-stadium', previewImage: '/theme-previews/soccer-stadium.png', genderTarget: 'all' },
  { id: 12, name: 'Basketball Champion', category: 'Sports', slug: 'basketball-champion', previewImage: '/theme-previews/basketball-champion.png', genderTarget: 'all' },
  { id: 13, name: 'Under the Sea', category: 'Animals and Nature', slug: 'under-the-sea', previewImage: '/theme-previews/under-the-sea.png', genderTarget: 'all' },
  { id: 14, name: 'Dinosaur Explorer', category: 'Adventure', slug: 'dinosaur-explorer', previewImage: '/theme-previews/dinosaur-explorer.png', genderTarget: 'all' },
  { id: 15, name: 'Pirate Adventure', category: 'Adventure', slug: 'pirate-adventure', previewImage: '/theme-previews/pirate-adventure.png', genderTarget: 'all' },
  { id: 16, name: 'Farm Day', category: 'Animals and Nature', slug: 'farm-day', previewImage: '/theme-previews/farm-day.png', genderTarget: 'all' },
  { id: 17, name: 'Fairy Forest', category: 'Fantasy', slug: 'fairy-forest', previewImage: '/theme-previews/fairy-forest.png', genderTarget: 'all' },
  { id: 18, name: 'Knights and Dragons', category: 'Fantasy', slug: 'knights-and-dragons', previewImage: '/theme-previews/knights-and-dragons.png', genderTarget: 'all' },
  { id: 19, name: 'Race Car Driver', category: 'Sports', slug: 'race-car-driver', previewImage: '/theme-previews/race-car-driver.png', genderTarget: 'all' },
  { id: 20, name: 'Firefighter', category: 'Jobs', slug: 'firefighter', previewImage: '/theme-previews/firefighter.png', genderTarget: 'all' },
  { id: 21, name: 'Doctor and Vet', category: 'Jobs', slug: 'doctor-and-vet', previewImage: '/theme-previews/doctor-and-vet.png', genderTarget: 'all' },
  { id: 22, name: 'Chef in the Kitchen', category: 'Jobs', slug: 'chef-in-the-kitchen', previewImage: '/theme-previews/chef-in-the-kitchen.png', genderTarget: 'all' },
  { id: 23, name: 'Robot World', category: 'Fantasy', slug: 'robot-world', previewImage: '/theme-previews/robot-world.png', genderTarget: 'all' },
  { id: 24, name: 'Camping Trip', category: 'Adventure', slug: 'camping-trip', previewImage: '/theme-previews/camping-trip.png', genderTarget: 'all' },
  { id: 25, name: 'Ballet and Dance', category: 'Sports', slug: 'ballet-and-dance', previewImage: '/theme-previews/ballet-and-dance.png', genderTarget: 'girl' },
  { id: 26, name: 'Music Band', category: 'Jobs', slug: 'music-band', previewImage: '/theme-previews/music-band.png', genderTarget: 'all' },
  { id: 27, name: 'Arctic Animals', category: 'Animals and Nature', slug: 'arctic-animals', previewImage: '/theme-previews/arctic-animals.png', genderTarget: 'all' },
  { id: 28, name: 'Safari', category: 'Animals and Nature', slug: 'safari', previewImage: '/theme-previews/safari.png', genderTarget: 'all' },
  { id: 29, name: 'Magical Wizard Academy', category: 'Fantasy', slug: 'magical-wizard-academy', previewImage: '/theme-previews/magical-wizard-academy.png', genderTarget: 'all' },
  { id: 30, name: 'Birthday Party', category: 'Seasonal', slug: 'birthday-party', previewImage: '/theme-previews/birthday-party.png', genderTarget: 'all' },
  { id: 31, name: 'Halloween', category: 'Seasonal', slug: 'halloween', previewImage: '/theme-previews/halloween.png', genderTarget: 'all' },
  { id: 32, name: 'Winter Holidays', category: 'Seasonal', slug: 'winter-holidays', previewImage: '/theme-previews/winter-holidays.png', genderTarget: 'all' },
  { id: 33, name: 'Eid and Ramadan', category: 'Seasonal', slug: 'eid-and-ramadan', previewImage: '/theme-previews/eid-and-ramadan.png', genderTarget: 'all' },
  { id: 34, name: 'Spring Flowers', category: 'Seasonal', slug: 'spring-flowers', previewImage: '/theme-previews/spring-flowers.png', genderTarget: 'all' }
];

const PACKAGES = [
  { id: '8', name: 'Starter', pages: '8 Interior Pages + Cover', price: '$8.99', popular: false },
  { id: '16', name: 'Standard', pages: '16 Interior Pages + Cover', price: '$12.99', popular: true },
  { id: '32', name: 'Deluxe', pages: '32 Interior Pages + Cover', price: '$21.99', popular: false },
  { id: '48', name: 'Mega Variety', pages: '48 Interior Pages + Cover', price: '$29.99', popular: false }
];

export default function HomePage() {
  const router = useRouter();
  const [childName, setChildName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('16');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const themesSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const savedName = sessionStorage.getItem('hero_child_name');
      const savedPhoto = sessionStorage.getItem('hero_child_photo');
      const savedPkg = sessionStorage.getItem('mcs_selected_package');
      if (savedName) setChildName(savedName);
      if (savedPhoto) setPhotoPreview(savedPhoto);
      if (savedPkg) setSelectedPackage(savedPkg);
    } catch {}
  }, []);

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
    try {
      sessionStorage.setItem('mcs_selected_package', pkgId);
    } catch {}
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (JPG, PNG, WEBP, or HEIC).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Photo size must be under 15MB.');
      return;
    }

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
        setPhotoPreview(compressed);
        try {
          sessionStorage.setItem('hero_child_photo', compressed);
          sessionStorage.setItem('childPhotoPreview', compressed);
        } catch {}
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectTheme = (slug: string) => {
    const trimmed = childName.trim() || 'Hero';
    try {
      sessionStorage.setItem('hero_child_name', trimmed);
      sessionStorage.setItem('mcs_selected_package', selectedPackage);
      if (photoPreview) {
        sessionStorage.setItem('hero_child_photo', photoPreview);
        sessionStorage.setItem('childPhotoPreview', photoPreview);
      }
    } catch {}
    router.push(`/theme/${slug}?name=${encodeURIComponent(trimmed)}&pkg=${selectedPackage}`);
  };

  const scrollToThemes = () => {
    if (themesSectionRef.current) {
      themesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredThemes = ALL_34_THEMES.filter(
    (t) => activeCategory === 'All' || t.category === activeCategory
  );
  const categories = ['All', ...Array.from(new Set(ALL_34_THEMES.map((t) => t.category)))];

  const faqs = [
    {
      q: 'What is MyColoringStar?',
      a: 'MyColoringStar creates personalized children’s coloring books. You upload a clear photo of your child and choose an adventure theme (such as Superhero, Astronaut, or Dinosaur). Our engine transforms their recognizable likeness into high-quality black-and-white coloring pages.'
    },
    {
      q: 'What do I receive after purchase?',
      a: 'You receive an instant high-resolution printable PDF containing your child’s customized full-color cover page and the exact number of interior coloring pages ordered (8, 16, 32, or 48 pages).'
    },
    {
      q: 'Is the book digital or physical?',
      a: 'All current orders are instant high-resolution digital PDFs designed for easy at-home printing or binding at any local print shop. Physical printed books are currently marked as coming soon while automated printing fulfillment is finalized.'
    },
    {
      q: 'What kind of photo works best?',
      a: 'A well-lit, close-up photo showing your child looking towards the camera with a clear smile. Avoid photos where the face is heavily shadowed, blurry, or covered by sunglasses or hats.'
    },
    {
      q: 'How does MyColoringStar handle child photos and privacy?',
      a: 'Uploaded photos are processed in temporary server memory solely to generate the likeness line art for your order. We never sell, share, or train public AI models on your child’s photos. Review our Privacy Policy for full details.'
    },
    {
      q: 'What printer paper is recommended?',
      a: 'Standard 20-24 lb copy paper works wonderfully for crayons and colored pencils. For markers or watercolor pencils, we recommend 65 lb+ (160+ gsm) cardstock to prevent bleed-through.'
    },
    {
      q: 'What is your refund policy?',
      a: 'If a technical issue prevents your coloring book from generating properly, our support team will regenerate your book or issue a full refund. Because these are custom personalized products, refunds are not offered for user-entered typos or uploading the wrong photo once generation completes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/40 text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-12 pb-8 mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-3 text-xs sm:text-sm font-semibold tracking-wide text-amber-800 bg-amber-100/90 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-orange-500" /> Turn Your Child Into The Main Character
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
          Personalized Coloring Pages <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
            Starring Your Kid!
          </span>
        </h1>
        
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 mb-6">
          Add their name, attach a photo, pick an adventure world, and get an instant keepsake coloring book ready for crayons.
        </p>

        {/* STEP 1: CONFIGURATION CARD */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 bg-white border-2 border-orange-200/80 rounded-3xl shadow-lg space-y-5 text-left">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600">
              Step 1: Set Up Character &amp; Package
            </span>
            <span className="text-xs font-bold text-slate-400">Takes 15 seconds</span>
          </div>

          {/* Child's Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Child&apos;s First Name
            </label>
            <input
              type="text"
              placeholder="e.g. Leo, Maya, Oliver..."
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 focus:bg-white font-bold transition text-slate-900 placeholder:font-normal"
            />
          </div>

          {/* Package Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Choose Book Size
              </label>
              <span className="text-[11px] font-bold text-slate-400">All include full-color cover</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/80 ring-1 ring-orange-400 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500">{pkg.name}</div>
                      <div className="text-xs font-bold text-slate-800">{pkg.id} Pages</div>
                    </div>
                    <div className="text-xs font-black text-orange-600 mt-1">{pkg.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Child Photo Upload */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Child Face Photo <span className="text-slate-400 font-normal lowercase">(for likeness matching)</span>
            </label>

            {photoPreview ? (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <img
                  src={photoPreview}
                  alt="Uploaded preview"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Photo attached and optimized!
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      try {
                        sessionStorage.removeItem('hero_child_photo');
                        sessionStorage.removeItem('childPhotoPreview');
                      } catch {}
                    }}
                    className="text-xs text-rose-600 hover:underline font-semibold mt-0.5"
                  >
                    Change or replace photo
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-orange-300 hover:border-orange-400 bg-orange-50/30 hover:bg-orange-50/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center group">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center group-hover:scale-110 transition">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Click to upload clear front face photo</span>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Max 15MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}

            {validationError && (
              <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* CHOOSE A THEME BUTTON */}
          <button
            type="button"
            onClick={scrollToThemes}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <span>Choose Adventure Theme ({selectedPackage} Pages)</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          {/* Photo Privacy Trust Link */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1 text-center">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Processed in temporary memory. Never sold or trained publicly.</span>
            </div>
            <Link href="/privacy" className="text-orange-600 hover:underline font-bold">
              How we handle your photos
            </Link>
          </div>

        </div>
      </section>

      {/* 2. THEMES SHOWCASE */}
      <section ref={themesSectionRef} className="px-4 pb-16 max-w-7xl mx-auto scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
              Step 2: Choose Theme
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Pick An Adventure World
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Click any world to see {childName.trim() || 'your child'} transformed inside that coloring story.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition"
              aria-label="Previous themes"
            >
              ⬅️
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition"
              aria-label="Next themes"
            >
              ➡️
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* HORIZONTAL SWIPING TRACK */}
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory focus:outline-none"
          style={{ scrollbarWidth: 'thin' }}
        >
          {filteredThemes.map((theme) => (
            <div
              key={theme.slug}
              onClick={() => handleSelectTheme(theme.slug)}
              className="min-w-[280px] sm:min-w-[320px] snap-start bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 cursor-pointer text-left"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={theme.previewImage}
                  alt={`${theme.name} preview`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const placeholder = parent.querySelector('.fallback-box');
                      if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                
                <div className="fallback-box hidden w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex-col items-center justify-center p-4 text-center">
                  <div className="text-3xl mb-1">🎨</div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{theme.name}</span>
                </div>

                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm">
                  {theme.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-orange-500 transition">
                    {theme.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Personalized adventure coloring book ({selectedPackage} pages)
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    Preview {childName.trim() || 'Hero'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-100 group-hover:bg-orange-500 group-hover:text-white text-slate-700 font-bold text-xs transition">
                    Select →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW DIGITAL DELIVERY WORKS */}
      <section className="bg-orange-50/60 border-y border-orange-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-slate-900">How Instant Digital Delivery Works</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your coloring book is rendered on demand and delivered digitally right after checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-orange-200/70 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">1</div>
              <h3 className="font-bold text-sm text-slate-900">Custom Likeness Generation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our rendering engine crafts unique line-art coloring pages matching your selected adventure world and your child&apos;s joyful facial likeness.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-orange-200/70 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">2</div>
              <h3 className="font-bold text-sm text-slate-900">Download High-Res PDF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as the complete book is compiled, download the ready-to-print vector PDF directly to your smartphone, tablet, or computer.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-orange-200/70 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">3</div>
              <h3 className="font-bold text-sm text-slate-900">Print Anytime, Anywhere</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formatted for standard US Letter (8.5 x 11 in) and International A4 printers. Print single pages or the entire book as many times as you like.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE COMMERCIAL FAQ */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
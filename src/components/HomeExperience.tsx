'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  BookOpen,
  Printer,
  Palette,
  AlertCircle
} from 'lucide-react';

interface ThemeItem {
  id: number;
  name: string;
  category: string;
  slug: string;
  previewImage: string;
  genderTarget: 'boy' | 'girl' | 'all';
  blurb?: string;
}

const THEME_BLURBS: Record<string, string> = {
  'variety-pack': 'A mix of adventures, picked for you',
  superhero: 'Soar through the city in an original cape',
  princess: 'Royal adventures in an enchanted garden palace',
  astronaut: 'Floating among stars and lunar craters',
  'school-day': 'Science experiments and art projects at school',
  'jungle-explorer': 'Hidden ruins and friendly tropical birds',
  'outer-space': 'A research shuttle past ringed planets',
  'mars-mission': 'Rover driving across red canyons',
  'playing-with-animals': 'A meadow picnic with puppies and bunnies',
  'desert-adventure': 'Friendly camels on golden dunes',
  'snow-and-winter': 'Snow creatures and ice skating',
  'soccer-stadium': 'The winning goal under stadium lights',
  'basketball-champion': 'A high-energy court showdown',
  'under-the-sea': 'Dolphins and glowing coral reefs',
  'dinosaur-explorer': 'Gentle dinosaur footprints in a green vale',
  'pirate-adventure': 'Island treasure maps and a parrot friend',
  'farm-day': 'Gentle sheep and a friendly tractor',
  'fairy-forest': 'Giant glowing mushroom glades',
  'knights-and-dragons': 'Tea with a friendly miniature dragon',
  'race-car-driver': 'A colorful winding speedway',
  firefighter: 'A fire engine and kittens in a tree',
  'doctor-and-vet': 'Checking puppy heartbeats with a stethoscope',
  'chef-in-the-kitchen': 'Giant strawberry celebration cupcakes',
  'robot-world': 'Friendly solar robots with gears and dials',
  'camping-trip': 'Marshmallows under pine trees and stars',
  'ballet-and-dance': 'Leaping across a grand theater stage',
  'music-band': 'An electric guitar and a loud chorus',
  'arctic-animals': 'Ice hills with cheerful baby penguins',
  safari: 'Giraffes and zebras under umbrella trees',
  'magical-wizard-academy': 'Glowing orbs in a starlit library',
  'birthday-party': 'Birthday candles and floating balloons',
  halloween: 'Friendly glowing jack-o-lanterns',
  'winter-holidays': 'Pine boughs and twinkle lights',
  'eid-and-ramadan': 'Crescent lanterns and celebration sweets',
  'spring-flowers': 'Sunflowers and butterflies in the garden',
};

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
  { id: 21, name: 'Doctor and Vet', category: 'Jobs', slug: 'doctor-and-vet', previewImage: '/theme-previews/doctor-and-vet.png', genderTarget: 'all', blurb: 'Checking puppy heartbeats with a stethoscope' },
  { id: 22, name: 'Chef in the Kitchen', category: 'Jobs', slug: 'chef-in-the-kitchen', previewImage: '/theme-previews/chef-in-the-kitchen.png', genderTarget: 'all' },
  { id: 23, name: 'Robot World', category: 'Fantasy', slug: 'robot-world', previewImage: '/theme-previews/robot-world.png', genderTarget: 'all' },
  { id: 24, name: 'Camping Trip', category: 'Adventure', slug: 'camping-trip', previewImage: '/theme-previews/camping-trip.png', genderTarget: 'all' },
  { id: 25, name: 'Ballet and Dance', category: 'Arts', slug: 'ballet-and-dance', previewImage: '/theme-previews/ballet-and-dance.png', genderTarget: 'girl', blurb: 'Leaping across a grand theater stage' },
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

export default function HomePage() {
  const router = useRouter();
  const [childName, setChildName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [hasClaimedFree, setHasClaimedFree] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [pendingFreeClaim, setPendingFreeClaim] = useState(false);
  const [nextOffer, setNextOffer] = useState<'theme' | 'sibling' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const themesSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const offer = sessionStorage.getItem('mcs_next_offer');
      if (offer === 'theme' || offer === 'sibling') setNextOffer(offer);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('hero_child_name') || sessionStorage.getItem('hero_child_name');
      const savedPhoto = localStorage.getItem('hero_child_photo') || sessionStorage.getItem('hero_child_photo');
      const claimedLocal = localStorage.getItem('mcs_claimed_free_sample') === 'true';

      if (savedName) setChildName(savedName);
      if (savedPhoto) setPhotoPreview(savedPhoto);

      if (claimedLocal) {
        setHasClaimedFree(true);
      } else {
        fetch('/api/free-sample/check')
          .then((res) => res.json())
          .then((data) => {
            if (data?.claimed) {
              setHasClaimedFree(true);
              try {
                localStorage.setItem('mcs_claimed_free_sample', 'true');
              } catch {}
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  const handleNameChange = (val: string) => {
    setNameError(null);
    setChildName(val);
    try {
      localStorage.setItem('hero_child_name', val);
      sessionStorage.setItem('hero_child_name', val);
    } catch {}
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setPhotoError(null);
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
          localStorage.setItem('hero_child_photo', compressed);
          sessionStorage.setItem('hero_child_photo', compressed);
          sessionStorage.setItem('childPhotoPreview', compressed);
          localStorage.removeItem('mcs_current_order_token');
        } catch {}
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    try {
      localStorage.removeItem('hero_child_photo');
      sessionStorage.removeItem('hero_child_photo');
      sessionStorage.removeItem('childPhotoPreview');
      localStorage.removeItem('mcs_current_order_token');
    } catch {}
  };

  const validateHero = () => {
    const nextName = childName.trim() ? null : 'Enter your child’s first name.';
    const nextPhoto = photoPreview ? null : 'Add a clear front-face photo.';
    setNameError(nextName);
    setPhotoError(nextPhoto);
    const first = nextName || nextPhoto;
    setValidationError(first);
    return !first;
  };

  const handleSelectTheme = (slug: string, isFreeClaim = false) => {
    if (!validateHero()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const trimmed = childName.trim();
    try {
      localStorage.setItem('hero_child_name', trimmed);
      sessionStorage.setItem('hero_child_name', trimmed);
      if (photoPreview) {
        localStorage.setItem('hero_child_photo', photoPreview);
        sessionStorage.setItem('hero_child_photo', photoPreview);
        sessionStorage.setItem('childPhotoPreview', photoPreview);
      }
    } catch {}

    const freeParam = isFreeClaim || pendingFreeClaim ? '&claim=free' : '';
    router.push(`/theme/${slug}?name=${encodeURIComponent(trimmed)}${freeParam}`);
  };

  const startFreeClaim = () => {
    if (!validateHero()) return;
    setPendingFreeClaim(true);
    setValidationError(null);
    themesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToThemes = () => {
    setValidationError(null);
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
      a: 'You receive an instant high-resolution printable PDF containing your child’s customized full-color cover page, a personalized dedication page, the exact number of interior coloring pages ordered (4, 8, 16, or 32 pages), and an official back cover artist certificate.'
    },
    {
      q: 'Is the book digital or physical?',
      a: 'All current orders are instant high-resolution digital PDFs designed for easy at-home printing or binding at any local print shop. Physical printed books are currently marked as coming soon while automated printing fulfillment is finalized.'
    },
    {
      q: 'What kind of photo works best?',
      a: 'A well-lit, close-up photo showing the child looking towards the camera with a clear smile. Avoid photos where the face is heavily shadowed, blurry, or covered by sunglasses or hats.'
    },
    {
      q: 'How does MyColoringStar handle child photos and privacy?',
      a: 'Uploaded photos are processed in temporary server memory solely to generate the likeness line art for your order. We never sell, share, or train public AI models on child photos. Review our Privacy Policy for full details.'
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
      <section className="relative px-4 pt-12 pb-6 mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-3 text-xs sm:text-sm font-semibold tracking-wide text-amber-800 bg-amber-100/90 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-orange-500" /> Turn Your Child Into The Main Character
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
          Personalized Coloring Pages <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
            Starring Your Kid!
          </span>
        </h1>
        
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 mb-2">
          Add their name, attach a photo, pick an adventure world, and get an instant keepsake coloring book ready for crayons.
        </p>
        <p className="max-w-xl mx-auto text-xs sm:text-sm font-bold text-slate-700 mb-4">
          Free 3-page sample. Paid books are $4–$14, a digital PDF you print at home, with unlimited reprints.
        </p>
        <a href="#how-it-works" className="inline-block text-xs font-bold text-orange-600 hover:underline mb-2">
          See how it works
        </a>

        {/* QUICK TRUST PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-bold text-slate-600 pb-2">
          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" /> 100% Crisp Vector Outlines
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-100 shadow-sm">
            <Printer className="w-3.5 h-3.5 text-emerald-600" /> Standard Home Printer (US Letter &amp; A4)
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-100 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Never Used to Train AI Models
          </span>
        </div>

        {/* STEP 1: CONFIGURATION CARD (LOW FRICTION) */}
        {nextOffer && (
          <div className="max-w-xl mx-auto mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left">
            <p className="text-sm font-black text-slate-900">
              {nextOffer === 'sibling' ? 'Add the next child' : 'Pick a different theme'}
            </p>
            <p className="text-xs text-slate-600 mt-1">The next book is $3, $5, $8, or $11. The same child and the same theme again stays at the regular price.</p>
          </div>
        )}
        <div className="max-w-xl mx-auto mt-6 p-6 sm:p-8 bg-white border-2 border-orange-200/80 rounded-3xl shadow-lg space-y-5 text-left">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600">
              Step 1: Enter Name &amp; Photo
            </span>
            <span className="text-xs font-bold text-slate-400">Takes 10 seconds</span>
          </div>

          {/* Child's Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Child&apos;s First Name
            </label>
            <input
              type="text"
              placeholder="e.g. Leo, Maya, Sarah..."
              value={childName}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 focus:bg-white font-bold transition text-slate-900 placeholder:font-normal ${nameError ? 'border-rose-400' : 'border-slate-200'}`}
            />
            {nameError && <p className="mt-1.5 text-xs font-semibold text-rose-600">{nameError}</p>}
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
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Photo attached!
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs text-rose-600 hover:underline font-semibold mt-0.5 cursor-pointer"
                  >
                    Change photo
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
            {photoError && <p className="mt-1.5 text-xs font-semibold text-rose-600">{photoError}</p>}
          </div>

          {/* DYNAMIC FIRST VISIT CONVERSION OFFER */}
          {!hasClaimedFree ? (
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300/80 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  🎁 First-Time Visitor Gift
                </span>
                <span className="text-xs font-black text-emerald-700">100% Free</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Try Before You Buy</h3>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">
                  Get 1 personalized full-color cover starring your child + 2 interior coloring activity pages. Instant PDF download.
                </p>
              </div>
              <button
                type="button"
                onClick={startFreeClaim}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Make the free 3-page book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You&apos;ve unlocked your free sample! Pick an adventure below to personalize your storybook.</span>
            </div>
          )}


          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* CHOOSE A THEME BUTTON */}
          <button
            type="button"
            onClick={scrollToThemes}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <span>Choose Adventure Theme →</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          {/* Photo Privacy Trust Link */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1 text-center">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Photos are processed in temporary memory solely to generate artwork and are never stored or used to train AI models.</span>
            </div>
            <Link href="/privacy" className="text-orange-600 hover:underline font-bold">
              Privacy details
            </Link>
          </div>

        </div>
      </section>

      {/* 2. REAL BEFORE & AFTER TRANSFORMATION SHOWCASE */}
      <section id="how-it-works" className="py-8 md:py-12 px-4 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-5 md:mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
            See How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Simple Snapshot to Custom Keepsake
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
            Our engine retains your child&apos;s real smile and facial identity while illustrating clean, bold outlines ready for crayons.
          </p>
        </div>

        <div className="space-y-6 md:space-y-10">
          {[
            {
              name: 'Liam',
              theme: 'Superhero',
              photo: '/sample-child-photo.png',
              cover: '/sample-liam-cover.jpg',
              page: '/sample-liam-page.jpg'
            },
            {
              name: 'Sara',
              theme: 'Princess',
              photo: '/sample-sara-photo.jpg',
              cover: '/sample-sara-cover.jpg',
              page: '/sample-sara-page.jpg'
            }
          ].map((example) => (
            <div key={example.name}>
              <h3 className="text-sm font-black text-slate-900 mb-3">{example.name} · {example.theme}</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-6 items-stretch">
                <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200/80 p-2 md:p-5 shadow-sm flex flex-col justify-between text-left space-y-2 md:space-y-3">
                  <div>
                    <span className="inline-block text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-1.5 md:px-2.5 py-0.5 rounded-full mb-1 md:mb-2">
                      1. Photo
                    </span>
                    <h3 className="hidden md:block font-bold text-sm text-slate-900">Clear Smile Snapshot</h3>
                    <p className="hidden md:block text-xs text-slate-500 mt-0.5">
                      Any well-lit front-facing photo from your camera roll.
                    </p>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                    <img src={example.photo} alt={`${example.name}'s original photo`} className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:block text-[11px] text-slate-500 text-center font-medium">
                    ✨ Preserves hairstyle, eyes & smile
                  </div>
                </div>
                <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-orange-300 p-2 md:p-5 shadow-md flex flex-col justify-between text-left space-y-2 md:space-y-3 md:ring-2 md:ring-orange-400/20">
                  <div>
                    <span className="inline-block text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-1.5 md:px-2.5 py-0.5 rounded-full mb-1 md:mb-2">
                      2. Cover
                    </span>
                    <h3 className="hidden md:block font-bold text-sm text-slate-900">Custom Comic Book Cover</h3>
                    <p className="hidden md:block text-xs text-slate-500 mt-0.5">
                      Starring your child, with their name across the cover.
                    </p>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl md:rounded-2xl overflow-hidden bg-orange-50 border border-orange-200 shadow-inner">
                    <img src={example.cover} alt={`${example.name}'s ${example.theme} book cover`} className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:block text-[11px] text-orange-600 text-center font-bold">
                    🎨 Arrives as Page 1 of your PDF
                  </div>
                </div>
                <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-emerald-300 p-2 md:p-5 shadow-sm flex flex-col justify-between text-left space-y-2 md:space-y-3">
                  <div>
                    <span className="inline-block text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 md:px-2.5 py-0.5 rounded-full mb-1 md:mb-2">
                      3. Page
                    </span>
                    <h3 className="hidden md:block font-bold text-sm text-slate-900">Printable Vector Line Art</h3>
                    <p className="hidden md:block text-xs text-slate-500 mt-0.5">
                      A new inside scene from that theme, ready for crayons. Not a copy of the cover.
                    </p>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl md:rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-inner">
                    <img src={example.page} alt={`A coloring page from inside ${example.name}'s book`} className="w-full h-full object-contain bg-white rounded-lg md:rounded-xl" />
                  </div>
                  <div className="hidden md:block text-[11px] text-emerald-700 text-center font-bold">
                    🖨️ Ready to print at home for crayons
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Finished example</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">See exactly what a book looks like</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                These are real 4-page books. The cover is in color. Every inside page is a different scene, not a copy of the cover.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <a
                href="/sample-book.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800"
              >
                Liam's Superhero book
              </a>
              <a
                href="/sample-book-princess.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600"
              >
                Sara's Princess book
              </a>
            </div>
          </div>
          <ol className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs text-slate-700">
            <li className="rounded-2xl bg-orange-50 px-3 py-2"><strong className="block text-slate-900">1. Photo</strong>A clear picture of the child.</li>
            <li className="rounded-2xl bg-orange-50 px-3 py-2"><strong className="block text-slate-900">2. Color cover</strong>Their name and face on page 1.</li>
            <li className="rounded-2xl bg-orange-50 px-3 py-2"><strong className="block text-slate-900">3. New scenes</strong>Each coloring page is a different moment.</li>
            <li className="rounded-2xl bg-orange-50 px-3 py-2"><strong className="block text-slate-900">4. Certificate</strong>A dedication page and a page to sign.</li>
          </ol>
        </div>
      </section>

      {/* 3. THEMES SHOWCASE */}
      <section id="themes" ref={themesSectionRef} className="px-4 pb-16 max-w-7xl mx-auto scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
              Step 2: Choose Theme
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Pick An Adventure World
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Click any world to customize {childName.trim() || 'your child'}&apos;s storybook.
            </p>
            <p className="text-sm font-black text-slate-900 mt-1">
              Full books from $4. The 3-page sample is free.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition cursor-pointer"
              aria-label="Previous themes"
            >
              ⬅️
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition cursor-pointer"
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
                    {THEME_BLURBS[theme.slug] || theme.blurb || 'A personalized coloring adventure'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    Open this theme <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW DIGITAL DELIVERY WORKS */}
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
                Our rendering engine crafts unique line-art coloring pages matching your selected adventure world and the child&apos;s joyful facial likeness.
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


      {/* REVIEWS */}
      <section className="px-4 pb-10 max-w-5xl mx-auto">
        <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Parent reviews</span>
            <h2 className="text-lg font-black text-slate-900 mt-1">Made a book? Send a review</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Choose WhatsApp or email. We add a quote here only after we have read it.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a
              href="https://wa.me/15205672374?text=Hi%2C%20I%20want%20to%20leave%20a%20review%20for%20my%20MyColoringStar%20coloring%20book."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-black"
            >
              WhatsApp
            </a>
            <a
              href="mailto:support@mycoloringstar.com?subject=MyColoringStar%20review&body=Hi%2C%20I%20want%20to%20leave%20a%20review%20for%20my%20coloring%20book."
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black"
            >
              Email
            </a>
          </div>
        </div>
      </section>


      {/* 5. COMPREHENSIVE COMMERCIAL FAQ */}
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
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <div className={`px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 ${openFaq === idx ? '' : 'hidden'}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
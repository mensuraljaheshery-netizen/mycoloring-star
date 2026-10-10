'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Download,
  RefreshCw,
  AlertCircle,
  Camera,
  User,
  ShieldCheck,
  Check,
  Printer,
  ChevronRight,
  Layers,
  ChevronLeft,
  Lock,
  X,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { ThemeConfig, getThemeConfig } from '@/lib/themes';

interface ThemeCatalogItem {
  id: number;
  name: string;
  category: string;
  slug: string;
  previewImage: string;
}

const ALL_34_THEMES: ThemeCatalogItem[] = [
  { id: 0, name: 'Surprise Variety Pack', category: 'Special', slug: 'variety-pack', previewImage: '/theme-previews/variety-pack.png' },
  { id: 1, name: 'Superhero', category: 'Adventure', slug: 'superhero', previewImage: '/theme-previews/superhero.png' },
  { id: 2, name: 'Princess', category: 'Fantasy', slug: 'princess', previewImage: '/theme-previews/princess.png' },
  { id: 3, name: 'Astronaut', category: 'Space', slug: 'astronaut', previewImage: '/theme-previews/astronaut.png' },
  { id: 4, name: 'School Day', category: 'Jobs', slug: 'school-day', previewImage: '/theme-previews/school-day.png' },
  { id: 5, name: 'Jungle Explorer', category: 'Adventure', slug: 'jungle-explorer', previewImage: '/theme-previews/jungle-explorer.png' },
  { id: 6, name: 'Outer Space', category: 'Space', slug: 'outer-space', previewImage: '/theme-previews/outer-space.png' },
  { id: 7, name: 'Mars Mission', category: 'Space', slug: 'mars-mission', previewImage: '/theme-previews/mars-mission.png' },
  { id: 8, name: 'Animals', category: 'Nature', slug: 'playing-with-animals', previewImage: '/theme-previews/playing-with-animals.png' },
  { id: 9, name: 'Desert Adventure', category: 'Adventure', slug: 'desert-adventure', previewImage: '/theme-previews/desert-adventure.png' },
  { id: 10, name: 'Snow & Winter', category: 'Seasonal', slug: 'snow-and-winter', previewImage: '/theme-previews/snow-and-winter.png' },
  { id: 11, name: 'Soccer Stadium', category: 'Sports', slug: 'soccer-stadium', previewImage: '/theme-previews/soccer-stadium.png' },
  { id: 12, name: 'Basketball', category: 'Sports', slug: 'basketball-champion', previewImage: '/theme-previews/basketball-champion.png' },
  { id: 13, name: 'Under the Sea', category: 'Nature', slug: 'under-the-sea', previewImage: '/theme-previews/under-the-sea.png' },
  { id: 14, name: 'Dinosaur', category: 'Adventure', slug: 'dinosaur-explorer', previewImage: '/theme-previews/dinosaur-explorer.png' },
  { id: 15, name: 'Pirate Adventure', category: 'Adventure', slug: 'pirate-adventure', previewImage: '/theme-previews/pirate-adventure.png' },
  { id: 16, name: 'Farm Day', category: 'Nature', slug: 'farm-day', previewImage: '/theme-previews/farm-day.png' },
  { id: 17, name: 'Fairy Forest', category: 'Fantasy', slug: 'fairy-forest', previewImage: '/theme-previews/fairy-forest.png' },
  { id: 18, name: 'Knights & Dragons', category: 'Fantasy', slug: 'knights-and-dragons', previewImage: '/theme-previews/knights-and-dragons.png' },
  { id: 19, name: 'Race Car Driver', category: 'Sports', slug: 'race-car-driver', previewImage: '/theme-previews/race-car-driver.png' },
  { id: 20, name: 'Firefighter', category: 'Jobs', slug: 'firefighter', previewImage: '/theme-previews/firefighter.png' },
  { id: 21, name: 'Doctor & Vet', category: 'Jobs', slug: 'doctor-and-vet', previewImage: '/theme-previews/doctor-and-vet.png' },
  { id: 22, name: 'Chef in Kitchen', category: 'Jobs', slug: 'chef-in-the-kitchen', previewImage: '/theme-previews/chef-in-the-kitchen.png' },
  { id: 23, name: 'Robot World', category: 'Fantasy', slug: 'robot-world', previewImage: '/theme-previews/robot-world.png' },
  { id: 24, name: 'Camping Trip', category: 'Adventure', slug: 'camping-trip', previewImage: '/theme-previews/camping-trip.png' },
  { id: 25, name: 'Ballet & Dance', category: 'Sports', slug: 'ballet-and-dance', previewImage: '/theme-previews/ballet-and-dance.png' },
  { id: 26, name: 'Music Band', category: 'Jobs', slug: 'music-band', previewImage: '/theme-previews/music-band.png' },
  { id: 27, name: 'Arctic Animals', category: 'Nature', slug: 'arctic-animals', previewImage: '/theme-previews/arctic-animals.png' },
  { id: 28, name: 'Safari', category: 'Nature', slug: 'safari', previewImage: '/theme-previews/safari.png' },
  { id: 29, name: 'Wizard Academy', category: 'Fantasy', slug: 'magical-wizard-academy', previewImage: '/theme-previews/magical-wizard-academy.png' },
  { id: 30, name: 'Birthday Party', category: 'Seasonal', slug: 'birthday-party', previewImage: '/theme-previews/birthday-party.png' },
  { id: 31, name: 'Halloween', category: 'Seasonal', slug: 'halloween', previewImage: '/theme-previews/halloween.png' },
  { id: 32, name: 'Winter Holidays', category: 'Seasonal', slug: 'winter-holidays', previewImage: '/theme-previews/winter-holidays.png' },
  { id: 33, name: 'Eid & Ramadan', category: 'Seasonal', slug: 'eid-and-ramadan', previewImage: '/theme-previews/eid-and-ramadan.png' },
  { id: 34, name: 'Spring Flowers', category: 'Seasonal', slug: 'spring-flowers', previewImage: '/theme-previews/spring-flowers.png' }
];

const PACKAGES_CONFIG: Record<string, { label: string; pages: number; price: string }> = {
  '4': { label: 'Test Book (4 Pages)', pages: 4, price: 'FREE TEST' },
  '8': { label: 'Starter (8 Pages)', pages: 8, price: '$8.99' },
  '16': { label: 'Standard (16 Pages)', pages: 16, price: '$12.99' },
  '32': { label: 'Deluxe (32 Pages)', pages: 32, price: '$21.99' },
  '48': { label: 'Mega Variety (48 Pages)', pages: 48, price: '$29.99' }
};

const MAX_FREE_PREVIEWS = 3;

export default function ThemeCustomizerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slug = ((params?.slug as string) || 'superhero').toLowerCase();
  const queryGender = searchParams?.get('gender') || 'all';
  const queryName = searchParams?.get('name') || '';
  const queryPkg = searchParams?.get('pkg') || '16';

  const baseTheme: ThemeConfig = useMemo(() => {
    return getThemeConfig(slug, queryGender);
  }, [slug, queryGender]);

  const [childName, setChildName] = useState(queryName);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [packageSize, setPackageSize] = useState<string>(PACKAGES_CONFIG[queryPkg] ? queryPkg : '16');

  // FREE PREVIEW STATE
  const [isPreviewGenerating, setIsPreviewGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewCount, setPreviewCount] = useState<number>(0);

  // FULL ORDER FULFILLMENT & MODAL STATE
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isBuildingBook, setIsBuildingBook] = useState(false);
  const [fulfillmentStage, setFulfillmentStage] = useState('');
  const [downloadReadyPdf, setDownloadReadyPdf] = useState<{ url: string; filename: string } | null>(null);

  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('cmk_preview_count');
      if (storedCount) setPreviewCount(parseInt(storedCount, 10) || 0);

      const savedName = sessionStorage.getItem('hero_child_name');
      const savedPhoto = sessionStorage.getItem('hero_child_photo');
      const savedPkg = sessionStorage.getItem('mcs_selected_package');

      if (savedName && !childName) setChildName(savedName);
      if (savedPhoto) setPhotoPreview(savedPhoto);
      if (savedPkg && PACKAGES_CONFIG[savedPkg]) setPackageSize(savedPkg);
    } catch {}
  }, []);

  const handlePackageChange = (id: string) => {
    setPackageSize(id);
    try {
      sessionStorage.setItem('mcs_selected_package', id);
    } catch {}
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
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
        setPhotoPreview(compressed);
        try {
          sessionStorage.setItem('hero_child_photo', compressed);
        } catch {}
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 1. FREE SAMPLE GENERATOR
  const handleGeneratePreview = async () => {
    if (previewCount >= MAX_FREE_PREVIEWS) return;

    setIsPreviewGenerating(true);
    setErrorMessage(null);
    setGenerationStage('Preparing reference photo...');

    const stageTimer1 = setTimeout(() => setGenerationStage('Detecting child smile & features...'), 2000);
    const stageTimer2 = setTimeout(() => setGenerationStage(`Drawing ${baseTheme.name} line art...`), 5000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview || undefined,
          childName: childName || 'Little Adventurer',
          theme: baseTheme.name,
          isCover: false,
          orientation
        })
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to generate preview page.');
      }

      setPreviewImageUrl(data.imageUrl);

      const nextCount = previewCount + 1;
      setPreviewCount(nextCount);
      try {
        localStorage.setItem('cmk_preview_count', nextCount.toString());
      } catch {}

    } catch (err: any) {
      setErrorMessage(err.message || 'Generation encountered an error. Please try again.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsPreviewGenerating(false);
      setGenerationStage('');
    }
  };

  // 2. COVER ONLY GENERATOR (1 CREDIT TEST)
  const handleGenerateCoverOnly = async () => {
    if (!photoPreview) {
      setErrorMessage('Please upload a child face photo first.');
      return;
    }

    setIsBuildingBook(true);
    setDownloadReadyPdf(null);
    setFulfillmentStage(`Rendering single comic-style cover page (${orientation})...`);

    try {
      const coverRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          childName: childName || 'Hero',
          theme: baseTheme.name,
          isCover: true,
          orientation
        })
      });

      const coverData = await coverRes.json();
      if (!coverRes.ok || !coverData.imageUrl) throw new Error(coverData.error || 'Failed generating cover.');

      setFulfillmentStage('Compiling cover PDF document...');
      const pdfRes = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName || 'Hero',
          themeName: baseTheme.name,
          orientation,
          coverImage: coverData.imageUrl,
          pages: []
        })
      });

      const pdfData = await pdfRes.json();
      if (!pdfRes.ok || !pdfData.pdfUrl) throw new Error(pdfData.error || 'Failed assembling PDF document.');

      setDownloadReadyPdf({ url: pdfData.pdfUrl, filename: pdfData.filename });
      setFulfillmentStage('Cover complete! Click download below.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error generating cover. Please try again.');
    } finally {
      setIsBuildingBook(false);
    }
  };

  // 3. FREE 4-PAGE TEST BOOK (1 Cover + 3 Interior Scenes)
  const handleGenerate4PageTestBook = async () => {
    if (!photoPreview) {
      setErrorMessage('Please upload a child face photo first.');
      setIsCheckoutModalOpen(true);
      return;
    }

    setIsCheckoutModalOpen(true);
    setIsBuildingBook(true);
    setDownloadReadyPdf(null);

    try {
      // Step A: Cover
      setFulfillmentStage('Generating Book Cover (Page 1 of 4)...');
      const coverRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          childName: childName || 'Hero',
          theme: baseTheme.name,
          isCover: true,
          orientation
        })
      });
      const coverData = await coverRes.json();
      if (!coverRes.ok || !coverData.imageUrl) throw new Error(coverData.error || 'Failed generating cover');

      // Step B: 3 Interior Coloring Pages
      const pages: string[] = [];
      for (let i = 1; i <= 3; i++) {
        setFulfillmentStage(`Generating Interior Scene ${i} of 3 (Page ${i + 1} of 4)...`);
        const pageRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: photoPreview,
            childName: childName || 'Hero',
            theme: baseTheme.name,
            isCover: false,
            orientation
          })
        });
        const pageData = await pageRes.json();
        if (!pageRes.ok || !pageData.imageUrl) throw new Error(pageData.error || `Failed generating interior page ${i}`);
        pages.push(pageData.imageUrl);
      }

      // Step C: Compile 4-Page PDF
      setFulfillmentStage('Compiling 4-Page PDF document...');
      const pdfRes = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName || 'Hero',
          themeName: baseTheme.name,
          orientation,
          coverImage: coverData.imageUrl,
          pages
        })
      });

      const pdfData = await pdfRes.json();
      if (!pdfRes.ok || !pdfData.pdfUrl) throw new Error(pdfData.error || 'Failed assembling 4-page PDF document.');

      setDownloadReadyPdf({ url: pdfData.pdfUrl, filename: pdfData.filename });
      setFulfillmentStage('4-Page Test Book ready for download!');

      // Automatic download trigger
      const link = document.createElement('a');
      link.href = pdfData.pdfUrl;
      link.download = pdfData.filename || `${(childName || 'hero').toLowerCase()}-${baseTheme.slug}-test-book.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error generating test book.');
    } finally {
      setIsBuildingBook(false);
    }
  };

  // 4. FULL BATCH GENERATOR FOR CHOSEN PACKAGE
  const handleCompleteOrderAndDownload = async () => {
    if (packageSize === '4') {
      await handleGenerate4PageTestBook();
      return;
    }

    if (!photoPreview) {
      setErrorMessage('Please upload a child face photo first.');
      return;
    }

    setIsBuildingBook(true);
    setDownloadReadyPdf(null);
    setFulfillmentStage('Rendering cover & preparing page batches...');

    try {
      const totalPagesToRender = parseInt(packageSize, 10) || 8;
      const compiledPages: string[] = [];

      // 1. Kick off Cover Generation First
      const coverPromise = fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          childName: childName || 'Hero',
          theme: baseTheme.name,
          isCover: true,
          orientation
        })
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.imageUrl) throw new Error(data.error || 'Failed generating cover');
        return data.imageUrl as string;
      });

      // 2. Generate Interior Pages in Parallel Batches of 4
      const BATCH_SIZE = 4;
      for (let i = 0; i < totalPagesToRender; i += BATCH_SIZE) {
        const currentBatchCount = Math.min(BATCH_SIZE, totalPagesToRender - i);
        setFulfillmentStage(`Generating pages ${i + 1} to ${i + currentBatchCount} of ${totalPagesToRender} simultaneously...`);

        const batchPromises = Array.from({ length: currentBatchCount }).map(() =>
          fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: photoPreview,
              childName: childName || 'Hero',
              theme: baseTheme.name,
              isCover: false,
              orientation
            })
          }).then(async (res) => {
            const data = await res.json();
            if (!res.ok || !data.imageUrl) throw new Error(data.error || 'Page generation failed');
            return data.imageUrl as string;
          })
        );

        const batchResults = await Promise.all(batchPromises);
        compiledPages.push(...batchResults);
      }

      // Wait for cover to finish
      setFulfillmentStage('Finalizing cover artwork...');
      const coverUrl = await coverPromise;

      // 3. Assemble PDF
      setFulfillmentStage('Compiling vector PDF document...');
      const pdfRes = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName || 'Hero',
          themeName: baseTheme.name,
          orientation,
          coverImage: coverUrl,
          pages: compiledPages
        })
      });

      const pdfData = await pdfRes.json();
      if (!pdfRes.ok || !pdfData.pdfUrl) throw new Error(pdfData.error || 'Failed assembling PDF document.');

      setDownloadReadyPdf({ url: pdfData.pdfUrl, filename: pdfData.filename });
      setFulfillmentStage('Complete! Your personalized coloring book is ready.');

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error generating your coloring book. Please try again.');
    } finally {
      setIsBuildingBook(false);
    }
  };

  const scrollThemes = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSwitchTheme = (newSlug: string) => {
    if (childName.trim()) sessionStorage.setItem('hero_child_name', childName.trim());
    sessionStorage.setItem('mcs_selected_package', packageSize);
    router.push(`/theme/${newSlug}?name=${encodeURIComponent(childName || 'Hero')}&pkg=${packageSize}`);
  };

  const currentPkgDetails = PACKAGES_CONFIG[packageSize] || PACKAGES_CONFIG['16'];
  const remainingPreviews = Math.max(0, MAX_FREE_PREVIEWS - previewCount);
  const isPreviewLocked = previewCount >= MAX_FREE_PREVIEWS;

  const renderPreviewBox = () => (
    <div className="bg-white border-2 border-orange-100 rounded-3xl p-5 shadow-sm space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
            Live Sample
          </span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isPreviewLocked ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
          }`}>
            {isPreviewLocked ? 'All Free Previews Used' : `✨ ${remainingPreviews} of ${MAX_FREE_PREVIEWS} Free Previews Left`}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900">1-Page Free Magic Preview</h3>
        <p className="text-xs text-slate-500">
          See {childName || 'your child'} transformed into {baseTheme.name} line art.
        </p>
      </div>

      {/* Preview Screen */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 aspect-[3/4] flex items-center justify-center shadow-inner">
        {previewImageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewImageUrl}
              alt="Sample Preview"
              className="w-full h-full object-contain bg-white"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-slate-400/40 font-black text-2xl -rotate-45 tracking-widest uppercase border-4 border-slate-400/30 p-4 rounded-xl">
                MyColoringStar Preview
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-700">No Preview Generated Yet</div>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Attach a photo and tap generate below, or run a 4-page test book to verify output!
            </p>
          </div>
        )}

        {isPreviewGenerating && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Creating Sample Line Art
            </div>
            <p className="text-xs text-orange-600 font-semibold animate-pulse">
              {generationStage}
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* GENERATE FREE SAMPLE */}
      <button
        type="button"
        disabled={isPreviewGenerating || isPreviewLocked}
        onClick={handleGeneratePreview}
        className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 border shadow-sm cursor-pointer ${
          isPreviewLocked
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
            : isPreviewGenerating
            ? 'bg-orange-100 text-orange-700 border-orange-200 cursor-wait'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 active:scale-95'
        }`}
      >
        {isPreviewGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
            Rendering 1-Page Likeness Preview...
          </>
        ) : isPreviewLocked ? (
          <>
            <Lock className="w-4 h-4 text-slate-400" />
            Free Previews Used (Run 4-Page Test Below)
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-orange-500" />
            Generate Free Sample ({remainingPreviews} Left)
          </>
        )}
      </button>

      {/* FREE 4-PAGE TEST BOOK BUTTON */}
      <button
        type="button"
        disabled={isBuildingBook}
        onClick={handleGenerate4PageTestBook}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
      >
        <BookOpen className="w-4 h-4" />
        <span>✨ Test Full 4-Page Book (Free Dev Mode)</span>
      </button>

      {/* PACKAGE TIER PICKER */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div>
          <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
            Select Format:
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              className="py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 bg-white text-orange-600 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Digital PDF (Instant)
            </button>
            <div className="relative">
              <button
                type="button"
                disabled
                className="w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 text-slate-400 cursor-not-allowed bg-slate-200/50"
              >
                <Printer className="w-3.5 h-3.5" /> Printed Book
              </button>
              <span className="absolute -top-2 right-1 bg-slate-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
            Choose Package Size:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {Object.entries(PACKAGES_CONFIG)
              .filter(([key]) => key !== '4')
              .map(([key, cfg]) => {
                const isSelected = packageSize === key;
                return (
                  <div
                    key={key}
                    onClick={() => handlePackageChange(key)}
                    className={`p-2 rounded-xl border-2 cursor-pointer transition text-center ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/90 shadow-sm ring-1 ring-orange-400'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase text-slate-500">{cfg.pages} Pgs</div>
                    <div className="text-xs font-black text-orange-600">{cfg.price}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ORDER TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsCheckoutModalOpen(true)}
        className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
      >
        <span>Build {currentPkgDetails.pages}-Page Edition ({currentPkgDetails.price})</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Direct PDF Generation Active • No Payment Required in Dev</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans pb-24">
      
      {/* 1. TOP CAROUSEL OF MINI THEME CARDS */}
      <section className="bg-white border-b border-orange-100/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>

            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Swipe or click to switch adventure:
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollThemes('left')}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollThemes('right')}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none scroll-smooth"
          >
            {ALL_34_THEMES.map((t) => {
              const isActive = t.slug === slug;
              return (
                <div
                  key={t.slug}
                  onClick={() => handleSwitchTheme(t.slug)}
                  className={`cursor-pointer rounded-2xl p-1.5 transition flex-shrink-0 w-36 border text-left shadow-sm group ${
                    isActive
                      ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-400/40 shadow-orange-100'
                      : 'border-slate-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200/60 mb-1.5 flex items-center justify-center text-center">
                    <img
                      src={t.previewImage}
                      alt={t.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-200 z-10"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-[8px] font-black uppercase text-white px-1.5 py-0.5 rounded-md backdrop-blur z-20">
                      {t.category}
                    </span>
                  </div>
                  <div className={`text-xs font-black truncate px-0.5 ${isActive ? 'text-orange-600' : 'text-slate-800'}`}>
                    {t.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. THEME HERO BANNER */}
      <section className="px-4 pt-6 pb-3 max-w-5xl mx-auto text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> {baseTheme.category} Theme
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {childName ? `${childName}'s ${baseTheme.name} Adventure` : `${baseTheme.name} Coloring Book`}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {baseTheme.description}
        </p>
      </section>

      {/* 3. MOBILE PREVIEW VIEWPORT */}
      <div className="block lg:hidden px-4 max-w-md mx-auto mb-6">
        {renderPreviewBox()}
      </div>

      {/* 4. MAIN WORKSPACE */}
      <main className="px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* LEFT COLUMN: CUSTOMIZATION */}
        <div className="lg:col-span-7 space-y-6">

          {/* CHARACTER DETAILS */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" /> 1. Character Details
            </h2>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Child&apos;s First Name
              </label>
              <input
                type="text"
                placeholder="e.g. Leo, Maya"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Child Face Photo <span className="text-slate-400 font-normal lowercase">(required for likeness)</span>
              </label>

              {photoPreview ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Photo attached!
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-[11px] text-rose-600 hover:underline mt-0.5 cursor-pointer"
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/60 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer text-xs font-bold text-slate-600 hover:text-slate-900 transition">
                  <Camera className="w-4 h-4 text-orange-500" /> Click to attach child photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* ORIENTATION */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" /> 2. Book Orientation
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  orientation === 'portrait'
                    ? 'border-orange-500 bg-orange-50/70 text-slate-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-5 h-7 rounded border-2 border-current shrink-0" />
                <div>
                  <div className="text-xs font-bold">Portrait (Classic)</div>
                  <div className="text-[10px] text-slate-500">8.5 x 11 in (Letter / A4)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  orientation === 'landscape'
                    ? 'border-orange-500 bg-orange-50/70 text-slate-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-5 rounded border-2 border-current shrink-0" />
                <div>
                  <div className="text-xs font-bold">Landscape (Wide)</div>
                  <div className="text-[10px] text-slate-500">11 x 8.5 in (Panoramic)</div>
                </div>
              </button>
            </div>
          </div>

          {/* PRINTING GUIDE */}
          <div className="bg-orange-50/60 border border-orange-200 rounded-3xl p-5 space-y-2 text-xs text-slate-600">
            <div className="font-black text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-orange-500" /> Universal Print-at-Home &amp; Local Binding Guide:
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>International Paper Formats:</strong> Formatted for standard US Letter (8.5 x 11 in) and International A4 printers.</li>
              <li><strong>Paper Advice:</strong> Standard paper works great for crayons and colored pencils. Use 65 lb+ (160+ gsm) cardstock for markers.</li>
              <li><strong>Book Binding:</strong> Bring your downloaded PDF to any local print shop or office supply store for spiral or coil binding with a clear front protective sheet.</li>
            </ul>
          </div>

        </div>

        {/* RIGHT COLUMN: PREVIEW (DESKTOP ONLY) */}
        <div className="hidden lg:block lg:col-span-5 space-y-6">
          <div className="sticky top-28">
            {renderPreviewBox()}
          </div>
        </div>

      </main>

      {/* 5. CHECKOUT & IMMEDIATE PDF GENERATION MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
            
            <button
              type="button"
              disabled={isBuildingBook}
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer disabled:opacity-30"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                Direct Generation Test
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">Generate &amp; Download Book</h3>
              <p className="text-xs text-slate-500">
                Direct browser rendering mode. No payment gateway required.
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-semibold">Child Starring:</span>
                <span className="font-bold text-slate-900">{childName || 'Hero'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-semibold">Adventure Theme:</span>
                <span className="font-bold text-slate-900">{baseTheme.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-semibold">Package Selection:</span>
                <span className="font-bold text-slate-900">{currentPkgDetails.pages} Pages Total</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-semibold">Orientation:</span>
                <span className="font-bold text-slate-900 capitalize">{orientation} (Letter / A4)</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-slate-900">
                <span>Checkout Status:</span>
                <span className="text-emerald-600 text-sm font-bold">FREE DEV MODE ACTIVE</span>
              </div>
            </div>

            {/* In-Progress Staged State */}
            {isBuildingBook && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-2 text-center">
                <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-900">Building Complete Book</p>
                <p className="text-[11px] text-orange-700 font-semibold animate-pulse">{fulfillmentStage}</p>
              </div>
            )}

            {/* Ready to Download State */}
            {downloadReadyPdf && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Your Coloring Book Is Ready!</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{downloadReadyPdf.filename}</p>
                </div>
                <a
                  href={downloadReadyPdf.url}
                  download={downloadReadyPdf.filename}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Download className="w-4 h-4" /> Download Printable PDF Now
                </a>
              </div>
            )}

            {/* Action Buttons */}
            {!downloadReadyPdf && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isBuildingBook}
                  onClick={handleGenerate4PageTestBook}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Generate Full 4-Page Test Book (1 Cover + 3 Scenes)</span>
                </button>

                <button
                  type="button"
                  disabled={isBuildingBook}
                  onClick={handleGenerateCoverOnly}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Test Cover Page Only (1 Credit)</span>
                </button>

                <button
                  type="button"
                  disabled={isBuildingBook}
                  onClick={handleCompleteOrderAndDownload}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Generate Full Package ({currentPkgDetails.pages} Pages)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="text-center text-[10px] text-slate-400">
              Direct Local Rendering • High-Resolution Vector PDF Output
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
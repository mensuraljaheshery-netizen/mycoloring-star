'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
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
  X,
  FileCheck,
  BookOpen,
  Lock
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
  { id: 25, name: 'Ballet & Dance', category: 'Arts', slug: 'ballet-and-dance', previewImage: '/theme-previews/ballet-and-dance.png' },
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

const PACKAGES_CONFIG: Record<string, { label: string; pages: number; price: string; popular?: boolean }> = {
  '4': { label: 'Theme Try (4 Pages)', pages: 4, price: '$4', popular: false },
  '8': { label: 'Standard (8 Pages)', pages: 8, price: '$7', popular: false },
  '16': { label: 'Most Popular (16 Pages)', pages: 16, price: '$10', popular: true },
  '32': { label: 'Deluxe Storybook (32 Pages)', pages: 32, price: '$14', popular: false }
};

export default function ThemeCustomizerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const freeProgressRef = useRef<{ cover: string; pages: string[]; photoSig: string } | null>(null);

  const slug = ((params?.slug as string) || 'superhero').toLowerCase();
  const queryGender = searchParams?.get('gender') || 'all';
  const queryName = searchParams?.get('name') || '';
  const queryPkg = searchParams?.get('pkg') || '';

  const baseTheme: ThemeConfig = useMemo(() => {
    return getThemeConfig(slug, queryGender);
  }, [slug, queryGender]);

  const [childName, setChildName] = useState(queryName);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [packageSize, setPackageSize] = useState<string>(
    PACKAGES_CONFIG[queryPkg] ? queryPkg : '8'
  );
  const [parentConsent, setParentConsent] = useState(false);

  // FREE SAMPLE STATUS
  const [hasClaimedFree, setHasClaimedFree] = useState(false);

  // ORDER MODAL & FULFILLMENT STATES
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isBuildingBook, setIsBuildingBook] = useState(false);
  const [fulfillmentStage, setFulfillmentStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);
  const [downloadReadyPdf, setDownloadReadyPdf] = useState<{ url: string; filename: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem('mcs_bundle_data');
      sessionStorage.removeItem('mcs_bundle_data');
    } catch {}

    const syncState = () => {
      try {
        const savedName = localStorage.getItem('hero_child_name') || sessionStorage.getItem('hero_child_name');
        const savedPhoto = localStorage.getItem('hero_child_photo') || sessionStorage.getItem('hero_child_photo');
        const savedPkg = localStorage.getItem('mcs_selected_package') || sessionStorage.getItem('mcs_selected_package');
        const savedConsent = localStorage.getItem('mcs_parent_consent') === 'true';
        const claimedLocal = localStorage.getItem('mcs_claimed_free_sample') === 'true';

        if (savedConsent) {
          setParentConsent(true);
        }

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

        if (queryName) {
          setChildName(queryName);
        } else if (savedName) {
          setChildName(savedName);
        }

        if (savedPhoto) {
          setPhotoPreview(savedPhoto);
        } else {
          setPhotoPreview(null);
        }

        if (queryPkg && PACKAGES_CONFIG[queryPkg]) {
          setPackageSize(queryPkg);
        } else if (savedPkg && PACKAGES_CONFIG[savedPkg]) {
          setPackageSize(savedPkg);
        } else {
          setPackageSize('8');
        }
      } catch {}
    };

    syncState();

    window.addEventListener('storage', syncState);
    window.addEventListener('focus', syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('focus', syncState);
    };
  }, [queryName, queryPkg, slug]);

  const handleNameChange = (val: string) => {
    setChildName(val);
    try {
      localStorage.setItem('hero_child_name', val);
      sessionStorage.setItem('hero_child_name', val);
    } catch {}
  };

  const handlePackageChange = (id: string) => {
    setPackageSize(id);
    try {
      localStorage.setItem('mcs_selected_package', id);
      sessionStorage.setItem('mcs_selected_package', id);
    } catch {}
  };

  const handleConsentToggle = (checked: boolean) => {
    setParentConsent(checked);
    if (checked) {
      setErrorMessage(null);
      setModalErrorMessage(null);
    }
    try {
      localStorage.setItem('mcs_parent_consent', checked ? 'true' : 'false');
      sessionStorage.setItem('mcs_parent_consent', checked ? 'true' : 'false');
    } catch {}
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setModalErrorMessage(null);
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

  const ensureBase64 = async (src: string): Promise<string> => {
    if (src.startsWith('data:image')) return src;
    const res = await fetch(src);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const buildPdfInBrowser = async (coverUrl: string | null, pageUrls: string[]) => {
    const isLandscape = orientation === 'landscape';
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Cover Page
    if (coverUrl) {
      try {
        const coverBase64 = await ensureBase64(coverUrl);
        const props = doc.getImageProperties(coverBase64);
        const imgRatio = props.width / props.height;
        const pageRatio = pageWidth / pageHeight;

        let drawW = pageWidth;
        let drawH = pageHeight;
        let drawX = 0;
        let drawY = 0;

        if (imgRatio > pageRatio) {
          drawH = pageHeight;
          drawW = pageHeight * imgRatio;
          drawX = -(drawW - pageWidth) / 2;
        } else {
          drawW = pageWidth;
          drawH = pageWidth / imgRatio;
        }

        doc.addImage(coverBase64, 'PNG', drawX, drawY, drawW, drawH, undefined, 'FAST');
      } catch (err) {
        console.error('Failed to embed cover in PDF:', err);
      }
    }

    // 2. Dedication Page
    doc.addPage();
    doc.setFillColor(255, 253, 249);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.text(`${childName || 'Hero'}'s`, pageWidth / 2, pageHeight * 0.32, { align: 'center' });
    doc.text(`${baseTheme.name} Coloring Book`, pageWidth / 2, pageHeight * 0.40, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139);
    doc.text('A personalized coloring adventure created just for you!', pageWidth / 2, pageHeight * 0.48, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text('Colored with love by: ________________________________', pageWidth / 2, pageHeight * 0.58, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('Published by MyColoringStar • www.mycoloringstar.com', pageWidth / 2, pageHeight - 35, { align: 'center' });

    // 3. Interior Pages
    for (let i = 0; i < pageUrls.length; i++) {
      const pUrl = pageUrls[i];
      if (!pUrl) continue;
      try {
        doc.addPage();
        const pageBase64 = await ensureBase64(pUrl);
        const props = doc.getImageProperties(pageBase64);
        const imgRatio = props.width / props.height;

        const margin = 24;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;

        let w = maxW;
        let h = maxW / imgRatio;
        if (h > maxH) {
          h = maxH;
          w = maxH * imgRatio;
        }

        const x = margin + (maxW - w) / 2;
        const y = margin + (maxH - h) / 2;

        doc.addImage(pageBase64, 'PNG', x, y, w, h, undefined, 'FAST');
      } catch (err) {
        console.error(`Failed to embed page ${i + 1} in PDF:`, err);
      }
    }

    const filename = `MyColoringStar_${(childName || 'Hero').replace(/\s+/g, '_')}_${baseTheme.slug}.pdf`;
    doc.save(filename);

    const pdfBlob = doc.output('blob');
    const blobUrl = window.URL.createObjectURL(pdfBlob);
    setDownloadReadyPdf({ url: blobUrl, filename });
  };

  const freeProgressKey = `mcs_free_progress_${baseTheme.slug}`;

  const readFreeProgress = () => {
    const empty = { cover: '', pages: [] as string[], photoSig: '' };
    try {
      const raw = sessionStorage.getItem(freeProgressKey) || localStorage.getItem(freeProgressKey);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      const photoSig = photoPreview ? `${photoPreview.length}` : '';
      if (parsed.photoSig && photoSig && parsed.photoSig !== photoSig) return empty;
      return {
        cover: typeof parsed.cover === 'string' ? parsed.cover : '',
        pages: Array.isArray(parsed.pages) ? parsed.pages.filter((url: unknown) => typeof url === 'string' && url) : [],
        photoSig: parsed.photoSig || photoSig
      };
    } catch {
      return empty;
    }
  };

  const writeFreeProgress = (progress: { cover: string; pages: string[]; photoSig: string }) => {
    freeProgressRef.current = progress;
    const raw = JSON.stringify(progress);
    try {
      sessionStorage.setItem(freeProgressKey, raw);
    } catch {}
    try {
      localStorage.setItem(freeProgressKey, raw);
    } catch {}
  };

  const clearFreeProgress = () => {
    freeProgressRef.current = null;
    try {
      sessionStorage.removeItem(freeProgressKey);
      localStorage.removeItem(freeProgressKey);
    } catch {}
  };

  // 1. FREE 3-PAGE MINI-BOOK
  const handleGenerate3PageFreeBook = async () => {
    if (!parentConsent) {
      setErrorMessage('Please check the consent box below before claiming your free mini-book.');
      return;
    }

    if (!photoPreview) {
      setErrorMessage('Please upload a clear face photo of the child first.');
      return;
    }

    setErrorMessage(null);
    setModalErrorMessage(null);
    setIsBuildingBook(true);
    setDownloadReadyPdf(null);

    const photoSig = `${photoPreview.length}`;
    const stored = freeProgressRef.current?.photoSig === photoSig ? freeProgressRef.current : readFreeProgress();
    const progress = { cover: stored.cover, pages: [...stored.pages], photoSig };
    freeProgressRef.current = progress;

    const generatePage = async (payload: Record<string, unknown>, label: string) => {
      let lastError = 'Failed generating this page';
      for (let attempt = 1; attempt <= 3; attempt++) {
        setFulfillmentStage(attempt === 1 ? label : `${label} Trying again (${attempt} of 3)...`);
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok && data.imageUrl) return data.imageUrl as string;
          lastError = data.error || lastError;
          if (res.status === 403) throw new Error(lastError);
        } catch (err: any) {
          lastError = err.message || lastError;
          if (lastError.toLowerCase().includes('free sample')) throw new Error(lastError);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      throw new Error(lastError);
    };

    try {
      if (!progress.cover) {
        progress.cover = await generatePage({
          imageBase64: photoPreview,
          childName: childName || 'Hero',
          theme: baseTheme.name,
          isCover: true,
          orientation,
          paperSize: 'letter'
        }, 'Designing Personalized Cover (1 of 3)...');
        writeFreeProgress(progress);
      }

      while (progress.pages.length < 2) {
        const pageNumber = progress.pages.length + 1;
        const pageUrl = await generatePage({
          imageBase64: photoPreview,
          childName: childName || 'Hero',
          theme: baseTheme.name,
          isCover: false,
          orientation,
          paperSize: 'letter'
        }, `Drawing coloring page ${pageNumber} of 2...`);
        progress.pages.push(pageUrl);
        writeFreeProgress(progress);
      }

      setFulfillmentStage('Compiling printable 3-page mini-book PDF...');
      await buildPdfInBrowser(progress.cover, progress.pages.slice(0, 2));
      setFulfillmentStage('Your Free 3-Page Mini-Book is ready!');

      try {
        await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            finalizeFreeClaim: true,
            childName: childName || 'Hero',
            theme: baseTheme.name
          })
        });
      } catch {}

      setHasClaimedFree(true);
      try {
        localStorage.setItem('mcs_claimed_free_sample', 'true');
      } catch {}
      clearFreeProgress();
    } catch (err: any) {
      console.error(err);
      const finished = (progress.cover ? 1 : 0) + progress.pages.length;
      setErrorMessage(
        finished > 0
          ? `${err.message || 'Error generating free mini-book.'} ${finished} of 3 pages are saved. Press the button again to continue from the page that failed.`
          : err.message || 'Error generating free mini-book.'
      );
    } finally {
      setIsBuildingBook(false);
    }
  };

  // 2. PAID CHECKOUT: REDIRECT DIRECTLY TO WHOP
  const handleProceedToPaidGeneration = async () => {
    if (!parentConsent) {
      setModalErrorMessage('Please confirm parental or gift-giver consent by checking the box.');
      return;
    }

    if (!photoPreview) {
      setErrorMessage('Please upload a clear face photo of the child first.');
      setIsCheckoutModalOpen(false);
      return;
    }

    const orderToken = `ord_${Date.now()}`;

    try {
      localStorage.removeItem('mcs_bundle_data');
      sessionStorage.removeItem('mcs_bundle_data');

      localStorage.setItem('mcs_selected_theme', baseTheme.name);
      localStorage.setItem('mcs_selected_package', packageSize);
      localStorage.setItem('mcs_selected_orientation', orientation);
      localStorage.setItem('hero_child_name', (childName || 'Hero').trim());
      localStorage.setItem('hero_child_photo', photoPreview);
      localStorage.setItem('mcs_current_order_token', orderToken);
      localStorage.setItem('mcs_parent_consent', 'true');

      sessionStorage.setItem('mcs_selected_theme', baseTheme.name);
      sessionStorage.setItem('mcs_selected_package', packageSize);
      sessionStorage.setItem('mcs_selected_orientation', orientation);
      sessionStorage.setItem('hero_child_name', (childName || 'Hero').trim());
      sessionStorage.setItem('hero_child_photo', photoPreview);
      sessionStorage.setItem('mcs_current_order_token', orderToken);
      sessionStorage.setItem('mcs_parent_consent', 'true');
    } catch (e) {
      console.warn('Storage persistence issue:', e);
    }

    setModalErrorMessage(null);
    setIsBuildingBook(true);
    setFulfillmentStage('Connecting to secure Whop checkout...');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSize,
          childName: childName || 'Hero',
          theme: baseTheme.name,
          orientation
        })
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned an unexpected response. Please verify Vercel environment variables.');
      }

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Unable to initialize checkout session with payment provider.');
      }

      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setModalErrorMessage(err.message || 'Payment service is connecting. Please try again shortly.');
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
    try {
      if (childName.trim()) {
        localStorage.setItem('hero_child_name', childName.trim());
        sessionStorage.setItem('hero_child_name', childName.trim());
      }
      localStorage.setItem('mcs_selected_package', packageSize);
      sessionStorage.setItem('mcs_selected_package', packageSize);
    } catch {}
    router.push(`/theme/${newSlug}?name=${encodeURIComponent(childName || 'Hero')}&pkg=${packageSize}`);
  };

  const currentPkgDetails = PACKAGES_CONFIG[packageSize] || PACKAGES_CONFIG['8'];

  const initiatePaidOrderModal = () => {
    if (!parentConsent) {
      setErrorMessage('Please confirm consent by ticking the checkbox below.');
      return;
    }
    if (!photoPreview) {
      setErrorMessage('Please upload a clear face photo of the child before ordering.');
      return;
    }
    setErrorMessage(null);
    setModalErrorMessage(null);
    setIsCheckoutModalOpen(true);
  };

  const renderActionBox = () => (
    <div className="space-y-5">
      <div className="bg-white border-2 border-orange-100 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* CONDITIONAL FREE SAMPLE SECTION */}
        {!hasClaimedFree ? (
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Free Gift Offer
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                🎁 3-Page Mini-Book
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900">Try Before You Buy</h3>
            <p className="text-xs text-slate-600 leading-snug">
              Get 1 full-color personalized cover + 2 interior coloring pages. Instant download, no signup required.
            </p>
            <button
              type="button"
              disabled={isBuildingBook}
              onClick={handleGenerate3PageFreeBook}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isBuildingBook ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Building Mini-Book ({fulfillmentStage})...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>{freeProgressRef.current?.cover || freeProgressRef.current?.pages.length ? 'Continue Free 3-Page Mini-Book' : 'Claim Free 3-Page Mini-Book (Instant PDF)'}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 text-xs text-slate-600">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You&apos;ve unlocked your free sample! Ready to order the full storybook?</span>
          </div>
        )}

        {/* INLINE STATUS: PDF READY FOR DOWNLOAD */}
        {downloadReadyPdf && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Your Mini-Book Is Ready!</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">{downloadReadyPdf.filename}</p>
            </div>
            <a
              href={downloadReadyPdf.url}
              download={downloadReadyPdf.filename}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Download className="w-4 h-4" /> Download Printable PDF Now
            </a>
            <a
              href={`https://wa.me/15205672374?text=${encodeURIComponent(`Hi, I want to leave a review for ${childName || 'my child'}'s ${baseTheme.name} coloring book.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              Leave a review on WhatsApp
            </a>
          </div>
        )}

        {/* PACKAGE TIER PICKER (4, 8, 16, 32 PAGES) */}
        <div className="space-y-3">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-black uppercase text-slate-500">
                Choose Book Size:
              </label>
              <Link href="/pricing" target="_blank" className="text-[10px] text-orange-600 font-bold hover:underline">
                Compare tiers
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PACKAGES_CONFIG).map(([key, cfg]) => {
                const isSelected = packageSize === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePackageChange(key)}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-left relative ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/90 shadow-sm ring-1 ring-orange-400'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {cfg.popular && (
                      <span className="absolute -top-2 right-2 bg-orange-500 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="text-[10px] font-black uppercase text-slate-500">{cfg.pages} Pages</div>
                    <div className="text-xs font-black text-slate-900 leading-tight">{cfg.label.split(' (')[0]}</div>
                    <div className="text-xs font-black text-orange-600 mt-0.5">{cfg.price}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONSENT CHECKBOX RIGHT BEFORE ACTION */}
        <div className="pt-1">
          <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200/80 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="themePageConsent"
              checked={parentConsent}
              onChange={(e) => handleConsentToggle(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-400 border-slate-300 cursor-pointer shrink-0"
            />
            <label htmlFor="themePageConsent" className="text-[11px] text-slate-700 leading-snug cursor-pointer select-none">
              I confirm that I am the parent/guardian, or have parental permission, to use this photo to create this coloring book in accordance with the{' '}
              <Link href="/privacy" target="_blank" className="text-orange-600 font-bold underline hover:text-orange-700">
                Privacy Policy
              </Link>.
            </label>
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FULL PACKAGE ORDER BUTTON */}
        <button
          type="button"
          onClick={initiatePaidOrderModal}
          className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Order {currentPkgDetails.pages}-Page Edition ({currentPkgDetails.price})</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Fulfillment via Whop &bull; Instant Vector PDF</span>
        </div>
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

      {/* 3. MOBILE ACTION BOX */}
      <div className="block lg:hidden px-4 max-w-md mx-auto mb-6">
        {renderActionBox()}
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
                onChange={(e) => handleNameChange(e.target.value)}
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
                      onClick={handleRemovePhoto}
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

        {/* RIGHT COLUMN: ACTION BOX (DESKTOP ONLY) */}
        <div className="hidden lg:block lg:col-span-5 space-y-6">
          <div className="sticky top-28">
            {renderActionBox()}
          </div>
        </div>

      </main>

      {/* 5. PAID ORDER / CHECKOUT MODAL */}
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
                {isBuildingBook ? 'Connecting Gateway' : 'Secure Order Checkout'}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {currentPkgDetails.pages}-Page {baseTheme.name} Edition
              </h3>
              <p className="text-xs text-slate-500">
                Instant Digital PDF Delivery • Print at Home Anywhere
              </p>
            </div>

            {/* ORDER SUMMARY */}
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
                <span className="text-slate-500 font-semibold">Package Edition:</span>
                <span className="font-bold text-orange-600">{currentPkgDetails.pages} Pages ({currentPkgDetails.price})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-semibold">Orientation:</span>
                <span className="font-bold text-slate-900 capitalize">{orientation} (Letter / A4)</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-slate-900">
                <span>Total Due:</span>
                <span className="text-orange-600 text-base">{currentPkgDetails.price}</span>
              </div>
            </div>

            {/* CONSENT CONFIRMATION */}
            <div className="p-3 bg-orange-50/40 rounded-xl border border-orange-200/70 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="modalConsentCheckbox"
                checked={parentConsent}
                onChange={(e) => handleConsentToggle(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-400 border-slate-300 cursor-pointer shrink-0"
              />
              <label htmlFor="modalConsentCheckbox" className="text-[11px] text-slate-600 leading-snug cursor-pointer select-none">
                I confirm that I am authorized to submit this photo to create this coloring book in accordance with the{' '}
                <Link href="/privacy" target="_blank" className="text-orange-600 font-bold underline hover:text-orange-700">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms" target="_blank" className="text-orange-600 font-bold underline hover:text-orange-700">
                  Terms of Service
                </Link>.
              </label>
            </div>

            {modalErrorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{modalErrorMessage}</span>
              </div>
            )}

            {/* IN-PROGRESS STATUS */}
            {isBuildingBook && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-2 text-center">
                <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-900">Connecting to Checkout Gateway</p>
                <p className="text-[11px] text-orange-700 font-semibold animate-pulse">{fulfillmentStage}</p>
              </div>
            )}

            {!isBuildingBook && (
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToPaidGeneration}
                  className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Secure Checkout ({currentPkgDetails.price})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Credit Card &bull; Apple Pay &bull; 256-bit Encrypted Checkout via Whop</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
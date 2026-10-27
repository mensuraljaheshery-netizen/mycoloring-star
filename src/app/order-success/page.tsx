'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import {
  Download,
  RefreshCw,
  AlertCircle,
  BookOpen,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface GeneratedBookResult {
  childName: string;
  theme: string;
  pdfUrl: string;
  filename: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function toTitleCase(str: string): string {
  if (!str) return 'Hero';
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(true);
  const [progressText, setProgressText] = useState('Initializing order...');
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [completedBook, setCompletedBook] = useState<GeneratedBookResult | null>(null);
  const isRunningRef = useRef(false);

  const fetchWithRetry = async (payload: any, retries = 3): Promise<string> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok && data.imageUrl) return data.imageUrl;

        const msg = data.error || `HTTP ${res.status}`;
        if (attempt === retries) throw new Error(msg);
        await sleep(2500);
      } catch (err: any) {
        if (attempt === retries) throw new Error(err.message || 'Connection interrupted');
        await sleep(2500);
      }
    }
    throw new Error('Failed to generate image after retries.');
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

  const createBookPdf = async (
    childName: string,
    theme: string,
    coverUrl: string,
    pageUrls: string[],
    bookOrientation: 'portrait' | 'landscape' = 'portrait'
  ): Promise<{ url: string; filename: string }> => {
    const formattedName = toTitleCase(childName);
    const formattedTheme = toTitleCase(theme);

    const doc = new jsPDF({
      orientation: bookOrientation,
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Cover Page
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
      console.error('Error drawing cover:', err);
    }

    // 2. Magical Storybook Title & Dedication Page
    doc.addPage();
    doc.setFillColor(255, 253, 249);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative inner parchment border
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(2);
    doc.rect(28, 28, pageWidth - 56, pageHeight - 56);
    doc.setDrawColor(253, 230, 138);
    doc.setLineWidth(0.75);
    doc.rect(34, 34, pageWidth - 68, pageHeight - 68);

    // Header Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(217, 119, 6);
    doc.text('OFFICIAL HERO EDITION', pageWidth / 2, 75, { align: 'center' });

    // Main Storybook Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.text(`Welcome to ${formattedName}'s World!`, pageWidth / 2, 130, { align: 'center' });

    doc.setFontSize(20);
    doc.setTextColor(234, 88, 12);
    doc.text(`A ${formattedTheme} Coloring Adventure`, pageWidth / 2, 165, { align: 'center' });

    // Dedication Note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    const storyDedication = [
      `Dear ${formattedName},`,
      '',
      `This magical adventure was created especially for you!`,
      `Every page is waiting for your creativity and imagination.`,
      `Grab your favorite colors, markers, and crayons, and bring this epic journey to life!`
    ];
    doc.text(storyDedication, pageWidth / 2, 230, { align: 'center', lineHeightFactor: 1.5 });

    // Fill-in lines for parents and child
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('This special book belongs to:', pageWidth / 2, 380, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('____________________________________________________', pageWidth / 2, 405, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Colored with love by:', pageWidth / 2, 460, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('____________________________________________________', pageWidth / 2, 485, { align: 'center' });

    // Subtle Brand Footprint
    doc.setFontSize(9);
    doc.setTextColor(160, 174, 192);
    doc.text('Published by MyColoringStar • www.mycoloringstar.com', pageWidth / 2, pageHeight - 45, { align: 'center' });

    // 3. Interior Coloring Pages
    for (const pUrl of pageUrls) {
      doc.addPage();
      try {
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
        console.error('Error drawing interior page:', err);
      }
    }

    // 4. Completed Artist Certificate Back Cover
    doc.addPage();
    doc.setFillColor(255, 253, 249);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(2);
    doc.rect(28, 28, pageWidth - 56, pageHeight - 56);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text('Official Artist Certificate', pageWidth / 2, 220, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(71, 85, 105);
    const certText = [
      `This certifies that`,
      ``,
      `${formattedName}`,
      ``,
      `has completed this personalized coloring book with bravery, creativity, and imagination!`,
      ``,
      `Signed: __________________________    Date: ______________`
    ];
    doc.text(certText, pageWidth / 2, 270, { align: 'center', lineHeightFactor: 1.6 });

    doc.setFontSize(9);
    doc.setTextColor(160, 174, 192);
    doc.text('MyColoringStar Keepsake Edition • Made with Love', pageWidth / 2, pageHeight - 45, { align: 'center' });

    const cleanChild = formattedName.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanTheme = formattedTheme.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `MyColoringStar_${cleanChild}_${cleanTheme}.pdf`;
    const blob = doc.output('blob');
    const url = window.URL.createObjectURL(blob);
    return { url, filename };
  };

  const runGenerationPipeline = async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setError(null);
    setIsGenerating(true);

    try {
      const childName = localStorage.getItem('hero_child_name') || 'Hero';
      const theme = localStorage.getItem('mcs_selected_theme') || 'superhero';
      const photo = localStorage.getItem('hero_child_photo');
      const orderToken = localStorage.getItem('mcs_current_order_token') || searchParams.get('order_id') || 'default_order';
      const bookOrientation =
        (localStorage.getItem('mcs_selected_orientation') || sessionStorage.getItem('mcs_selected_orientation')) === 'landscape'
          ? 'landscape'
          : 'portrait';

      // 1. Check if finalized PDF is already saved in session
      const cachedPdf = localStorage.getItem(`mcs_completed_pdf_${orderToken}`);
      const cachedFilename = localStorage.getItem(`mcs_completed_filename_${orderToken}`);

      if (cachedPdf && cachedFilename) {
        setCompletedBook({
          childName,
          theme,
          pdfUrl: cachedPdf,
          filename: cachedFilename
        });
        setIsGenerating(false);
        isRunningRef.current = false;
        return;
      }

      const urlPkg = searchParams.get('package');
      const rawPkg = urlPkg || localStorage.getItem('mcs_selected_package') || '4';
      const totalPages = Math.min(32, Math.max(4, parseInt(rawPkg, 10) || 4));
      
      // Deliver the full advertised count of coloring sheets (4 = 4 full coloring pages + cover)
      const interiorCount = totalPages;
      const totalBookAssets = interiorCount + 1; // 1 cover + N coloring pages

      setCurrentProgress({ current: 0, total: totalBookAssets });

      if (!photo) {
        throw new Error('Photo data not found in session. Please return to the customizer.');
      }

      // 2. Check for previously generated cover to resume seamlessly
      let coverUrl = localStorage.getItem(`mcs_progress_cover_${orderToken}`);
      if (!coverUrl) {
        setProgressText(`Painting personalized cover for ${toTitleCase(childName)}...`);
        coverUrl = await fetchWithRetry({
          imageBase64: photo,
          childName,
          theme,
          isCover: true,
          orientation: bookOrientation,
          orderId: orderToken
        });
        try {
          localStorage.setItem(`mcs_progress_cover_${orderToken}`, coverUrl);
        } catch (e) {
          console.warn('Cover progress caching skipped due to quota limits:', e);
        }
      }

      // 3. Check for previously generated interior pages
      let interiorUrls: string[] = [];
      try {
        const savedPagesRaw = localStorage.getItem(`mcs_progress_pages_${orderToken}`);
        if (savedPagesRaw) {
          interiorUrls = JSON.parse(savedPagesRaw);
        }
      } catch (e) {
        console.warn('Failed to parse cached pages, starting fresh in memory:', e);
      }

      setCurrentProgress({ current: 1 + interiorUrls.length, total: totalBookAssets });

      // 4. Continue generation in batches of 3 starting from existing index
      const BATCH_SIZE = 3;
      while (interiorUrls.length < interiorCount) {
        const startIndex = interiorUrls.length;
        const currentBatchSize = Math.min(BATCH_SIZE, interiorCount - startIndex);
        const batchIndices = Array.from({ length: currentBatchSize }, (_, i) => startIndex + i);

        setProgressText(
          `Illustrating ${toTitleCase(childName)}'s pages ${startIndex + 1} to ${startIndex + currentBatchSize} of ${interiorCount}...`
        );

        const batchPromises = batchIndices.map(() =>
          fetchWithRetry({
            imageBase64: photo,
            childName,
            theme,
            isCover: false,
            orientation: bookOrientation,
            orderId: orderToken
          })
        );

        const batchResults = await Promise.all(batchPromises);
        interiorUrls.push(...batchResults);

        // Safe cache update so storage quota exceptions never break the loop
        try {
          localStorage.setItem(`mcs_progress_pages_${orderToken}`, JSON.stringify(interiorUrls));
        } catch (storageError) {
          console.warn('LocalStorage quota reached, continuing generation in memory:', storageError);
        }

        setCurrentProgress({ current: 1 + interiorUrls.length, total: totalPages });
        await sleep(1000);
      }

      setProgressText('Assembling high-resolution printable PDF...');
      const pdfMeta = await createBookPdf(childName, theme, coverUrl, interiorUrls, bookOrientation);

      // Safe cache cleanup
      try {
        localStorage.setItem(`mcs_completed_pdf_${orderToken}`, pdfMeta.url);
        localStorage.setItem(`mcs_completed_filename_${orderToken}`, pdfMeta.filename);
        localStorage.removeItem(`mcs_progress_cover_${orderToken}`);
        localStorage.removeItem(`mcs_progress_pages_${orderToken}`);
      } catch (e) {
        console.warn('Final completion storage persistence warning:', e);
      }

      // Record completed paid order in Supabase database
      try {
        await fetch('/api/orders/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderToken,
            childName: toTitleCase(childName),
            theme: toTitleCase(theme),
            packageSize: rawPkg,
            orientation: bookOrientation,
            pdfUrl: pdfMeta.url
          })
        });
      } catch (dbErr) {
        console.warn('Could not record order in database:', dbErr);
      }

      setCompletedBook({
        childName: toTitleCase(childName),
        theme: toTitleCase(theme),
        pdfUrl: pdfMeta.url,
        filename: pdfMeta.filename
      });
      setIsGenerating(false);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Generation was interrupted.');
      setIsGenerating(false);
    } finally {
      isRunningRef.current = false;
    }
  };

  useEffect(() => {
    try {
      localStorage.removeItem('mcs_bundle_data');
      sessionStorage.removeItem('mcs_bundle_data');
    } catch {}
    runGenerationPipeline();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white border-2 border-orange-100 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-6">

        {/* PERSISTENT WARNING BANNER (DURING GENERATION) */}
        {isGenerating && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                Please Keep This Tab Open
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Your custom storybook is being illustrated live. Closing or refreshing this window will pause generation.
              </p>
            </div>
          </div>
        )}

        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
            {isGenerating ? 'Drawing in Progress' : 'Order Ready'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {isGenerating ? 'Creating Your Custom Coloring Book...' : 'Your Book Is Complete!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isGenerating
              ? 'Our AI artist is drawing each page. Your instant download button will appear below when finished.'
              : 'Click below to download and print your high-resolution coloring book.'}
          </p>
        </div>

        {/* ACTIVE GENERATION CARD */}
        {isGenerating && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-900">{progressText}</p>
              {currentProgress.total > 0 && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Completed {currentProgress.current} of {currentProgress.total} pages
                </p>
              )}
            </div>
            {currentProgress.total > 0 && (
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.round((currentProgress.current / currentProgress.total) * 100)}%`
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* ERROR STATE WITH IN-PAGE RESUMABLE RETRY BUTTON */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <div>
                <p className="font-bold">Generation Interrupted</p>
                <p className="text-[11px] text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={runGenerationPipeline}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Resume Generation
            </button>
          </div>
        )}

        {/* READY / DOWNLOAD SECTION */}
        {completedBook && !isGenerating && (
          <div className="space-y-4 text-left">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {completedBook.childName}&apos;s Printable Book
                  </h4>
                  <p className="text-[11px] text-slate-600 capitalize">
                    {completedBook.theme} Adventure • Ready to Print
                  </p>
                </div>
              </div>

              <a
                href={completedBook.pdfUrl}
                download={completedBook.filename}
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>

            <a
              href={`https://wa.me/15205672374?text=${encodeURIComponent(`Hi, I want to leave a review for ${completedBook.childName}'s ${completedBook.theme} coloring book.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs"
            >
              Leave a review on WhatsApp
            </a>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
              >
                Create another book <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Loading order status...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, ShieldCheck, Download, Printer, ChevronRight } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      id: '8',
      name: 'Starter Edition',
      pages: '8 Interior Pages + Cover',
      price: '$8.99',
      popular: false,
      description: 'Perfect for a quick, delightful afternoon coloring activity starring your child.'
    },
    {
      id: '16',
      name: 'Standard Edition',
      pages: '16 Interior Pages + Cover',
      price: '$12.99',
      popular: true,
      description: 'Our most popular keepsake book. Packed with varied adventures and plenty of coloring fun.'
    },
    {
      id: '32',
      name: 'Deluxe Edition',
      pages: '32 Interior Pages + Cover',
      price: '$21.99',
      popular: false,
      description: 'An expansive collection of personalized stories keeping children engaged for hours.'
    },
    {
      id: '48',
      name: 'Surprise Variety Mega Pack',
      pages: '48 Interior Pages + Cover',
      price: '$29.99',
      popular: false,
      description: 'The ultimate multi-world collection spanning diverse adventure themes.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans pb-24">
      
      {/* Top Bar */}
      <header className="bg-white border-b border-orange-100 py-4 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="font-black text-slate-900 text-sm">MyColoringStar</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-12 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Choose Your Book Package
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Every package includes instant high-resolution digital PDF delivery, custom facial likeness matching, and a full-color personalized cover.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl p-6 border-2 flex flex-col justify-between relative transition shadow-sm ${
                tier.popular
                  ? 'border-orange-500 ring-2 ring-orange-400/40 shadow-md'
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-black text-orange-600 uppercase tracking-wider">{tier.name}</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{tier.price}</div>
                  <div className="text-xs font-bold text-slate-500 mt-0.5">{tier.pages}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {tier.description}
                </p>

                <ul className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Instant PDF Download
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Child Likeness Matching
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> US Letter &amp; A4 Formats
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  href={`/theme/superhero?pkg=${tier.id}`}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                    tier.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Select {tier.id} Pages</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Format Breakdown Banner */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Download className="w-3.5 h-3.5" /> Instant Digital Delivery
            </div>
            <h2 className="text-xl font-black text-slate-900">Digital PDF Format (Active)</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your customized coloring book is compiled into a high-resolution vector PDF immediately after purchase. You can print it on any home printer or take it to a local print shop.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              <Printer className="w-3.5 h-3.5" /> Printed Physical Books (Coming Soon)
            </div>
            <h2 className="text-xl font-black text-slate-900">Hardcover &amp; Softcover Printing</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Automated physical fulfillment (shipping physical spiral-bound and paperback books) is currently undergoing integration testing and will launch soon.
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secure checkout backed by 30-day quality satisfaction guarantee.</span>
        </div>
      </main>
    </div>
  );
}
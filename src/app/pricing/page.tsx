'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Sparkles, Printer, ShieldCheck } from 'lucide-react';

const TIERS = [
  {
    id: '8',
    name: 'The book',
    pages: '8 coloring pages',
    price: '$7',
    unitPrice: 'Color cover included',
    description: 'One theme. Print it at home. Come back for the next adventure.',
    popular: true,
    features: [
      '1 full-color cover starring your child',
      'Personalized dedication page',
      '8 different coloring pages',
      'Back-cover artist certificate',
      'Instant PDF for Letter and A4',
      'Print it as many times as you want'
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans py-12 px-4 selection:bg-orange-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-800 transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>

          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
              Transparent Pricing
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              One-Time Purchase. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
                Print Unlimited Copies.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Every package includes a personalized full-color cover starring your child, a dedication page, vector coloring sheets, and an artist certificate.
            </p>
          </div>
        </div>

        {/* PRICING GRID */}
        <div className="max-w-md mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                tier.popular
                  ? 'bg-white border-2 border-orange-500 shadow-xl ring-2 ring-orange-400/20'
                  : 'bg-white border border-slate-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                </div>

                <div className="border-y border-slate-100 py-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{tier.price}</span>
                    <span className="text-xs font-bold text-slate-400">one-time</span>
                  </div>
                  <div className="text-xs font-bold text-orange-600 mt-0.5">
                    {tier.pages} • {tier.unitPrice}
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/"
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Customize Your Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST BANNER */}
        <div className="p-6 bg-orange-50/60 rounded-3xl border border-orange-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Ready for Home Printing:</strong> Formatted for US Letter and International A4 copy paper or cardstock.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span><strong>Strict Photo Privacy:</strong> Photos are held in temporary memory during rendering only and never saved.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <span><strong>Secure Checkout:</strong> Transactions processed with bank-level encryption via Whop.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
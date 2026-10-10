'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Mail } from 'lucide-react';

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans py-12 px-4 selection:bg-orange-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-orange-100 shadow-sm">
        
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
            <RefreshCw className="w-3.5 h-3.5" /> Guarantee
          </div>
          <h1 className="text-3xl font-black text-slate-900">Refund &amp; Return Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Digital Personalized Products</h2>
            <p>
              Because each digital coloring book is uniquely generated and customized to your specific child and theme, orders cannot be returned once delivery has occurred. However, we want you to be completely satisfied with your book.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Quality Guarantee &amp; Free Regenerations</h2>
            <p>
              If your generated book suffers from technical flaws (corrupted PDF download, misprinted text, or rendering errors), contact our support within 14 days of purchase. We will happily regenerate your book free of charge or issue a full refund if the issue cannot be resolved.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Physical Printed Books</h2>
            <p>
              For physical copies, if your printed book arrives damaged, with bent binding, or with printing defects, send a photo of the damaged package to our support team within 14 days of delivery and we will ship a free replacement immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. How to Request Support</h2>
            <p>
              To request assistance or a refund, email our help desk with your order details and the email address used at checkout:
            </p>
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl flex items-center gap-3 mt-2">
              <Mail className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">MyColoringStar Help Desk</p>
                <a href="mailto:support@mycoloringstar.com" className="text-sm font-black text-orange-600 hover:underline">
                  support@mycoloringstar.com
                </a>
                <p className="text-[11px] text-slate-500 mt-0.5">We respond to all requests within 24–48 hours.</p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
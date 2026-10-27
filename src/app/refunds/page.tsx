'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function RefundPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
            <RefreshCw className="w-3.5 h-3.5" /> Guarantee
          </div>
          <h1 className="text-3xl font-black text-slate-900">Refund &amp; Return Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Digital Personalized Products</h2>
            <p>
              Because each digital coloring book is uniquely generated and customized to your specific child and theme, completed digital orders cannot be returned once delivery has occurred. To ensure you love your book before purchasing, we provide a promotional free 3-page mini-book sample (1 personalized cover + 2 interior coloring pages) so you can evaluate linework and likeness upfront.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Quality Guarantee &amp; Free Regenerations</h2>
            <p>
              If your generated book suffers from technical flaws (corrupted PDF download, unreadable typography, blank pages, or rendering errors), contact our support team within 14 days of purchase. We will happily regenerate your book free of charge or issue a full refund if the technical issue cannot be resolved.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Physical Printed Books (Coming Soon)</h2>
            <p>
              Physical, bound printed editions are currently in production testing and labeled as &quot;Coming Soon.&quot; When physical orders officially open at checkout, if your printed book arrives damaged, with bent binding, or with manufacturing defects, send a photo of the damaged package to our support team within 14 days of delivery, and we will dispatch a free replacement immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. How to Request Support</h2>
            <p>
              To request assistance, a re-render, or a refund, email our help desk with your order details and the email address used at checkout:
            </p>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs space-y-1 text-slate-800">
              <p className="font-bold text-slate-900">MyColoringStar Help Desk</p>
              <p>
                Email:{' '}
                <a href="mailto:support@mycoloringstar.com" className="text-orange-600 font-bold hover:underline">
                  support@mycoloringstar.com
                </a>
              </p>
              <p className="text-slate-500">We respond to all requests within 24–48 hours.</p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
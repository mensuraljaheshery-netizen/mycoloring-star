'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" /> Privacy &amp; Data Protection
          </div>
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When visiting, previewing, or purchasing personalized products from MyColoringStar (mycoloringstar.com), we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Contact Information:</strong> Customer email address for digital download links, order receipts, and support communications.</li>
              <li><strong>Personalization Details:</strong> Child&apos;s first name or preferred nickname for book story integration.</li>
              <li><strong>Reference Photographs:</strong> Optional user-submitted images used strictly to render stylized coloring line art.</li>
              <li><strong>Shipping Details:</strong> Physical shipping address and recipient name when ordering printed physical book editions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Child Photo Handling &amp; Security</h2>
            <p>
              We enforce strict data isolation protocols for reference photos:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Photos are transmitted over encrypted TLS connections solely to generate your custom coloring pages.</li>
              <li>Uploaded photographs are never sold, rented, leased, or published publicly.</li>
              <li>Reference images are not retained for public model training or reused across other customer accounts.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Payment Information</h2>
            <p>
              MyColoringStar does not collect, process, or store sensitive credit card or payment credentials on its servers. All payments are securely captured and handled by certified PCI-DSS compliant Merchant of Record and payment processing partners (including Suby).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Third-Party Order Fulfillment</h2>
            <p>
              For physical print-on-demand books, necessary shipping parameters (recipient name, mailing address, and compiled print-ready PDF files) are routed securely to vetted print and manufacturing partners strictly for manufacturing and delivery purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Data Deletion &amp; User Rights</h2>
            <p>
              You maintain full authority to request immediate deletion of your submitted details or order history. To request complete removal of your records, email our team at{' '}
              <a href="mailto:support@mycoloringstar.com" className="text-orange-600 font-bold hover:underline">
                support@mycoloringstar.com
              </a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
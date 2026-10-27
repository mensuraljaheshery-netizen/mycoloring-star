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
              When visiting, generating previews, or purchasing products from MyColoringStar (mycoloringstar.com), we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Contact Information:</strong> Customer email address for digital download links, promotional mini-book delivery, and customer support.</li>
              <li><strong>Personalization Details:</strong> Child&apos;s first name or preferred nickname for book cover and dedication text integration.</li>
              <li><strong>Reference Photographs:</strong> User-submitted photos processed strictly to render custom black-and-white coloring pages and cover art. Photos are never stored permanently on disk.</li>
              <li><strong>Shipping Details (Upcoming Service):</strong> Physical shipping address and recipient name only when physical printed editions launch. All current checkouts remain strictly digital.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Photo Processing &amp; Zero Permanent Storage</h2>
            <p>
              We enforce strict data isolation protocols for reference photos:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Zero Permanent Image Storage:</strong> We do not store, archive, or database reference photographs. Photos are held exclusively in temporary, volatile server memory during the active rendering call and discarded immediately upon completion.</li>
              <li><strong>Model Safety:</strong> Photos are never utilized to train, tune, or refine public AI models.</li>
              <li><strong>No Data Brokering:</strong> Likeness assets are never sold, rented, leased, indexed, or shared with third parties or advertisers.</li>
              <li><strong>Session Purges:</strong> Any transient generation cache or edge artifacts expire and purge automatically within 24 to 48 hours.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Promotional Free Tier &amp; Rate-Limiting Records</h2>
            <p>
              To maintain our fair-use policy of one free 3-page mini-book sample per household, our system saves a non-reversible cryptographic SHA-256 network fingerprint, your submitted email address, the selected theme, and the provided first name in our verification database. This record prevents abuse and confirms promotional redemption history.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Payment Information</h2>
            <p>
              MyColoringStar does not collect, process, or store sensitive credit card or payment credentials on its servers. All transactions are securely captured and fulfilled by certified PCI-DSS compliant Merchant of Record partners (including Whop).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Third-Party Order Fulfillment (Future Physical Books)</h2>
            <p>
              When physical print-on-demand fulfillment launches, necessary shipping parameters (recipient name, mailing address, and compiled print PDF files) will be securely transmitted to vetted printing partners solely to manufacture and dispatch the physical product.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Deletion Requests &amp; User Rights</h2>
            <p>
              Because photographs are discarded immediately and never stored permanently, there are no photo archives to delete. However, you maintain the legal right to request the immediate erasure of your retained database records (including your email address, child name, and promotional claim log).
            </p>
            <p>
              To request complete deletion of your contact and claim records from our database, email{' '}
              <a href="mailto:support@mycoloringstar.com" className="text-orange-600 font-bold hover:underline">
                support@mycoloringstar.com
              </a>. All associated records will be permanently expunged within 24 business hours.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
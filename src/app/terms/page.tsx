'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" /> Legal
          </div>
          <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and purchasing from MyColoringStar (mycoloringstar.com), you agree to comply with and be legally bound by these Terms of Service. If you disagree with any portion of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Service Description</h2>
            <p>
              MyColoringStar provides personalized digital and physical custom coloring books. Customers submit a child&apos;s name, chosen story theme, and optional reference photograph to produce customized coloring illustrations and storybook cover art.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Artificial Intelligence &amp; Artistic Interpretation</h2>
            <p>
              Our coloring illustrations are generated using automated visual intelligence models based on your selected theme and reference photograph. You acknowledge that artistic styling, linework, and creative interpretations are intrinsic to automated illustration. Generation is subjective, and minor stylistic variations from the input image do not constitute a defect.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. User Content &amp; Parental Authority</h2>
            <p>
              You represent and warrant that you possess full legal authority and parental consent to submit any photograph uploaded to our platform. You agree not to submit any defamatory, unlawful, or infringing images. Uploaded images are processed solely in temporary sessions to render requested assets and are never sold or utilized for third-party advertising.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Digital Goods &amp; Physical Fulfillment</h2>
            <p>
              <strong>Digital Downloads:</strong> Delivered as high-resolution printable PDF files via immediate browser download and email confirmation upon successful payment clearance.
            </p>
            <p>
              <strong>Physical Printed Books:</strong> Printed on demand through specialized manufacturing facilities and dispatched via postal carrier to the shipping address entered at checkout. Standard production and delivery timetables vary depending on destination.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Merchant of Record &amp; Transactions</h2>
            <p>
              Payments on MyColoringStar are securely handled by our authorized Merchant of Record partners. Your statement will reflect the processor&apos;s designated billing identifier upon order completion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">7. Limitation of Liability</h2>
            <p>
              MyColoringStar and its operators shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to access our personalized generation services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">8. Contact Information</h2>
            <p>
              For inquiries regarding these Terms of Service, contact our administrative desk at{' '}
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
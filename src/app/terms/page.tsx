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
              MyColoringStar provides personalized downloadable digital coloring books, with physical printed editions currently in development (&quot;Coming Soon&quot;). Customers submit a child&apos;s name, chosen story theme, and optional reference photograph to produce customized coloring illustrations and storybook cover art.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Artificial Intelligence &amp; Artistic Interpretation</h2>
            <p>
              Our coloring illustrations are generated using automated visual intelligence models based on your selected theme and reference photograph. You acknowledge that artistic styling, linework, and creative interpretations are intrinsic to automated illustration. Generation is subjective, and minor stylistic variations from the input image do not constitute a defect.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. User Content, Likeness Consent &amp; Deletion</h2>
            <p>
              You represent and warrant that you possess full legal authority and parental consent to submit any photograph uploaded to our platform. You agree not to submit any defamatory, unlawful, or infringing images. Uploaded images are processed solely in temporary sessions to render requested assets and are never sold or utilized for third-party advertising or model training. You may request deletion of uploaded reference data and associated records at any time by contacting support@mycoloringstar.com.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Digital Goods &amp; Physical Fulfillment (Upcoming)</h2>
            <p>
              <strong>Digital Downloads:</strong> Delivered as high-resolution printable PDF files via immediate browser download upon successful rendering and checkout confirmation.
            </p>
            <p>
              <strong>Physical Printed Books (Coming Soon):</strong> Physical printed editions are currently marked as &quot;Coming Soon&quot; and not available for checkout. Once physical fulfillment is launched, printed books will be produced on demand through specialized manufacturing partners and dispatched via postal carrier. Until that launch, all active purchases on the platform remain strictly digital downloadable PDFs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Promotional Free Tier &amp; Fair Use</h2>
            <p>
              We provide a promotional free 3-page mini-book sample limited strictly to one claim per household, email address, or network. Automated attempts to circumvent these limits via proxy networks, bot traffic, or disposable credentials will result in immediate termination of generation access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">7. Merchant of Record &amp; Transactions</h2>
            <p>
              Payments on MyColoringStar are securely processed through Whop, our Merchant of Record partner. All transactions are encrypted and subject to Whop&apos;s checkout terms and conditions. Your billing statement will reflect Whop&apos;s designated descriptor upon order completion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">8. Limitation of Liability</h2>
            <p>
              MyColoringStar and its operators shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to access our personalized generation services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">9. Contact Information</h2>
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
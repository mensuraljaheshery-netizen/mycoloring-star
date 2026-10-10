'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react';

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is MyColoringStar?',
      a: 'MyColoringStar creates personalized children’s coloring books. You upload a clear photo of your child and choose an adventure theme (such as Superhero, Astronaut, or Dinosaur). Our engine transforms their recognizable likeness into high-quality black-and-white coloring pages.'
    },
    {
      q: 'What do I receive after purchase?',
      a: 'You receive an instant high-resolution printable PDF containing your child’s customized full-color cover page and the exact number of interior coloring pages ordered (8, 16, 32, or 48 pages).'
    },
    {
      q: 'Is the book digital or physical?',
      a: 'All current orders are instant high-resolution digital PDFs designed for easy at-home printing or binding at any local print shop. Physical printed books are currently marked as coming soon while automated printing fulfillment is finalized.'
    },
    {
      q: 'What kind of photo works best?',
      a: 'A well-lit, close-up photo showing your child looking towards the camera with a clear smile. Avoid photos where the face is heavily shadowed, blurry, or covered by sunglasses or hats.'
    },
    {
      q: 'How does MyColoringStar handle child photos and privacy?',
      a: 'Uploaded photos are processed in temporary server memory solely to generate the likeness line art for your order. We never sell, share, or train public AI models on your child’s photos. Review our Privacy Policy for full details.'
    },
    {
      q: 'What printer paper is recommended?',
      a: 'Standard 20–24 lb copy paper works wonderfully for crayons and colored pencils. For markers or watercolor pencils, we recommend 65 lb+ (160+ gsm) cardstock to prevent bleed-through.'
    },
    {
      q: 'What is your refund policy?',
      a: 'If a technical issue prevents your coloring book from generating properly, our support team will regenerate your book or issue a full refund. Because these are custom personalized products, refunds are not offered for user-entered typos or uploading the wrong photo once generation completes.'
    },
    {
      q: 'How long does generation take?',
      a: 'Free previews generate in approximately 10 to 15 seconds. Full multi-page book compilation takes between 30 to 60 seconds depending on the selected page count.'
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
      <main className="max-w-4xl mx-auto px-4 pt-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Help &amp; Support Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Find answers to common questions regarding photo uploads, digital delivery, printing, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <p className="text-xs text-slate-500">
            Have a question not answered here? Contact our support team anytime at{' '}
            <a href="mailto:support@mycoloringstar.com" className="font-bold text-orange-600 hover:underline">
              support@mycoloringstar.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
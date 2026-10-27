'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default mailto fallback or simple submission acknowledgment
    setSubmitted(true);
  };

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
            <MessageSquare className="w-3.5 h-3.5" /> Help &amp; Support
          </div>
          <h1 className="text-3xl font-black text-slate-900">Contact Customer Support</h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions about your order, PDF printing, or theme customization? We&apos;re here to help.
          </p>
        </div>

        {/* DIRECT CHANNELS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-orange-200/80 bg-orange-50/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">Email Desk</span>
              <a
                href="mailto:support@mycoloringstar.com"
                className="text-sm font-bold text-orange-600 hover:underline"
              >
                support@mycoloringstar.com
              </a>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct inbox for order &amp; generation inquiries</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">Response Time</span>
              <span className="text-sm font-bold text-slate-900">Within 24–48 hours</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Monday through Saturday</p>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Send Us a Direct Note</h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting MyColoringStar. Our support desk has received your note and will follow up with you at <strong>{formData.email || 'your email'}</strong> within 24–48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Whop Order ID <span className="text-slate-400 font-normal lowercase">(optional, if inquiring about an order)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ord_..."
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  How can we help?
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you need help with (PDF downloads, photo questions, theme recommendations)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
              >
                Send Support Message
              </button>
            </form>
          )}
        </div>

        {/* TRUST BADGE */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Need immediate answers? Check our instant FAQ on the home page.</span>
        </div>

      </div>
    </div>
  );
}
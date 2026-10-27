import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parent Reviews',
  description: 'Leave a review for your MyColoringStar coloring book on WhatsApp.',
  alternates: { canonical: '/reviews' },
};

const whatsappHref =
  'https://wa.me/15205672374?text=' +
  encodeURIComponent('Hi, I want to leave a review for my MyColoringStar coloring book.');

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-12">
      <div className="max-w-xl mx-auto bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
        <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">Parent reviews</p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Tell us how the book went</h1>
        <p className="text-sm text-slate-600 mt-3">
          Reviews are sent on WhatsApp to +1 520 567 2374. A quote is added to this page only after we read it.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-black"
        >
          Leave a review on WhatsApp
        </a>
      </div>
    </main>
  );
}

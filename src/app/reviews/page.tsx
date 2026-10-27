import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parent Reviews',
  description: 'Leave a review for your MyColoringStar coloring book by WhatsApp or email.',
  alternates: { canonical: '/reviews' },
};

const reviewText = 'Hi, I want to leave a review for my MyColoringStar coloring book.';
const whatsappHref = 'https://wa.me/15205672374?text=' + encodeURIComponent(reviewText);
const emailHref =
  'mailto:support@mycoloringstar.com?subject=' +
  encodeURIComponent('MyColoringStar review') +
  '&body=' +
  encodeURIComponent(reviewText);

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-12">
      <div className="max-w-xl mx-auto bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
        <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">Parent reviews</p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Tell us how the book went</h1>
        <p className="text-sm text-slate-600 mt-3">
          Send the review by WhatsApp or email. A quote is added to this page only after we read it. Your phone number is never shown.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-black"
          >
            WhatsApp
          </a>
          <a
            href={emailHref}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black"
          >
            Email
          </a>
        </div>
      </div>
    </main>
  );
}

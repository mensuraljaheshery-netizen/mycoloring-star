import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free coloring book samples',
  description: 'Download free MyColoringStar sample books. Print them and color. No signup.',
  alternates: { canonical: '/samples' },
};

const BOOKS = [
  {
    name: "Liam's Superhero book",
    child: 'Liam',
    photo: '/sample-liam-photo.jpg',
    detail: 'A color cover and coloring pages from a real Superhero book.',
    href: '/sample-book.pdf',
    file: 'MyColoringStar_Liam_Superhero.pdf',
  },
  {
    name: "Sara's Princess book",
    child: 'Sara',
    photo: '/sample-sara-photo.jpg',
    detail: 'A color cover and coloring pages from a real Princess book.',
    href: '/sample-book-princess.pdf',
    file: 'MyColoringStar_Sara_Princess.pdf',
  },
  {
    name: "Sara's School Day book",
    child: 'Sara',
    photo: '/sample-sara-photo.jpg',
    detail: 'A color cover and coloring pages from a real School Day book.',
    href: '/sample-book-school-day.pdf',
    file: 'MyColoringStar_Sara_School_Day.pdf',
  },
];

export default function SamplesPage() {
  return (
    <main className="bg-[#FFFDF9] text-slate-800">
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Free to download</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Samples</h1>
        <p className="mt-4 text-lg text-slate-600">
          These finished books are free. They star Liam and Sara. Download one, print it, and color it. No account and no payment.
        </p>
        <div className="mt-6 flex items-center gap-6">
          <div className="text-center">
            <img src="/sample-liam-photo.jpg" alt="Liam" className="h-20 w-20 rounded-full object-cover border-2 border-orange-200" />
            <p className="mt-2 text-sm font-black text-slate-900">Liam</p>
          </div>
          <div className="text-center">
            <img src="/sample-sara-photo.jpg" alt="Sara" className="h-20 w-20 rounded-full object-cover border-2 border-orange-200" />
            <p className="mt-2 text-sm font-black text-slate-900">Sara</p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {BOOKS.map((book) => (
            <div key={book.href} className="rounded-3xl border border-orange-100 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-4">
                <img src={book.photo} alt={book.child} className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-orange-100" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">{book.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{book.detail}</p>
                </div>
              </div>
              <a
                href={book.href}
                download={book.file}
                className="mt-4 sm:mt-0 inline-flex shrink-0 items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
              >
                Download
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">
          Want your own child on the cover? The 3-page sample is free.{' '}
          <Link href="/" className="font-black text-orange-700">Make one</Link>
        </p>
      </section>
    </main>
  );
}

import { db } from '@/lib/db';
import { ThemeCard } from '@/components/ThemeCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const category = params?.category;
  const search = params?.search;

  const categories = [
    'All',
    'Adventure',
    'Animals and Nature',
    'Sports',
    'Space',
    'Fantasy',
    'Jobs',
    'Seasonal',
  ];

  const themes = await db.theme.findMany({
    where: {
      isActive: true,
      ...(category && category !== 'All' ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <main className="min-h-screen bg-amber-50/50 pb-20">
      <header className="w-full bg-white border-b-4 border-amber-200 py-4 px-6 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">?</span>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            MagicPages
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/#gallery"
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-full shadow transition-transform active:scale-95"
          >
            Explore Themes
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Turn your child into the <br />
          <span className="text-rose-500 underline decoration-wavy decoration-amber-300">
            hero of their own
          </span>{' '}
          coloring book.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Upload any picture and turn them into an astronaut, superhero, princess, or explorer in a print-ready coloring book!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-12 text-left">
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm">
            <span className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-full flex items-center justify-center text-lg mb-3">1</span>
            <h4 className="font-bold text-slate-800 text-lg mb-1">Pick a Theme</h4>
            <p className="text-slate-500 text-sm">Choose from 30+ fun adventures designed specifically for kids.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-rose-200 shadow-sm">
            <span className="w-10 h-10 bg-rose-100 text-rose-600 font-black rounded-full flex items-center justify-center text-lg mb-3">2</span>
            <h4 className="font-bold text-slate-800 text-lg mb-1">Upload a Photo</h4>
            <p className="text-slate-500 text-sm">Add a quick photo of your child. We preserve their recognizable likeness.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-sky-200 shadow-sm">
            <span className="w-10 h-10 bg-sky-100 text-sky-600 font-black rounded-full flex items-center justify-center text-lg mb-3">3</span>
            <h4 className="font-bold text-slate-800 text-lg mb-1">Get Your Book</h4>
            <p className="text-slate-500 text-sm">Download your custom line-art pages ready to print and color with crayons.</p>
          </div>
        </div>

        <div className="bg-amber-100/60 rounded-3xl p-6 border-2 border-amber-200 inline-flex flex-wrap gap-6 justify-center items-center">
          <div className="text-center px-4">
            <span className="text-xs uppercase font-bold text-amber-700 block">Digital PDF</span>
            <span className="text-2xl font-black text-slate-900">.99</span>
          </div>
          <div className="h-8 w-px bg-amber-300 hidden md:block" />
          <div className="text-center px-4">
            <span className="text-xs uppercase font-bold text-rose-700 block">Printed Book</span>
            <span className="text-2xl font-black text-slate-900">.99</span>
          </div>
          <div className="h-8 w-px bg-amber-300 hidden md:block" />
          <div className="text-center px-4">
            <span className="text-xs uppercase font-bold text-sky-700 block">Bundle (Print + PDF)</span>
            <span className="text-2xl font-black text-slate-900">.99</span>
          </div>
        </div>
      </section>

      <section id="gallery" className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Explore Themes</h2>
            <p className="text-slate-500 text-sm">Hover over any card to reveal the coloring book line art!</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = (!category && cat === 'All') || category === cat;
              return (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/#gallery' : '/?category=' + encodeURIComponent(cat) + '#gallery'}
                  className={'px-4 py-2 rounded-full text-sm font-bold transition ' + (active ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100')}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {themes.map((t) => (
            <ThemeCard
              key={t.id}
              name={t.name}
              category={t.category}
              description={t.description}
              slug={t.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

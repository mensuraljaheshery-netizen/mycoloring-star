import type { Metadata } from 'next';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mycoloringstar.com'),
  title: {
    default: 'Personalized Coloring Books Starring Your Child',
    template: '%s | MyColoringStar',
  },
  description:
    'Turn a photo of your child into a print-at-home coloring book. Free 3-page sample. Paid books are $4.99–$16.99, instant PDF, unlimited reprints.',
  openGraph: {
    type: 'website',
    siteName: 'MyColoringStar',
    images: ['/sample-cover.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/sample-cover.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{
        ['--font-geist-sans' as any]:
          'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        ['--font-geist-mono' as any]:
          '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      }}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF9] text-slate-800 font-sans">
        <header className="sticky top-0 z-40 border-b border-[#E07020] bg-[#FC8A33]">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-black text-slate-900 tracking-tight">
              <a href="/" aria-label="MyColoringStar home" className="cursor-pointer">
                <img src="/logo.webp" alt="MyColoringStar" className="h-10 w-10 object-cover" />
              </a>
              <a href="/" className="cursor-pointer hover:underline">
                MyColoringStar
              </a>
            </div>
            <nav className="flex items-center gap-4 text-xs sm:text-sm font-bold text-slate-900">
              <Link href="/#how-it-works" className="hover:underline">
                How it works
              </Link>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
              <Link href="/contact" className="hover:underline">
                Support
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>

        <footer className="border-t border-orange-100 bg-white py-10 px-4 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span className="font-black text-slate-900 text-sm">MyColoringStar</span>
              <span>&copy; {new Date().getFullYear()} MyColoringStar. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3.5 py-1.5 rounded-full text-slate-700 shadow-sm">
              <span className="text-slate-400">Support:</span>
              <a href="mailto:support@mycoloringstar.com" className="font-bold text-orange-600 hover:underline">
                support@mycoloringstar.com
              </a>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <Link href="/pricing" className="text-orange-600 font-bold hover:text-orange-700 transition">
                Pricing
              </Link>
              <Link href="/contact" className="hover:text-slate-900 transition">
                Contact Us
              </Link>
              <Link href="/terms" className="hover:text-slate-900 transition">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 transition">
                Privacy Policy
              </Link>
              <Link href="/refunds" className="hover:text-slate-900 transition">
                Refund Policy
              </Link>
            </div>
          </div>
        </footer>

        <ChatWidget />
      </body>
    </html>
  );
}

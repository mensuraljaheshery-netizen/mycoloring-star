import type { Metadata } from 'next';
import { Suspense } from 'react';
import SiteFrame from '@/components/SiteFrame';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mycoloringstar.com'),
  title: {
    default: 'Personalized Coloring Books Starring Your Child',
    template: '%s | MyColoringStar',
  },
  description:
    'Turn a photo of your child into a print-at-home coloring book. Free 3-page sample. Paid books are $4, instant PDF, unlimited reprints.',
  openGraph: {
    type: 'website',
    siteName: 'MyColoringStar',
    images: ['/sample-cover.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/sample-cover.png'],
  },
  verification: {
    google: 'adw6_w43T-3IkjA4z8CetqGbN_eOZsu4rcHhALiHXrg',
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
        <Suspense fallback={<div className="flex-1">{children}</div>}>
          <SiteFrame>{children}</SiteFrame>
        </Suspense>
      </body>
    </html>
  );
}

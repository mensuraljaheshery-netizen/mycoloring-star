import type { Metadata } from 'next';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyColoringStar - Turn Your Child Into The Main Character',
  description: 'AI-Powered Personalized Coloring Books Starring Your Kid',
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
        // Resilient system font fallbacks matching Geist font metrics exactly
        ['--font-geist-sans' as any]:
          'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        ['--font-geist-mono' as any]:
          '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      }}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF9] text-slate-800 font-sans">
        {/* MAIN PAGE CONTENT */}
        <div className="flex-1">{children}</div>

        {/* GLOBAL FOOTER */}
        <footer className="border-t border-orange-100 bg-white py-10 px-4 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span className="font-black text-slate-900 text-sm">MyColoringStar</span>
              <span>&copy; {new Date().getFullYear()} MyColoringStar. All rights reserved.</span>
            </div>

            {/* SUPPORT EMAIL CONTACT */}
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3.5 py-1.5 rounded-full text-slate-700 shadow-sm">
              <span className="text-slate-400">Support:</span>
              <a
                href="mailto:support@mycoloringstar.com"
                className="font-bold text-orange-600 hover:underline"
              >
                support@mycoloringstar.com
              </a>
            </div>

            {/* NAVIGATION & POLICY LINKS */}
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

        {/* STARLA AI CHAT ASSISTANT */}
        <ChatWidget />
      </body>
    </html>
  );
}
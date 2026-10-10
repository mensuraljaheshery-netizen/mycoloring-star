import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyColoringStar - Turn Your Child Into The Main Character",
  description: "AI-Powered Personalized Coloring Books Starring Your Kid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF9]">
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

            {/* POLICY LINKS */}
            <div className="flex items-center gap-6 font-medium">
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
      </body>
    </html>
  );
}
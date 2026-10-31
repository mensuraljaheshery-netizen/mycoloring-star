import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'White-label coloring books for shops',
  description:
    'Shops create an account, keep their QR code, and buy coloring-book credits. The shop name is printed on the book.',
  alternates: { canonical: '/business' },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'White-label coloring books for shops',
  description:
    'Shops buy coloring-book credits in packs. $10 for 4 books, $20 for 10, or $30 for 20. Credits do not expire.',
  alternates: { canonical: '/business' },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

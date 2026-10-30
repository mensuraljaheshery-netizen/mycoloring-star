import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'White-label coloring books for shops',
  description:
    'Shops buy coloring-book credits once. $15 for 10 books, $30 for 25, or $60 for 60. Credits do not expire.',
  alternates: { canonical: '/business' },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

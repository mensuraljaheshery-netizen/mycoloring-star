import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'White-label coloring books for shops',
  description:
    'Gift shops, playgrounds, and photographers can sell an 8-page coloring book under their own name. Two free books, then $2 each.',
  alternates: { canonical: '/business' },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

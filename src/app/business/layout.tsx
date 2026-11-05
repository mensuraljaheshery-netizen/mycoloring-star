import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coloring books for shops',
  description:
    'A shop account puts your name on an 8-page coloring book. Print it at the counter. No monthly fee.',
  robots: { index: false, follow: false },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

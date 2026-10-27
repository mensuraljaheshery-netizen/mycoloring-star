import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Regeneration or a refund when a MyColoringStar coloring book fails for a technical reason.',
  alternates: { canonical: '/refunds' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

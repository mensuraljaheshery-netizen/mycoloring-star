import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Email MyColoringStar support about an order, a PDF, or a theme. Replies within 24–48 hours, Monday through Saturday.',
  alternates: { canonical: '/contact' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

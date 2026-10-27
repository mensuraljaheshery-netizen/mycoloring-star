import type { Metadata } from 'next';

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = titleFromSlug(slug);
  return {
    title: `${name} Coloring Book`,
    description: `A personalized ${name} coloring book starring your child. Instant print-at-home PDF from MyColoringStar.`,
    alternates: { canonical: `/theme/${slug}` },
  };
}

export default function ThemeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

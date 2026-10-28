import type { Metadata } from 'next';
import { getThemeListing } from '@/lib/themes';

const SITE = 'https://www.mycoloringstar.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = getThemeListing(slug);
  const title = `Personalized ${theme.name} Coloring Book`;
  const description = `${theme.description}. Print-at-home PDF starring your child, with a color cover and different scenes inside. Books are $4. Free 3-page sample.`;
  const path = `/theme/${theme.slug}`;
  const image = `/theme-previews/${theme.slug}.png`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title: `${title} | MyColoringStar`,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ThemeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getThemeListing(slug);
  const url = `${SITE}/theme/${theme.slug}`;
  const image = `${SITE}/theme-previews/${theme.slug}.png`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `Personalized ${theme.name} Coloring Book`,
        description: theme.description,
        image,
        url,
        category: theme.category,
        brand: { '@type': 'Brand', name: 'MyColoringStar' },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '4',
          highPrice: '14',
          priceCurrency: 'USD',
          offerCount: 4,
          availability: 'https://schema.org/InStock',
          url,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: theme.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
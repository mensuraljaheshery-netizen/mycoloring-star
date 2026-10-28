import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Every coloring book is $4. Instant PDF, US Letter and A4, unlimited reprints at home.',
  alternates: { canonical: '/pricing' },
};

const products = [
  { name: 'Theme Try', pages: 4, price: '4' },
  { name: 'Standard Adventure', pages: 8, price: '7' },
  { name: 'Most Popular Adventure', pages: 16, price: '10' },
  { name: 'Deluxe Storybook', pages: 32, price: '14' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `MyColoringStar ${product.name}`,
        description: `${product.pages} personalized coloring pages, a color cover, and a printable PDF.`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: product.price,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}

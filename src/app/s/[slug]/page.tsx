import ShopDesk from '@/components/ShopDesk';
import { shopNameFromSlug } from '@/lib/shop';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ n?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const name = (query.n || '').trim() || shopNameFromSlug(slug);
  return {
    title: { absolute: `${name}` },
    description: `Make a personalized coloring book at ${name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ n?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  return <ShopDesk slug={slug} hintedName={query.n || ''} />;
}

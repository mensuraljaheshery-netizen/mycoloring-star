import type { MetadataRoute } from 'next';
import { listPublicThemes } from '@/lib/themes';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.mycoloringstar.com';
  const staticRoutes = ['', '/pricing', '/reviews', '/contact', '/faq', '/privacy', '/terms', '/refunds'].map((path) => ({
    url: `${base}${path || '/'}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.6,
  }));
  const themeRoutes = listPublicThemes().map((theme) => ({
    url: `${base}/theme/${theme.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  return [...staticRoutes, ...themeRoutes];
}
import type { MetadataRoute } from 'next';

const themes = [
  'variety-pack',
  'superhero',
  'princess',
  'astronaut',
  'school-day',
  'jungle-explorer',
  'outer-space',
  'mars-mission',
  'playing-with-animals',
  'desert-adventure',
  'snow-and-winter',
  'soccer-stadium',
  'basketball-champion',
  'under-the-sea',
  'dinosaur-explorer',
  'pirate-adventure',
  'farm-day',
  'fairy-forest',
  'knights-and-dragons',
  'race-car-driver',
  'firefighter',
  'doctor-and-vet',
  'chef-in-the-kitchen',
  'robot-world',
  'camping-trip',
  'ballet-and-dance',
  'music-band',
  'arctic-animals',
  'safari',
  'magical-wizard-academy',
  'birthday-party',
  'halloween',
  'winter-holidays',
  'eid-and-ramadan',
  'spring-flowers',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.mycoloringstar.com';
  const staticRoutes = ['', '/pricing', '/contact', '/faq', '/privacy', '/terms', '/refunds'].map((path) => ({
    url: `${base}${path || '/'}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.6,
  }));
  const themeRoutes = themes.map((slug) => ({
    url: `${base}/theme/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...themeRoutes];
}

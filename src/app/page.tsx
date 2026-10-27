import type { Metadata } from 'next';
import HomeExperience from '@/components/HomeExperience';

export const metadata: Metadata = {
  title: 'Personalized Coloring Books Starring Your Child',
  description:
    'Turn a photo of your child into a print-at-home coloring book. Free 3-page sample. Paid books are $7–$14, instant PDF, unlimited reprints.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Personalized Coloring Books Starring Your Child',
    description:
      'Free 3-page sample. Paid coloring books are $7–$14, delivered as a print-at-home PDF.',
    url: 'https://www.mycoloringstar.com/',
    images: [{ url: '/sample-cover.png', alt: 'Sample personalized coloring book cover' }],
  },
};

const faqs = [
  {
    q: 'What is MyColoringStar?',
    a: 'MyColoringStar creates personalized children’s coloring books. You upload a clear photo of your child and choose an adventure theme. The book comes back as a printable PDF with a color cover and black-and-white pages.',
  },
  {
    q: 'What do I receive after purchase?',
    a: 'An instant high-resolution PDF with a customized full-color cover, a dedication page, the coloring pages you ordered (8, 16, or 32), and a back cover.',
  },
  {
    q: 'Is the book digital or physical?',
    a: 'Current orders are instant digital PDFs for printing at home or at a local print shop. Physical printed books are marked coming soon.',
  },
  {
    q: 'What kind of photo works best?',
    a: 'A well-lit, close-up photo of the child looking toward the camera. Avoid heavy shadows, blur, sunglasses, or a hat covering the face.',
  },
  {
    q: 'How does MyColoringStar handle child photos and privacy?',
    a: 'Photos are used only to make this book. They are not kept as a photo library and are not used to train AI models.',
  },
  {
    q: 'What printer paper is recommended?',
    a: 'Standard copy paper works for crayons and colored pencils. For markers, use 65 lb (160 gsm) cardstock or heavier.',
  },
  {
    q: 'What is your refund policy?',
    a: 'If a technical problem stops the book from generating, support will regenerate it or refund it. Refunds are not offered for a typo or the wrong photo after a successful book is delivered.',
  },
];

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeExperience />
    </>
  );
}

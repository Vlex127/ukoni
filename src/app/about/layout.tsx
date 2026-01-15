import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Adaeze Sophia Ukoni | Research & Strategy Professional',
  description: 'Award-winning research and strategy professional with expertise in market research, user experience, and product strategy. Currently leading research at Moniepoint.',
  keywords: ['market research', 'product strategy', 'user experience', 'fintech', 'Moniepoint', 'Transsion', 'Kantar'],
  openGraph: {
    title: 'Adaeze Sophia Ukoni | Research & Strategy Professional',
    description: 'Award-winning research and strategy professional with expertise in market research and product strategy.',
    type: 'website',
    locale: 'en_US',
    images: ['/professional.png'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

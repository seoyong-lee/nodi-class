import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KitShowcase } from './KitShowcase';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: '디자인 시스템',
  robots: { index: false, follow: false },
};

export default function KitPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <KitShowcase />;
}

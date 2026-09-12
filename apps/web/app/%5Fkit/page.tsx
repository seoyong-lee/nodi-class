import { notFound } from 'next/navigation';
import { KitShowcase } from './KitShowcase';

export const dynamic = 'force-static';

export default function KitPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <KitShowcase />;
}

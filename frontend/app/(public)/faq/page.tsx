import type { Metadata } from 'next';
import FaqPageClient from './FaqPageClient';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ACLP — lessons, compiler, AI tutor, certificates, and more.',
};

export default function FaqPage() {
  return <FaqPageClient />;
}

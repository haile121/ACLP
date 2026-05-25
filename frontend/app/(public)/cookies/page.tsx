import type { Metadata } from 'next';
import CookiesPageClient from './CookiesPageClient';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'How ACLP uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return <CookiesPageClient />;
}

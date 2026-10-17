import type { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of service for using the Afro DevHub learning platform.',
};

export default function TermsPage() {
  return <TermsPageClient />;
}

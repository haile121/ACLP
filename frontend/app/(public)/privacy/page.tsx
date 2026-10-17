import type { Metadata } from 'next';
import PrivacyPageClient from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Afro DevHub collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}

import type { Metadata } from 'next';
import SecurityPageClient from './SecurityPageClient';

export const metadata: Metadata = {
  title: 'Security',
  description: 'How ACLP approaches account safety, compiler isolation, and data protection.',
};

export default function SecurityPage() {
  return <SecurityPageClient />;
}

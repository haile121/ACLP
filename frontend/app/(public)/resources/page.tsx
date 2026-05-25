import type { Metadata } from 'next';
import ResourcesPageClient from './ResourcesPageClient';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Help center for ACLP — FAQ, pricing, policies, security, status, press, community, and more.',
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}

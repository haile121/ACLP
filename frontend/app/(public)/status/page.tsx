import type { Metadata } from 'next';
import StatusPageClient from './StatusPageClient';

export const metadata: Metadata = {
  title: 'Status',
  description: 'ACLP platform and service status.',
};

export default function StatusPage() {
  return <StatusPageClient />;
}

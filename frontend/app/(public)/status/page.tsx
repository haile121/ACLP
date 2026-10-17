import type { Metadata } from 'next';
import StatusPageClient from './StatusPageClient';

export const metadata: Metadata = {
  title: 'Status',
  description: 'Afro DevHub platform and service status.',
};

export default function StatusPage() {
  return <StatusPageClient />;
}

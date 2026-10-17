import type { Metadata } from 'next';
import ChangelogPageClient from './ChangelogPageClient';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Release notes and product updates for Afro DevHub.',
};

export default function ChangelogPage() {
  return <ChangelogPageClient />;
}

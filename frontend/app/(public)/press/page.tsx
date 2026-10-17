import type { Metadata } from 'next';
import PressPageClient from './PressPageClient';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Press and media resources for Afro DevHub.',
};

export default function PressPage() {
  return <PressPageClient />;
}

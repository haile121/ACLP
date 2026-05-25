import type { Metadata } from 'next';
import AccessibilityPageClient from './AccessibilityPageClient';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Accessibility commitment for the ACLP learning platform.',
};

export default function AccessibilityPage() {
  return <AccessibilityPageClient />;
}

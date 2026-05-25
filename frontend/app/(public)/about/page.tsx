import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About',
  description:
    'ACLP exists to remove the language barrier between Ethiopian learners and serious programming—C++ track, bilingual lessons, a live compiler, and an AI tutor.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}

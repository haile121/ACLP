import type { Metadata } from 'next';
import CommunityPageClient from './CommunityPageClient';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the ACLP community — Discord and social channels.',
};

export default function CommunityPage() {
  return <CommunityPageClient />;
}

import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component
const TransponderSearchClient = dynamic(
  () => import('./TransponderSearchClient'),
  { ssr: false } // Disable SSR for this component
);

export const metadata: Metadata = {
  title: 'Transponder Search | Technician Portal',
  description: 'Search and find compatible transponders for vehicles',
};

export default function TransponderSearchPage() {
  return <TransponderSearchClient />;
} 
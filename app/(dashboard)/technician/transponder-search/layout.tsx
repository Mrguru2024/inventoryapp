import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transponder Search | Technician Portal',
  description: 'Search and find compatible transponders for vehicles',
};

export default function TransponderSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
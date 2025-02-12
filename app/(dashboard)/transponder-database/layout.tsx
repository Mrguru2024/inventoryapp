import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transponder Database',
  description: 'Vehicle transponder key database and search',
};

export default function TransponderDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 
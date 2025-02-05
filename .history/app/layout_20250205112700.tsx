import { Inter } from 'next/font/google';
import { AuthProvider } from './providers';
import NotificationBell from './components/NotificationBell';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen">
            <header className="bg-white shadow">
              <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Key Inventory System</h1>
                <NotificationBell />
              </div>
            </header>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 
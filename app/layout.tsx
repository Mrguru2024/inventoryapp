import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense, ReactNode } from 'react';
import "./globals.css";
import ClientWrapper from './components/ClientWrapper';
import ClientInit from './components/ClientInit';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import SessionWrapper from './components/SessionWrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Key Inventory System",
  description: "Manage your key inventory efficiently",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionWrapper>
          <ErrorBoundary>
            <ClientInit>
              <Suspense fallback={<LoadingSpinner />}>
                <ClientWrapper>{children}</ClientWrapper>
              </Suspense>
            </ClientInit>
          </ErrorBoundary>
        </SessionWrapper>
      </body>
    </html>
  );
}

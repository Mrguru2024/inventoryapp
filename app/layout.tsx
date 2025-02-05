import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientRoot } from './components/ClientRoot';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Key Inventory System",
  description: "Manage your key inventory efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}

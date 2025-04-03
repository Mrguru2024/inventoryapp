import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import ClientChatWrapper from "./components/ClientChatWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory Management System",
  description:
    "A comprehensive inventory management system for key and transponder management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <main className="min-h-screen bg-background">{children}</main>
          <ClientChatWrapper />
        </Providers>
      </body>
    </html>
  );
}

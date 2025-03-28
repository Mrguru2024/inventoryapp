import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import { Toaster } from "@/app/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
          <HotToaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

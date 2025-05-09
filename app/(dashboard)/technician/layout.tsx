"use client";

import { ThemeProvider } from "@/app/components/ThemeProvider";
import dynamic from "next/dynamic";
import { TechnicianAuthCheck } from "./TechnicianAuthCheck";
import { TechnicianNav } from "@/components/navigation/TechnicianNav";

// Dynamically import ThemeToggle with no SSR
const ClientThemeToggle = dynamic(
  () => import("@/app/components/ThemeToggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
  }
);

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Fixed Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Inventory System
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Technician Portal
              </p>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <TechnicianNav />
            </div>

            {/* Sign Out Button */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white group"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-gray-400 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="pl-64 flex flex-col flex-1 min-h-screen bg-gray-100 dark:bg-gray-900">
          <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
          <ClientThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}

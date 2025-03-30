import { Suspense } from "react";
import SideMenu from "@/app/components/SideMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { UserMenu } from "@/app/components/UserMenu";
import { ThemeProvider } from "@/app/components/theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          <div className="flex-1">
            <SideMenu />
          </div>
          <UserMenu />
        </div>
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}

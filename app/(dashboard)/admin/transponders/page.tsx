import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/components/LoadingSpinner";

// Dynamically import components with loading fallback
const TransponderManagement = dynamic(
  () => import("@/app/components/TransponderManagement"),
  {
    loading: () => <LoadingSpinner />,
  }
);

const QueryClientWrapper = dynamic(
  () =>
    import("@/app/components/QueryClientWrapper").then(
      (mod) => mod.QueryClientWrapper
    ),
  {
    loading: () => <LoadingSpinner />,
  }
);

export default async function TranspondersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  // Verify correct role
  if ((session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transponder Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage transponder inventory and programming guides
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <QueryClientWrapper>
              <TransponderManagement />
            </QueryClientWrapper>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

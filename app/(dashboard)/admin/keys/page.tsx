import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import KeysTable from "@/app/components/KeysTable";
import { QueryClientWrapper } from "@/app/components/QueryClientWrapper";

export default async function KeysPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Verify correct role
  if ((session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Key Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and track key inventory
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <QueryClientWrapper>
          <KeysTable />
        </QueryClientWrapper>
      </div>
    </div>
  );
}

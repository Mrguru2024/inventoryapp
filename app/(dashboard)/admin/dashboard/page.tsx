import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { VinDecoder } from "@/app/components/VinDecoder";
import TransponderManagement from "@/app/components/TransponderManagement";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {session.user?.name || session.user?.email}
        </p>
      </div>

      {/* VIN Decoder Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          VIN Decoder
        </h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Quickly decode vehicle information using a VIN. The model year is
              optional but recommended for more accurate results.
            </p>
            <VinDecoder />
          </div>
        </div>
      </div>

      {/* Transponder Management Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Transponder Management
        </h2>
        <TransponderManagement />
      </div>
    </div>
  );
}

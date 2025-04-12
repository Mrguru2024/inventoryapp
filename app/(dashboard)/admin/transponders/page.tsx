import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminTranspondersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Transponder Management</h1>
      <div className="grid gap-6">
        {/* Transponder management content will go here */}
      </div>
    </div>
  );
}

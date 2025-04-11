import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StockTable } from "@/components/stock/StockTable";
import { StockForm } from "@/components/stock/StockForm";

export default async function AdminInventoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      <div className="grid gap-6">
        <StockForm />
        <StockTable />
      </div>
    </div>
  );
}

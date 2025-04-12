"use client";

import { useSession } from "next-auth/react";
import { StockTable } from "@/components/stock/StockTable";
import { redirect } from "next/navigation";

export default function MyInventoryPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        My Inventory
      </h1>
      <div className="bg-card p-6 rounded-lg shadow dark:bg-slate-800">
        <StockTable showAll={false} userId={session.user.id} />
      </div>
    </div>
  );
}

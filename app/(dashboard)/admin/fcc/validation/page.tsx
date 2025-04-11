"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/components/ui/use-toast";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const styles = {
  container: "min-h-screen bg-slate-50 dark:bg-slate-900 p-8",
  header: "text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100",
  card: "bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  button: {
    primary:
      "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary:
      "px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
  },
  breadcrumb:
    "flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6",
};

export default function FCCIDValidation() {
  const { toast } = useToast();

  const {
    data: fccIds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fccIds"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/fcc");
        if (!response.ok) throw new Error("Failed to fetch FCC IDs");
        return response.json();
      } catch (error) {
        console.error("Error fetching FCC IDs:", error);
        throw error;
      }
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load FCC IDs",
      variant: "destructive",
    });
    return <div>Error loading FCC IDs</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link
          href="/admin"
          className="hover:text-slate-900 dark:hover:text-slate-100"
        >
          Admin
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/admin/fcc"
          className="hover:text-slate-900 dark:hover:text-slate-100"
        >
          FCC ID Management
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>Validation</span>
      </div>

      <h1 className={styles.header}>FCC ID Validation</h1>

      <div className={styles.card}>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Validate FCC ID Data
        </h2>
        {/* Validation form will go here */}
      </div>
    </div>
  );
}

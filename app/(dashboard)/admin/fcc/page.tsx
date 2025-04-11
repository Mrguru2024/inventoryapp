"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ui/use-toast";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Link from "next/link";
import { ChevronRight, Search, Plus } from "lucide-react";
import FccIdUpdateButton from "@/app/components/FccIdUpdateButton";

const styles = {
  container: "min-h-screen bg-slate-50 dark:bg-slate-900 p-8",
  header: "text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100",
  card: "bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  button: {
    primary:
      "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
  },
  nav: "flex space-x-4 mb-6",
  navItem:
    "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100",
  navItemActive: "text-blue-600 dark:text-blue-400 font-medium",
  breadcrumb:
    "flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6",
  input:
    "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 sm:text-sm",
  label: "block text-sm font-medium text-slate-700 dark:text-slate-200",
  table: {
    container:
      "mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700",
    table: "min-w-full divide-y divide-slate-200 dark:divide-slate-700",
    header: "bg-slate-50 dark:bg-slate-800",
    headerCell:
      "px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider",
    row: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700",
    cell: "px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100",
  },
};

interface FccId {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function FCCIDManagement() {
  const [activeTab, setActiveTab] = useState<"add" | "validate">("add");
  const { toast } = useToast();
  const [errorShown, setErrorShown] = useState(false);
  const queryClient = useQueryClient();

  // Form states
  const [newFccId, setNewFccId] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [validateFccId, setValidateFccId] = useState("");

  const {
    data: fccIds,
    isLoading,
    error,
  } = useQuery<FccId[]>({
    queryKey: ["fccIds"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/fcc");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch FCC IDs");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching FCC IDs:", error);
        throw error;
      }
    },
    retry: 1,
  });

  const addFccIdMutation = useMutation({
    mutationFn: async (data: { id: string; description: string }) => {
      const response = await fetch("/api/fcc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add FCC ID");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fccIds"] });
      setNewFccId("");
      setNewDescription("");
      toast({
        title: "Success",
        description: "FCC ID added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFccId = async (fccId: string, description: string) => {
    const response = await fetch("/api/fcc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: fccId, description }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update FCC ID");
    }
    queryClient.invalidateQueries({ queryKey: ["fccIds"] });
    return response.json();
  };

  const handleAddFccId = async (e: React.FormEvent) => {
    e.preventDefault();
    addFccIdMutation.mutate({ id: newFccId, description: newDescription });
  };

  const handleValidateFccId = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchingFccId = fccIds?.find((fcc) => fcc.id === validateFccId);
    toast({
      title: matchingFccId ? "Valid FCC ID" : "Invalid FCC ID",
      description: matchingFccId
        ? `FCC ID found: ${matchingFccId.description}`
        : "This FCC ID does not exist in the database",
      variant: matchingFccId ? "default" : "destructive",
    });
  };

  useEffect(() => {
    if (error && !errorShown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load FCC IDs",
        variant: "destructive",
      });
      setErrorShown(true);
    }
  }, [error, errorShown, toast]);

  if (isLoading) return <LoadingSpinner />;

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
      </div>

      <h1 className={styles.header}>FCC ID Management</h1>

      <div className={styles.nav}>
        <button
          onClick={() => setActiveTab("add")}
          className={`${styles.button.primary} ${
            activeTab === "add" ? "bg-blue-600 dark:bg-blue-700" : ""
          }`}
        >
          Add/Edit FCC ID
        </button>
        <button
          onClick={() => setActiveTab("validate")}
          className={`${styles.button.secondary} ${
            activeTab === "validate" ? "bg-slate-300 dark:bg-slate-600" : ""
          }`}
        >
          Validate Data
        </button>
      </div>

      <div className={styles.card}>
        {activeTab === "add" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Add New FCC ID
            </h2>
            <form onSubmit={handleAddFccId} className="space-y-4">
              <div>
                <label htmlFor="fccId" className={styles.label}>
                  FCC ID
                </label>
                <input
                  type="text"
                  id="fccId"
                  value={newFccId}
                  onChange={(e) => setNewFccId(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={addFccIdMutation.isPending}
                className={styles.button.primary}
              >
                {addFccIdMutation.isPending ? (
                  "Adding..."
                ) : (
                  <>
                    <Plus className="inline-block w-4 h-4 mr-1" />
                    Add FCC ID
                  </>
                )}
              </button>
            </form>

            <div className={styles.table.container}>
              <table className={styles.table.table}>
                <thead className={styles.table.header}>
                  <tr>
                    <th className={styles.table.headerCell}>FCC ID</th>
                    <th className={styles.table.headerCell}>Description</th>
                    <th className={styles.table.headerCell}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {fccIds?.map((fccId) => (
                    <tr key={fccId.id} className={styles.table.row}>
                      <td className={styles.table.cell}>{fccId.id}</td>
                      <td className={styles.table.cell}>{fccId.description}</td>
                      <td className={styles.table.cell}>
                        <FccIdUpdateButton
                          fccId={fccId.id}
                          description={fccId.description}
                          onUpdate={updateFccId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Validate FCC ID
            </h2>
            <form onSubmit={handleValidateFccId} className="space-y-4">
              <div>
                <label htmlFor="validateFccId" className={styles.label}>
                  Enter FCC ID to validate
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="validateFccId"
                    value={validateFccId}
                    onChange={(e) => setValidateFccId(e.target.value)}
                    className={styles.input}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>
              <button type="submit" className={styles.button.primary}>
                Validate
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

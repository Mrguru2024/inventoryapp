"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transponderService,
  TransponderData,
} from "@/app/services/transponderService";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import AddTransponderModal from "@/app/components/AddTransponderModal";
import Fuse from "fuse.js";

export default function ManageTransponders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: transponders = [], isLoading } = useQuery<TransponderData[]>({
    queryKey: ["transponders"],
    queryFn: transponderService.getAllTransponders,
  });

  const deleteMutation = useMutation({
    mutationFn: transponderService.deleteTransponder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transponders"] });
      toast.success("Transponder deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete transponder");
      console.error("Delete error:", error);
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this transponder?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  // Create a Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(transponders, {
      keys: [
        { name: "make", weight: 0.4 },
        { name: "model", weight: 0.3 },
        { name: "transponderType", weight: 0.2 },
        { name: "chipType", weight: 0.05 },
        { name: "compatibleParts", weight: 0.05 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [transponders]);

  // Filter transponders based on search term
  const filteredTransponders = useMemo(() => {
    if (!searchTerm) return transponders;

    const searchResults = fuse.search(searchTerm);
    return searchResults.map((result) => result.item);
  }, [searchTerm, fuse, transponders]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Transponders
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add new transponder"
        >
          Add New Transponder
        </button>
      </div>

      <div className="w-full sm:w-96">
        <input
          type="text"
          placeholder="Search transponders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search transponders"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Make
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransponders.map((transponder) => (
                <tr key={transponder.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transponder.make}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transponder.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transponder.yearStart} - {transponder.yearEnd || "Present"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transponder.transponderType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(transponder.id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label={`Delete transponder for ${transponder.make} ${transponder.model}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Showing {filteredTransponders.length} of {transponders.length}{" "}
        transponders
      </div>

      <AddTransponderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

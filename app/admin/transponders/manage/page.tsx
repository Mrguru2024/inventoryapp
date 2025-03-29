"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transponderService,
  TransponderData,
} from "@/app/services/transponderService";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import AddTransponderModal from "@/app/components/AddTransponderModal";

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

  const filteredTransponders = transponders.filter((transponder) =>
    Object.values(transponder).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Transponders</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add new transponder"
        >
          Add New Transponder
        </button>
      </div>

      <div className="mb-4">
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

      <div className="mt-4 text-sm text-gray-500">
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

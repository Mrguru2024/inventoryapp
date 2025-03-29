"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transponderService,
  TransponderData,
} from "@/app/services/transponderService";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function AddTransponder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<TransponderData, "id">>({
    make: "",
    model: "",
    yearStart: null,
    yearEnd: null,
    transponderType: "",
    chipType: [],
    compatibleParts: [],
    frequency: null,
    notes: null,
    dualSystem: false,
  });

  const addMutation = useMutation({
    mutationFn: (data: Omit<TransponderData, "id">) =>
      transponderService.addTransponderData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transponders"] });
      toast.success("Transponder added successfully");
      router.push("/admin/transponders/manage");
    },
    onError: (error) => {
      toast.error("Failed to add transponder");
      console.error("Add error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Transponder</h1>
        <button
          onClick={() => router.push("/admin/transponders/manage")}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
          aria-label="Back to transponder list"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="make"
              className="block text-sm font-medium text-gray-700"
            >
              Make
            </label>
            <input
              id="make"
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Vehicle make"
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <input
              id="model"
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Vehicle model"
            />
          </div>

          <div>
            <label
              htmlFor="yearStart"
              className="block text-sm font-medium text-gray-700"
            >
              Start Year
            </label>
            <input
              id="yearStart"
              type="number"
              name="yearStart"
              value={formData.yearStart || ""}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Start year"
            />
          </div>

          <div>
            <label
              htmlFor="yearEnd"
              className="block text-sm font-medium text-gray-700"
            >
              End Year
            </label>
            <input
              id="yearEnd"
              type="number"
              name="yearEnd"
              value={formData.yearEnd || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="End year"
            />
          </div>

          <div>
            <label
              htmlFor="transponderType"
              className="block text-sm font-medium text-gray-700"
            >
              Transponder Type
            </label>
            <input
              id="transponderType"
              type="text"
              name="transponderType"
              value={formData.transponderType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Transponder type"
            />
          </div>

          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700"
            >
              Frequency
            </label>
            <input
              id="frequency"
              type="text"
              name="frequency"
              value={formData.frequency || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Frequency"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="chipType"
              className="block text-sm font-medium text-gray-700"
            >
              Chip Types (comma-separated)
            </label>
            <input
              id="chipType"
              type="text"
              name="chipType"
              value={formData.chipType.join(", ")}
              onChange={handleArrayChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Chip types"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="compatibleParts"
              className="block text-sm font-medium text-gray-700"
            >
              Compatible Parts (comma-separated)
            </label>
            <input
              id="compatibleParts"
              type="text"
              name="compatibleParts"
              value={formData.compatibleParts.join(", ")}
              onChange={handleArrayChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Compatible parts"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Notes"
            />
          </div>

          <div className="flex items-center">
            <input
              id="dualSystem"
              type="checkbox"
              name="dualSystem"
              checked={formData.dualSystem}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label="Dual system"
            />
            <label
              htmlFor="dualSystem"
              className="ml-2 block text-sm text-gray-900"
            >
              Dual System
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/transponders/manage")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Cancel adding transponder"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            aria-label="Add transponder"
          >
            {isSubmitting ? <LoadingSpinner /> : "Add Transponder"}
          </button>
        </div>
      </form>
    </div>
  );
}

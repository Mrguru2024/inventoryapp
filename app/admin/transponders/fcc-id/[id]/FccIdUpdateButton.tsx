"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TransponderData {
  id: string;
  make: string;
  model: string;
  yearStart?: number | null;
  yearEnd?: number | null;
  transponderType?: string;
  chipType?: string[] | string;
  compatibleParts?: string[] | string;
  frequency?: string | null;
  notes?: string | null;
  dualSystem?: boolean;
  fccId?: string | null;
}

interface ScrapedData {
  make?: string;
  model?: string;
  year?: string;
  transponderType?: string;
  fccId: string;
  source?: string;
  link?: string;
}

interface FccIdUpdateButtonProps {
  fccId: string;
  transponder: TransponderData | null;
  scrapedData: ScrapedData | null;
}

export default function FccIdUpdateButton({
  fccId,
  transponder,
  scrapedData,
}: FccIdUpdateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Function to update the transponder with the FCC ID
  const updateTransponder = async (transponderId: string) => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/transponders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transponderId,
          fccId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update transponder");
      }

      setMessage("FCC ID successfully updated!");
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error("Error updating FCC ID:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If we already have a transponder, provide a direct update button
  if (transponder) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Update Transponder FCC ID</h2>

        <p className="mb-4">
          This transponder currently{" "}
          {transponder.fccId
            ? `has FCC ID: ${transponder.fccId}`
            : "has no FCC ID"}
          . Would you like to {transponder.fccId ? "update" : "add"} it to{" "}
          <span className="font-mono">{fccId}</span>?
        </p>

        <button
          onClick={() => updateTransponder(transponder.id)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          {isLoading
            ? "Updating..."
            : `${transponder.fccId ? "Update" : "Add"} FCC ID`}
        </button>

        {message && (
          <p className="mt-4 text-green-600 dark:text-green-400">{message}</p>
        )}

        {error && (
          <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // If we have scraped data but no transponder, show a message
  if (scrapedData && scrapedData.make && scrapedData.model) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          FCC ID Not Linked to Transponder
        </h2>

        <p className="mb-4">
          This FCC ID is not yet linked to any transponder in the database. The
          scraped data suggests it belongs to:
        </p>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4">
          <p>
            <strong>Make:</strong> {scrapedData.make}
          </p>
          <p>
            <strong>Model:</strong> {scrapedData.model}
          </p>
          {scrapedData.year && (
            <p>
              <strong>Year:</strong> {scrapedData.year}
            </p>
          )}
          {scrapedData.transponderType && (
            <p>
              <strong>Type:</strong> {scrapedData.transponderType}
            </p>
          )}
        </div>

        <p className="mb-4">
          To link this FCC ID, please use the transponder search to find the
          corresponding vehicle and update it, or create a new transponder
          record.
        </p>

        <div className="flex space-x-4">
          <Link
            href="/admin/transponders/search"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Search Transponders
          </Link>
        </div>
      </div>
    );
  }

  // Default case - no matching data
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">No Matching Transponder</h2>

      <p className="mb-4">
        No matching transponder found in the database. You can search for
        transponders or add a new one.
      </p>

      <div className="flex space-x-4">
        <Link
          href="/admin/transponders/search"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Search Transponders
        </Link>
      </div>
    </div>
  );
}

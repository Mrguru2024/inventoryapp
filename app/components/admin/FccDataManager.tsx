"use client";

import { useState } from "react";
import {
  runFccScrapers,
  getFccScraperStatus,
} from "@/app/actions/runFccScraper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { toast } from "sonner";

export default function FccDataManager() {
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  // Query to get the scraper status
  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["fccScraperStatus"],
    queryFn: getFccScraperStatus,
    refetchInterval: isRunning ? 5000 : false, // Poll every 5 seconds when scraper is running
  });

  // Function to run the scrapers
  const handleRunScrapers = async () => {
    setIsRunning(true);
    toast.info("Starting FCC ID data scraping process...");

    try {
      const result = await runFccScrapers();

      if (result.success) {
        toast.success(result.message);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["fccScraperStatus"] });
        queryClient.invalidateQueries({ queryKey: ["transponders"] });
      } else {
        toast.error(`Error: ${result.message}`);
        console.error("Scraper error details:", result.error);
      }
    } catch (error) {
      toast.error("Failed to run FCC ID scrapers");
      console.error("Error running scrapers:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Format the last updated date if it exists
  const formattedLastUpdated = statusData?.lastUpdated
    ? new Date(statusData.lastUpdated).toLocaleString()
    : "Unknown";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">FCC ID Data Manager</h2>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          This tool allows you to update transponder FCC IDs from external
          sources. The process will:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <li>Scrape FCC ID data from Transpondery.com</li>
          <li>Scrape FCC ID data from UHS Hardware</li>
          <li>Update the database records with matched FCC IDs</li>
          <li>Automatically refresh the transponder search page</li>
        </ol>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
        <Button
          onClick={handleRunScrapers}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {isRunning ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Running Scrapers...</span>
            </>
          ) : (
            "Run FCC ID Scrapers"
          )}
        </Button>

        <div className="text-sm">
          {isLoadingStatus ? (
            <p className="text-gray-500">Checking scraper status...</p>
          ) : statusData?.success ? (
            <div className="text-green-600 dark:text-green-400">
              <p>✅ FCC ID data files exist</p>
              <p className="text-xs mt-1">
                Last updated: {formattedLastUpdated}
              </p>
            </div>
          ) : (
            <p className="text-amber-600 dark:text-amber-400">
              ⚠️ {statusData?.message || "FCC ID data status unknown"}
            </p>
          )}
        </div>
      </div>

      {statusData?.fileInfo && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">File Information:</h3>
          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
            {statusData.fileInfo.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}

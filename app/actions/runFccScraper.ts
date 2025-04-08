"use server";

import { revalidatePath } from "next/cache";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Server action to run the FCC ID scrapers and update the database
 * This allows administrators to trigger the scraping process from the UI
 */
export async function runFccScrapers() {
  try {
    console.log("Starting FCC ID data scraping process...");

    // Run the Transpondery scraper
    console.log("Running Transpondery scraper...");
    await execPromise("npm run scrape:transpondery");

    // Run the UHS Hardware scraper
    console.log("Running UHS Hardware scraper...");
    await execPromise("npm run scrape:uhs");

    // Update the database with scraped FCC IDs
    console.log("Updating database with scraped FCC IDs...");
    await execPromise("npm run update:fccids");

    // Revalidate the transponders API route to refresh the data
    console.log("Refreshing transponder data...");
    revalidatePath("/admin/transponders/search");
    revalidatePath("/api/transponders");

    return {
      success: true,
      message: "FCC ID data scraped and database updated successfully",
    };
  } catch (error) {
    console.error("Error running FCC ID scrapers:", error);
    return {
      success: false,
      message: "Failed to run FCC ID scrapers",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get the status of the most recent scraping process
 */
export async function getFccScraperStatus() {
  try {
    // Check if the data files exist by running a simple command
    const { stdout } = await execPromise(
      'ls -la data/transpondery-fccid.json data/uhs-fccid.json 2>/dev/null || echo "Not found"'
    );

    if (stdout.includes("Not found")) {
      return {
        success: false,
        message: "Scraper data files not found. Please run the scrapers first.",
      };
    }

    // Get the file info to show last update time
    const { stdout: fileInfo } = await execPromise(
      "ls -la data/transpondery-fccid.json data/uhs-fccid.json"
    );
    const lines = fileInfo.split("\n").filter(Boolean);

    return {
      success: true,
      message: "FCC ID data files found",
      lastUpdated: new Date().toISOString(),
      fileInfo: lines,
    };
  } catch (error) {
    console.error("Error getting FCC scraper status:", error);
    return {
      success: false,
      message: "Failed to get FCC scraper status",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

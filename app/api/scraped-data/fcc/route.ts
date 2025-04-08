import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    // Define paths to scraped data files
    const transponderyDataPath = path.join(
      process.cwd(),
      "data",
      "transpondery-fccid.json"
    );
    const uhsDataPath = path.join(process.cwd(), "data", "uhs-fccid.json");

    // Check if files exist
    const transponderyExists = fs.existsSync(transponderyDataPath);
    const uhsExists = fs.existsSync(uhsDataPath);

    if (!transponderyExists && !uhsExists) {
      return NextResponse.json(
        {
          error: "Scraped data files not found. Please run the scrapers first.",
        },
        { status: 404 }
      );
    }

    // Read and parse data files
    let transponderyData = [];
    let uhsData = [];

    if (transponderyExists) {
      try {
        const rawData = fs.readFileSync(transponderyDataPath, "utf8");
        transponderyData = JSON.parse(rawData);
      } catch (error) {
        console.error("Error reading Transpondery data:", error);
      }
    }

    if (uhsExists) {
      try {
        const rawData = fs.readFileSync(uhsDataPath, "utf8");
        uhsData = JSON.parse(rawData);
      } catch (error) {
        console.error("Error reading UHS data:", error);
      }
    }

    // Combine data from both sources
    let allData = [...transponderyData, ...uhsData];

    // Apply filters if provided
    if (make) {
      allData = allData.filter((item) => {
        const itemMake = item.make?.toLowerCase();
        return itemMake && itemMake.includes(make.toLowerCase());
      });
    }

    if (model) {
      allData = allData.filter((item) => {
        const itemModel = item.model?.toLowerCase();
        return itemModel && itemModel.includes(model.toLowerCase());
      });
    }

    // Add data source information if not already present
    allData = allData.map((item) => ({
      ...item,
      source:
        item.source ||
        (transponderyData.includes(item) ? "Transpondery.com" : "UHS Hardware"),
    }));

    console.log(`Returning ${allData.length} scraped FCC ID records`);
    return NextResponse.json(allData);
  } catch (error) {
    console.error("Error fetching scraped FCC ID data:", error);
    return NextResponse.json(
      { error: "Failed to fetch scraped FCC ID data" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api";

// Cache for 24 hours since NHTSA data doesn't change frequently
const CACHE_DURATION = 24 * 60 * 60;

// In-memory cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    // Check in-memory cache first
    const cacheKey = `${endpoint}-${make || ""}-${model || ""}`;
    const cachedData = cache.get(cacheKey);
    if (
      cachedData &&
      Date.now() - cachedData.timestamp < CACHE_DURATION * 1000
    ) {
      return NextResponse.json(cachedData.data, {
        headers: {
          "Cache-Control": `public, max-age=${CACHE_DURATION}`,
        },
      });
    }

    let url = `${NHTSA_BASE_URL}/vehicles`;

    // Add parameters based on the endpoint
    if (endpoint === "getallmakes") {
      url = `${NHTSA_BASE_URL}/vehicles/GetAllMakes?format=json`;
    } else if (endpoint === "getmodelsformake" && make) {
      url = `${NHTSA_BASE_URL}/vehicles/GetModelsForMake/${encodeURIComponent(
        make
      )}?format=json`;
    } else if (endpoint === "getmodelsformakeidyear" && make && model) {
      url = `${NHTSA_BASE_URL}/vehicles/GetModelsForMakeIdYear/${encodeURIComponent(
        make
      )}/${encodeURIComponent(model)}?format=json`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Origin: "http://localhost:3000",
      },
      method: "GET",
      cache: "no-store",
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NHTSA API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url,
      });
      return NextResponse.json(
        { error: `NHTSA API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data || !data.Results) {
      console.error("Invalid NHTSA API response:", data);
      return NextResponse.json(
        { error: "Invalid response from NHTSA API" },
        { status: 500 }
      );
    }

    // Cache the successful response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_DURATION}`,
      },
    });
  } catch (error) {
    console.error("Error fetching from NHTSA API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from NHTSA API" },
      { status: 500 }
    );
  }
}

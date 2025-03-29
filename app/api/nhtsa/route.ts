import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

  try {
    let url = `https://vpic.nhtsa.dot.gov/api/vehicles/${endpoint}`;

    // Add parameters based on the endpoint
    if (endpoint === "getallmakes") {
      url += "?format=json";
    } else if (endpoint === "getmodelsformake" && make) {
      url += `/${encodeURIComponent(make)}?format=json`;
    } else if (endpoint === "getmodelsformakeidyear" && make && model) {
      url += `/${encodeURIComponent(make)}/${encodeURIComponent(
        model
      )}?format=json`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NHTSA API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.Results) {
      throw new Error("Invalid response format from NHTSA API");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from NHTSA API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from NHTSA API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

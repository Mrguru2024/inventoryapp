import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    if (!make || !model) {
      return NextResponse.json(
        { error: "Make and model parameters are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelyearsformakeidmodelid/${make}/${model}?format=json`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Sort years in descending order
    const sortedYears = data.Results.sort(
      (a: any, b: any) => b.Model_Year - a.Model_Year
    );

    return NextResponse.json({
      Results: sortedYears,
      Count: sortedYears.length,
    });
  } catch (error) {
    console.error("Error fetching years:", error);
    // Return a fallback list of recent years if the API fails
    const currentYear = new Date().getFullYear();
    const fallbackYears = Array.from({ length: 10 }, (_, i) => ({
      Model_Year: currentYear - i,
    }));

    return NextResponse.json({
      Results: fallbackYears,
      Count: fallbackYears.length,
    });
  }
}

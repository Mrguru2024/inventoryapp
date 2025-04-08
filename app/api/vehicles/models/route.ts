import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");

    if (!make) {
      return NextResponse.json(
        { error: "Make parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`,
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

    // Sort models alphabetically
    const sortedModels = data.Results.sort((a: any, b: any) =>
      a.Model_Name.localeCompare(b.Model_Name)
    );

    return NextResponse.json({
      Results: sortedModels,
      Count: sortedModels.length,
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    // Return a fallback list of common models if the API fails
    const fallbackModels = [
      { Model_ID: 1, Model_Name: "ACCORD" },
      { Model_ID: 2, Model_Name: "CIVIC" },
      { Model_ID: 3, Model_Name: "CR-V" },
      { Model_ID: 4, Model_Name: "PILOT" },
      { Model_ID: 5, Model_Name: "HR-V" },
      { Model_ID: 6, Model_Name: "ODYSSEY" },
      { Model_ID: 7, Model_Name: "PASSPORT" },
      { Model_ID: 8, Model_Name: "RIDGELINE" },
    ];

    return NextResponse.json({
      Results: fallbackModels,
      Count: fallbackModels.length,
    });
  }
}

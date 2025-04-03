import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json",
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

    // Sort makes alphabetically
    const sortedMakes = data.Results.sort((a: any, b: any) =>
      a.Make_Name.localeCompare(b.Make_Name)
    );

    return NextResponse.json({
      Results: sortedMakes,
      Count: sortedMakes.length,
    });
  } catch (error) {
    console.error("Error fetching makes:", error);
    // Return a fallback list of common makes if the API fails
    const fallbackMakes = [
      { Make_ID: 1, Make_Name: "ACURA" },
      { Make_ID: 2, Make_Name: "AUDI" },
      { Make_ID: 3, Make_Name: "BMW" },
      { Make_ID: 4, Make_Name: "CHEVROLET" },
      { Make_ID: 5, Make_Name: "DODGE" },
      { Make_ID: 6, Make_Name: "FORD" },
      { Make_ID: 7, Make_Name: "HONDA" },
      { Make_ID: 8, Make_Name: "HYUNDAI" },
      { Make_ID: 9, Make_Name: "INFINITI" },
      { Make_ID: 10, Make_Name: "KIA" },
      { Make_ID: 11, Make_Name: "LEXUS" },
      { Make_ID: 12, Make_Name: "MAZDA" },
      { Make_ID: 13, Make_Name: "MERCEDES-BENZ" },
      { Make_ID: 14, Make_Name: "NISSAN" },
      { Make_ID: 15, Make_Name: "PORSCHE" },
      { Make_ID: 16, Make_Name: "SUBARU" },
      { Make_ID: 17, Make_Name: "TOYOTA" },
      { Make_ID: 18, Make_Name: "VOLKSWAGEN" },
      { Make_ID: 19, Make_Name: "VOLVO" },
    ];

    return NextResponse.json({
      Results: fallbackMakes,
      Count: fallbackMakes.length,
    });
  }
}

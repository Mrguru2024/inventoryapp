import { NextResponse } from "next/server";
import { NHTService } from "@/app/services/nhtsaService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get("vin");
    const modelYear = searchParams.get("year");

    if (!vin) {
      return NextResponse.json({ error: "VIN is required" }, { status: 400 });
    }

    const nhtsaService = NHTService.getInstance();
    const vehicleInfo = await nhtsaService.decodeVIN(
      vin,
      modelYear ? parseInt(modelYear) : undefined
    );

    if (!vehicleInfo) {
      return NextResponse.json(
        { error: "Vehicle information not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicleInfo);
  } catch (error) {
    console.error("Error processing VIN request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

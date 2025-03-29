import { NextResponse } from "next/server";
import { NHTService } from "@/app/services/nhtsaService";

interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

function createErrorResponse(
  message: string,
  status: number,
  details?: string,
  code?: string
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      details,
      code,
    },
    { status }
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    if (!action) {
      return createErrorResponse(
        "Action is required",
        400,
        "Missing action parameter"
      );
    }

    const nhtsaService = NHTService.getInstance();

    switch (action) {
      case "getMakes": {
        const makes = await nhtsaService.getAllMakes();
        if (!makes || makes.length === 0) {
          return createErrorResponse(
            "No makes found",
            404,
            "The NHTSA API returned no makes"
          );
        }
        return NextResponse.json({
          success: true,
          data: makes,
          timestamp: new Date().toISOString(),
        });
      }

      case "getModels": {
        if (!make) {
          return createErrorResponse(
            "Make is required",
            400,
            "Missing make parameter for getting models"
          );
        }
        const models = await nhtsaService.getModelsForMake(make);
        if (!models || models.length === 0) {
          return createErrorResponse(
            "No models found",
            404,
            `No models found for make: ${make}`
          );
        }
        return NextResponse.json({
          success: true,
          data: models,
          timestamp: new Date().toISOString(),
        });
      }

      case "getYears": {
        if (!make || !model) {
          return createErrorResponse(
            "Make and model are required",
            400,
            "Missing make or model parameter for getting years"
          );
        }
        const years = await nhtsaService.getYearsForMakeModel(make, model);
        if (!years || years.length === 0) {
          return createErrorResponse(
            "No years found",
            404,
            `No years found for make: ${make} and model: ${model}`
          );
        }
        return NextResponse.json({
          success: true,
          data: years,
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return createErrorResponse(
          "Invalid action",
          400,
          `Unsupported action: ${action}`
        );
    }
  } catch (error) {
    console.error("Error processing NHTSA request:", error);
    return createErrorResponse(
      "Internal server error",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "INTERNAL_SERVER_ERROR"
    );
  }
}

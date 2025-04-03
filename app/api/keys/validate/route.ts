import { NextResponse } from "next/server";
import { keySchema } from "@/lib/validations/key";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    try {
      keySchema.parse(json);
      return NextResponse.json({ valid: true });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ valid: false, errors: error.errors });
      }
      return NextResponse.json({
        valid: false,
        errors: [{ message: "Invalid key data" }],
      });
    }
  } catch (error) {
    return new NextResponse("Error validating key data", { status: 500 });
  }
}

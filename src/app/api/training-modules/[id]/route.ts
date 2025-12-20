import { NextRequest, NextResponse } from "next/server";
import { getTrainingModuleById } from "@/app/actions";

/**
 * GET /api/training-modules/[id]
 * Get a training module by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getTrainingModuleById(id);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error fetching training module:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch module" },
      { status: 500 }
    );
  }
}


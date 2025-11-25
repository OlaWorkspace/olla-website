import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/clients/browser";

/**
 * Promote a user to professional status
 * POST /api/admin/users/promote
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Update user to pro status
    const { error } = await supabase
      .from("users")
      .update({ pro: true })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "User promoted to professional",
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to promote user" },
      { status: 500 }
    );
  }
}

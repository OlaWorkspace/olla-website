import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/clients/browser";

/**
 * Demote a user from professional to client status
 * POST /api/admin/users/demote
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

    // Update user to client status
    const { error } = await supabase
      .from("users")
      .update({ pro: false })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "User demoted to client",
    });
  } catch (error) {
    console.error("Error demoting user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to demote user" },
      { status: 500 }
    );
  }
}

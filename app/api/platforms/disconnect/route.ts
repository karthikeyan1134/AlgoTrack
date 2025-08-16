import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platformId } = await request.json()

    if (!platformId) {
      return NextResponse.json({ error: "Platform ID is required" }, { status: 400 })
    }

    // Deactivate platform connection
    const { error } = await supabase
      .from("user_platforms")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("platform_id", platformId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to disconnect platform" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Platform disconnected successfully",
    })
  } catch (error) {
    console.error("Platform disconnection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

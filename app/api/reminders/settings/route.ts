import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, return default settings
    // In a real app, you'd store these in the database
    const settings = {
      emailNotifications: true,
      pushNotifications: false,
      defaultReminderTime: "30",
      platforms: ["LeetCode", "Codeforces", "AtCoder"],
    }

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await request.json()

    // In a real app, you'd save these settings to the database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

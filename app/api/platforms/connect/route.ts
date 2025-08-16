import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getPlatformService } from "@/lib/platform-services"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platformName, username } = await request.json()

    if (!platformName || !username) {
      return NextResponse.json({ error: "Platform name and username are required" }, { status: 400 })
    }

    // Get platform service
    const platformService = getPlatformService(platformName)
    if (!platformService) {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    // Verify user exists on the platform
    const platformUser = await platformService.getUserInfo(username)
    if (!platformUser) {
      return NextResponse.json({ error: "User not found on platform" }, { status: 404 })
    }

    // Get platform ID from database
    const { data: platform } = await supabase.from("platforms").select("id").eq("name", platformService.name).single()

    if (!platform) {
      return NextResponse.json({ error: "Platform not found in database" }, { status: 404 })
    }

    // Insert or update user platform connection
    const { data, error } = await supabase
      .from("user_platforms")
      .upsert({
        user_id: user.id,
        platform_id: platform.id,
        platform_username: username,
        is_active: true,
        last_synced: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to connect platform" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Platform connected successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("Platform connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

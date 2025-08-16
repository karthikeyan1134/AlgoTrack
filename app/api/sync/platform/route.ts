import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PlatformSyncService } from "@/lib/platform-services"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platform, username } = await request.json()

    if (!platform || !username) {
      return NextResponse.json({ error: "Platform and username are required" }, { status: 400 })
    }

    const syncService = new PlatformSyncService(supabase)
    const success = await syncService.syncPlatform(user.id, platform, username)

    return NextResponse.json({
      success,
      message: success ? "Platform synced successfully" : "Failed to sync platform",
    })
  } catch (error) {
    console.error("Sync API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { platformServices } from "@/lib/platform-services"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch contests from all platforms
    const allContests = []

    for (const [platformName, service] of Object.entries(platformServices)) {
      try {
        const contests = await service.getUpcomingContests()

        // Get platform ID
        const { data: platform } = await supabase.from("platforms").select("id").eq("name", service.name).single()

        if (platform) {
          const contestsWithPlatform = contests.map((contest) => ({
            ...contest,
            platform_id: platform.id,
            platform_name: service.name,
          }))
          allContests.push(...contestsWithPlatform)
        }
      } catch (error) {
        console.error(`Error fetching contests from ${service.name}:`, error)
      }
    }

    // Sort by start time
    allContests.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

    // Store contests in database
    const contestData = allContests.map((contest) => ({
      platform_id: contest.platform_id,
      title: contest.title,
      contest_url: contest.contestUrl,
      start_time: contest.startTime.toISOString(),
      duration: contest.duration,
      is_rated: contest.isRated,
    }))

    // Upsert contests
    if (contestData.length > 0) {
      await supabase.from("contests").upsert(contestData, {
        onConflict: "platform_id,title,start_time",
        ignoreDuplicates: true,
      })
    }

    return NextResponse.json({
      success: true,
      contests: allContests.slice(0, 10), // Return first 10 contests
    })
  } catch (error) {
    console.error("Contest fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

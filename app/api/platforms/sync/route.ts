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

    const { platformId } = await request.json()

    if (!platformId) {
      return NextResponse.json({ error: "Platform ID is required" }, { status: 400 })
    }

    // Get user platform connection
    const { data: userPlatform } = await supabase
      .from("user_platforms")
      .select(`
        *,
        platforms (name)
      `)
      .eq("user_id", user.id)
      .eq("platform_id", platformId)
      .eq("is_active", true)
      .single()

    if (!userPlatform) {
      return NextResponse.json({ error: "Platform connection not found" }, { status: 404 })
    }

    // Get platform service
    const platformService = getPlatformService(userPlatform.platforms.name)
    if (!platformService) {
      return NextResponse.json({ error: "Platform service not available" }, { status: 400 })
    }

    // Fetch submissions from platform
    const submissions = await platformService.getSubmissions(userPlatform.platform_username, 50)

    // Insert submissions into database
    const submissionData = submissions.map((submission) => ({
      user_id: user.id,
      platform_id: platformId,
      problem_title: submission.problemTitle,
      problem_url: submission.problemUrl,
      difficulty: submission.difficulty,
      category: submission.category,
      status: submission.status,
      language: submission.language,
      submission_date: submission.submissionDate.toISOString(),
      execution_time: submission.executionTime,
      memory_used: submission.memoryUsed,
    }))

    // Insert submissions (ignore duplicates)
    const { error: submissionError } = await supabase.from("submissions").upsert(submissionData, {
      onConflict: "user_id,platform_id,problem_title,submission_date",
      ignoreDuplicates: true,
    })

    if (submissionError) {
      console.error("Submission sync error:", submissionError)
    }

    // Update last synced timestamp
    await supabase.from("user_platforms").update({ last_synced: new Date().toISOString() }).eq("id", userPlatform.id)

    return NextResponse.json({
      success: true,
      message: "Platform synced successfully",
      submissionsCount: submissions.length,
    })
  } catch (error) {
    console.error("Platform sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

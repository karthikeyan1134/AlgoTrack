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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Get submissions with platform information
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(`
        *,
        platforms (name)
      `)
      .eq("user_id", user.id)
      .order("submission_date", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
    }

    // Transform data to include platform name
    const transformedSubmissions =
      submissions?.map((submission) => ({
        ...submission,
        platform_name: submission.platforms?.name || "Unknown",
      })) || []

    // Get total count for pagination
    const { count } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    return NextResponse.json({
      success: true,
      submissions: transformedSubmissions,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Submissions fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

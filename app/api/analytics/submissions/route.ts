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
    const period = searchParams.get("period") || "year" // year, month, week

    // Get submission trends
    const { data: submissions } = await supabase
      .from("submissions")
      .select("submission_date, status")
      .eq("user_id", user.id)
      .order("submission_date", { ascending: true })

    if (!submissions) {
      return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
    }

    // Group submissions by time period
    const groupedData = new Map()

    submissions.forEach((submission) => {
      const date = new Date(submission.submission_date)
      let key: string

      if (period === "year") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      } else if (period === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      } else {
        // week
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split("T")[0]
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, { total: 0, accepted: 0 })
      }

      const data = groupedData.get(key)
      data.total++
      if (submission.status === "Accepted") {
        data.accepted++
      }
    })

    // Convert to array format
    const trendData = Array.from(groupedData.entries()).map(([date, data]) => ({
      date,
      submissions: data.total,
      accepted: data.accepted,
    }))

    return NextResponse.json({
      success: true,
      data: trendData,
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

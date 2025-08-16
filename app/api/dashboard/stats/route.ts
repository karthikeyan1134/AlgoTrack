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

    // Get total submissions
    const { count: totalSubmissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get accepted submissions
    const { count: acceptedSubmissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "Accepted")

    // Get submissions this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonthSubmissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("submission_date", startOfMonth.toISOString())

    // Get current streak (mock for now)
    const currentStreak = 7

    // Get contest participations
    const { count: contestParticipations } = await supabase
      .from("contest_participations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get upcoming contests count
    const { count: upcomingContests } = await supabase
      .from("contests")
      .select("*", { count: "exact", head: true })
      .gte("start_time", new Date().toISOString())

    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: totalSubmissions || 0,
        acceptedSubmissions: acceptedSubmissions || 0,
        thisMonthSubmissions: thisMonthSubmissions || 0,
        currentStreak,
        contestParticipations: contestParticipations || 0,
        upcomingContests: upcomingContests || 0,
      },
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

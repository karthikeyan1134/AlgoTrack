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

    const { data: reminders, error } = await supabase
      .from("contest_reminders")
      .select(`
        *,
        contests (
          title,
          start_time,
          platforms (name)
        )
      `)
      .eq("user_id", user.id)
      .order("reminder_time", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reminders: reminders || [],
    })
  } catch (error) {
    console.error("Reminders fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contestId, reminderMinutes } = await request.json()

    if (!contestId || !reminderMinutes) {
      return NextResponse.json({ error: "Contest ID and reminder minutes are required" }, { status: 400 })
    }

    // Get contest details
    const { data: contest } = await supabase.from("contests").select("start_time").eq("id", contestId).single()

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 })
    }

    // Calculate reminder time
    const contestStartTime = new Date(contest.start_time)
    const reminderTime = new Date(contestStartTime.getTime() - reminderMinutes * 60 * 1000)

    // Insert reminder
    const { data, error } = await supabase
      .from("contest_reminders")
      .insert({
        user_id: user.id,
        contest_id: contestId,
        reminder_time: reminderTime.toISOString(),
        is_sent: false,
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Reminder created successfully",
      reminder: data[0],
    })
  } catch (error) {
    console.error("Reminder creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

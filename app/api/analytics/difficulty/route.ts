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

    // Get difficulty distribution
    const { data: submissions } = await supabase
      .from("submissions")
      .select("difficulty")
      .eq("user_id", user.id)
      .eq("status", "Accepted")

    if (!submissions) {
      return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
    }

    // Count by difficulty
    const difficultyCount = submissions.reduce(
      (acc, submission) => {
        const difficulty = submission.difficulty || "Unknown"
        if (difficulty.toLowerCase().includes("easy") || Number.parseInt(difficulty) < 1200) {
          acc.Easy++
        } else if (difficulty.toLowerCase().includes("hard") || Number.parseInt(difficulty) > 1800) {
          acc.Hard++
        } else {
          acc.Medium++
        }
        return acc
      },
      { Easy: 0, Medium: 0, Hard: 0 },
    )

    const difficultyData = [
      { name: "Easy", value: difficultyCount.Easy, color: "#22c55e" },
      { name: "Medium", value: difficultyCount.Medium, color: "#f59e0b" },
      { name: "Hard", value: difficultyCount.Hard, color: "#ef4444" },
    ]

    return NextResponse.json({
      success: true,
      data: difficultyData,
    })
  } catch (error) {
    console.error("Difficulty analytics fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

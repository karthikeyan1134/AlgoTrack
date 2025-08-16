import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reminderId = Number.parseInt(params.id)

    if (isNaN(reminderId)) {
      return NextResponse.json({ error: "Invalid reminder ID" }, { status: 400 })
    }

    const { error } = await supabase.from("contest_reminders").delete().eq("id", reminderId).eq("user_id", user.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Reminder deleted successfully",
    })
  } catch (error) {
    console.error("Reminder deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

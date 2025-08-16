import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params

    // Note: GeeksforGeeks doesn't have a public API
    // This would require web scraping or unofficial methods
    // For now, returning structured mock data that could be replaced with real scraping

    // In a real implementation, you would:
    // 1. Use a web scraping library like Puppeteer or Cheerio
    // 2. Navigate to the user's profile page
    // 3. Extract the relevant data

    const mockUserData = {
      username,
      score: Math.floor(Math.random() * 2000) + 500,
      rank: ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"][Math.floor(Math.random() * 5)],
      problemsSolved: Math.floor(Math.random() * 200) + 50,
      contestsParticipated: Math.floor(Math.random() * 20) + 5,
    }

    return NextResponse.json({
      success: true,
      user: mockUserData,
    })
  } catch (error) {
    console.error("GeeksforGeeks API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user data",
      },
      { status: 500 },
    )
  }
}

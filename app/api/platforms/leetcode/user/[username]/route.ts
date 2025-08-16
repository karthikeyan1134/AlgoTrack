import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params

    // LeetCode GraphQL query
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userContestRanking {
            attendedContestsCount
            rating
            globalRanking
          }
        }
      }
    `

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; AlgoTracker/1.0)",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    })

    const data = await response.json()

    if (data.data?.matchedUser) {
      return NextResponse.json({
        success: true,
        user: {
          username: data.data.matchedUser.username,
          submitStats: data.data.matchedUser.submitStats,
          contestRating: data.data.matchedUser.userContestRanking?.rating,
          contestRanking: data.data.matchedUser.userContestRanking?.globalRanking,
          userContestRanking: data.data.matchedUser.userContestRanking,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "User not found",
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("LeetCode API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user data",
      },
      { status: 500 },
    )
  }
}

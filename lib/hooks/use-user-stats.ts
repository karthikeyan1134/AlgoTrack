"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface UserStats {
  totalSubmissions: number
  contestRating: number
  currentStreak: number
  upcomingContests: number
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  averageTime: number
  favoriteLanguage: string
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserStats()
    } else if (!authLoading && !user) {
      setLoading(false)
      setError("User not authenticated")
    }
  }, [user, authLoading])

  const fetchUserStats = async () => {
    if (!user) {
      setError("User not authenticated")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      const { data: userStats, error: statsError } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (statsError) {
        console.error("Stats query error:", statsError)
        throw new Error(`Failed to fetch user statistics: ${statsError.message}`)
      }

      let finalUserStats = userStats
      if (!userStats) {
        console.log("No user stats found, creating initial record")
        const { data: newStats, error: createError } = await supabase
          .from("user_statistics")
          .insert([
            {
              user_id: user.id,
              total_problems_solved: 0,
              easy_solved: 0,
              medium_solved: 0,
              hard_solved: 0,
              current_streak: 0,
              max_streak: 0,
              current_rating: 0,
              highest_rating: 0,
              total_contest_participations: 0,
              average_contest_rank: 0,
            },
          ])
          .select()
          .single()

        if (createError) {
          console.error("Error creating user stats:", createError)
          finalUserStats = null
        } else {
          finalUserStats = newStats
        }
      }

      const { count: submissionsCount, error: submissionsError } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (submissionsError) {
        console.error("Submissions count error:", submissionsError)
      }

      const { count: contestsCount, error: contestsError } = await supabase
        .from("contests")
        .select("*", { count: "exact", head: true })
        .gte("start_time", new Date().toISOString())

      if (contestsError) {
        console.error("Contests count error:", contestsError)
      }

      const { data: submissions, error: submissionsDataError } = await supabase
        .from("submissions")
        .select("execution_time, language")
        .eq("user_id", user.id)
        .not("execution_time", "is", null)

      if (submissionsDataError) {
        console.error("Submissions data error:", submissionsDataError)
      }

      let averageTime = 0
      let favoriteLanguage = "Python"

      if (submissions && submissions.length > 0) {
        const times = submissions.filter((s) => s.execution_time).map((s) => s.execution_time)
        averageTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0

        const languageCounts = submissions.reduce((acc: any, s) => {
          if (s.language) {
            acc[s.language] = (acc[s.language] || 0) + 1
          }
          return acc
        }, {})

        if (Object.keys(languageCounts).length > 0) {
          favoriteLanguage = Object.keys(languageCounts).reduce((a, b) =>
            languageCounts[a] > languageCounts[b] ? a : b,
          )
        }
      }

      setStats({
        totalSubmissions: submissionsCount || 0,
        contestRating: finalUserStats?.current_rating || 0,
        currentStreak: finalUserStats?.current_streak || 0,
        upcomingContests: contestsCount || 0,
        totalSolved: finalUserStats?.total_problems_solved || 0,
        easySolved: finalUserStats?.easy_solved || 0,
        mediumSolved: finalUserStats?.medium_solved || 0,
        hardSolved: finalUserStats?.hard_solved || 0,
        averageTime,
        favoriteLanguage,
      })
    } catch (err) {
      console.error("Error fetching user stats:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stats")
      setStats({
        totalSubmissions: 0,
        contestRating: 0,
        currentStreak: 0,
        upcomingContests: 0,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        averageTime: 0,
        favoriteLanguage: "Python",
      })
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchUserStats }
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("User not authenticated")
        return
      }

      // Fetch user statistics
      const { data: userStats, error: statsError } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (statsError && statsError.code !== "PGRST116") {
        throw statsError
      }

      // Fetch total submissions count
      const { count: submissionsCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Fetch upcoming contests count
      const { count: contestsCount } = await supabase
        .from("contests")
        .select("*", { count: "exact", head: true })
        .gte("start_time", new Date().toISOString())

      // Get average execution time and favorite language
      const { data: submissions } = await supabase
        .from("submissions")
        .select("execution_time, language")
        .eq("user_id", user.id)
        .not("execution_time", "is", null)

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
        contestRating: userStats?.current_rating || 0,
        currentStreak: userStats?.current_streak || 0,
        upcomingContests: contestsCount || 0,
        totalSolved: userStats?.total_problems_solved || 0,
        easySolved: userStats?.easy_solved || 0,
        mediumSolved: userStats?.medium_solved || 0,
        hardSolved: userStats?.hard_solved || 0,
        averageTime,
        favoriteLanguage,
      })
    } catch (err) {
      console.error("Error fetching user stats:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stats")
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchUserStats }
}

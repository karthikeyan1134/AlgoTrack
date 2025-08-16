"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface UpcomingContest {
  id: number
  title: string
  platform_name: string
  start_time: string
  duration: number
  is_rated: boolean
  contest_url?: string
}

export function useUpcomingContests(limit = 5) {
  const [contests, setContests] = useState<UpcomingContest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUpcomingContests()
  }, [limit])

  const fetchUpcomingContests = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error: contestsError } = await supabase
        .from("contests")
        .select(`
          id,
          title,
          start_time,
          duration,
          is_rated,
          contest_url,
          platforms!inner(name)
        `)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(limit)

      if (contestsError) throw contestsError

      const formattedContests =
        data?.map((contest) => ({
          ...contest,
          platform_name: contest.platforms.name,
        })) || []

      setContests(formattedContests)
    } catch (err) {
      console.error("Error fetching upcoming contests:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch contests")
    } finally {
      setLoading(false)
    }
  }

  return { contests, loading, error, refetch: fetchUpcomingContests }
}

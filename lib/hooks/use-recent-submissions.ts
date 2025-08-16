"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface RecentSubmission {
  id: number
  problem_title: string
  platform_name: string
  difficulty: string
  status: string
  language: string
  submission_date: string
  problem_url?: string
}

export function useRecentSubmissions(limit = 10) {
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentSubmissions()
  }, [limit])

  const fetchRecentSubmissions = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("User not authenticated")
        return
      }

      const { data, error: submissionsError } = await supabase
        .from("submissions")
        .select(`
          id,
          problem_title,
          difficulty,
          status,
          language,
          submission_date,
          problem_url,
          platforms!inner(name)
        `)
        .eq("user_id", user.id)
        .order("submission_date", { ascending: false })
        .limit(limit)

      if (submissionsError) throw submissionsError

      const formattedSubmissions =
        data?.map((submission) => ({
          ...submission,
          platform_name: submission.platforms.name,
        })) || []

      setSubmissions(formattedSubmissions)
    } catch (err) {
      console.error("Error fetching recent submissions:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }

  return { submissions, loading, error, refetch: fetchRecentSubmissions }
}

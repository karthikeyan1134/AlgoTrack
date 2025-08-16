"use client" // Added client directive to fix server-client component mismatch

import { createClient } from "@/lib/supabase/client" // Changed to client-side Supabase client
import { useRouter } from "next/navigation" // Changed to client-side navigation
import { useEffect, useState } from "react" // Added React hooks for client-side auth check
import type { User } from "@supabase/supabase-js"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardStats from "@/components/dashboard-stats"
import RecentSubmissions from "@/components/recent-submissions"
import UpcomingContests from "@/components/upcoming-contests"
import PlatformConnections from "@/components/platform-connections"
import SyncStatusCard from "@/components/sync-status-card"
import LiveDashboardWrapper from "@/components/live-dashboard-wrapper"
import DashboardActivityFeed from "@/components/dashboard-activity-feed"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Added error state
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true // Prevent state updates on unmounted component

    const checkUser = async () => {
      try {
        setError(null) // Reset error state
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(`Authentication error: ${userError.message}`)
        }

        if (!user && isMounted) {
          router.push("/auth/login")
          return
        }

        if (isMounted) {
          setUser(user)
          setLoading(false)
        }
      } catch (err) {
        console.error("Dashboard auth error:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Authentication failed")
          setLoading(false)
        }
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        if (session?.user) {
          setUser(session.user)
          setError(null)
        } else {
          setUser(null)
          router.push("/auth/login")
        }
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [router, supabase.auth])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Authentication Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <LiveDashboardWrapper>
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar user={user} />

        {/* Main content */}
        <div className="lg:pl-64">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Your Competitive Edge</h1>
              <p className="text-gray-600 mt-2">Track your growth across platforms and stay ahead of the curve</p>
            </div>

            {/* Stats */}
            <div className="mb-8">
              <DashboardStats />
            </div>

            {/* Sync Status Card */}
            <div className="mb-8">
              <SyncStatusCard />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-8">
                <RecentSubmissions />
                <PlatformConnections />
              </div>

              {/* Right column */}
              <div className="space-y-8">
                <UpcomingContests />
                {/* Dashboard Activity Feed */}
                <DashboardActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LiveDashboardWrapper>
  )
}

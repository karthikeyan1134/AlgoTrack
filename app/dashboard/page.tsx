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
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router, supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
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

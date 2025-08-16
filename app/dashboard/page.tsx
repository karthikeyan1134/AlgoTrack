import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardStats from "@/components/dashboard-stats"
import RecentSubmissions from "@/components/recent-submissions"
import UpcomingContests from "@/components/upcoming-contests"
import PlatformConnections from "@/components/platform-connections"
import SyncStatusCard from "@/components/sync-status-card"
import LiveDashboardWrapper from "@/components/live-dashboard-wrapper"
import DashboardActivityFeed from "@/components/dashboard-activity-feed"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
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

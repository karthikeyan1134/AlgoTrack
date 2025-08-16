import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import SubmissionTrendChart from "@/components/charts/submission-trend-chart"
import DifficultyDistributionChart from "@/components/charts/difficulty-distribution-chart"
import PlatformPerformanceChart from "@/components/charts/platform-performance-chart"
import RatingProgressChart from "@/components/charts/rating-progress-chart"
import CategoryHeatmap from "@/components/charts/category-heatmap"
import ProgressOverview from "@/components/progress-overview"
import GoalTracker from "@/components/goal-tracker"
import StreakTracker from "@/components/streak-tracker"
import ProblemProgressTable from "@/components/problem-progress-table"

export default async function ProgressPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />

      <div className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Progress Analytics</h1>
            <p className="text-gray-600 mt-2">Detailed insights into your competitive programming journey</p>
          </div>

          <div className="space-y-8">
            <ProgressOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GoalTracker />
              <StreakTracker />
            </div>

            {/* Submission trends */}
            <SubmissionTrendChart />

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DifficultyDistributionChart />
              <RatingProgressChart />
            </div>

            {/* Platform performance */}
            <PlatformPerformanceChart />

            {/* Category heatmap */}
            <CategoryHeatmap />

            <ProblemProgressTable />
          </div>
        </div>
      </div>
    </div>
  )
}

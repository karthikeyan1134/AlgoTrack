"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Calendar, Trophy } from "lucide-react"
import { useUserStats } from "@/lib/hooks/use-user-stats"

export default function StreakTracker() {
  const { stats, loading, error } = useUserStats()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5" />
            <span>Streak Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(21)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5" />
            <span>Streak Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Failed to load streak data</p>
        </CardContent>
      </Card>
    )
  }

  // Generate calendar grid for the last 3 weeks
  const generateCalendarGrid = () => {
    const grid = []
    const today = new Date()

    for (let i = 20; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Mock activity data - in real implementation, this would come from submissions
      const hasActivity = Math.random() > 0.3 // 70% chance of activity
      const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0

      grid.push({
        date: date.toISOString().split("T")[0],
        intensity,
        hasActivity,
      })
    }

    return grid
  }

  const calendarGrid = generateCalendarGrid()

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-gray-100"
      case 1:
        return "bg-green-200"
      case 2:
        return "bg-green-300"
      case 3:
        return "bg-green-400"
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Flame className="h-5 w-5" />
          <span>Streak Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Streak Display */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-2">
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
            <p className="text-sm text-gray-600">Current Streak (days)</p>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="font-semibold text-gray-900">{stats.currentStreak}</span>
              </div>
              <p className="text-xs text-gray-600">Best Streak</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                <span className="font-semibold text-gray-900">15</span>
              </div>
              <p className="text-xs text-gray-600">Active Days</p>
            </div>
          </div>

          {/* Activity Calendar */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Last 3 Weeks</h4>
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((day, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded ${getIntensityColor(day.intensity)} border border-gray-200`}
                  title={`${day.date}: ${day.hasActivity ? `${day.intensity} problems` : "No activity"}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-3 h-3 rounded ${getIntensityColor(intensity)} border border-gray-200`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Streak Status */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">{stats.currentStreak > 0 ? "Active" : "Inactive"}</Badge>
              <span className="text-sm text-blue-800">
                {stats.currentStreak > 0
                  ? "Keep it up! Solve a problem today to maintain your streak."
                  : "Start solving problems to begin a new streak!"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

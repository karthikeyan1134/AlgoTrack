"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Calendar, Award } from "lucide-react"
import { useUserStats } from "@/lib/hooks/use-user-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProgressOverview() {
  const { stats, loading, error } = useUserStats()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-2 w-full mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Failed to load progress overview</p>
        </CardContent>
      </Card>
    )
  }

  const totalSolved = stats.easySolved + stats.mediumSolved + stats.hardSolved
  const easyProgress = totalSolved > 0 ? (stats.easySolved / totalSolved) * 100 : 0
  const mediumProgress = totalSolved > 0 ? (stats.mediumSolved / totalSolved) * 100 : 0
  const hardProgress = totalSolved > 0 ? (stats.hardSolved / totalSolved) * 100 : 0

  const progressCards = [
    {
      title: "Total Problems Solved",
      value: totalSolved.toString(),
      progress: Math.min((totalSolved / 500) * 100, 100), // Goal of 500 problems
      target: "500",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      progress: Math.min((stats.currentStreak / 30) * 100, 100), // Goal of 30 days
      target: "30 days",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Contest Rating",
      value: stats.contestRating > 0 ? stats.contestRating.toString() : "Unrated",
      progress: stats.contestRating > 0 ? Math.min((stats.contestRating / 2000) * 100, 100) : 0,
      target: "2000",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Weekly Goal",
      value: "5/10", // This would come from a goals system
      progress: 50,
      target: "10 problems",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{card.value}</div>
              <Progress value={card.progress} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{Math.round(card.progress)}% complete</span>
                <span>Goal: {card.target}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Difficulty Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Easy</span>
                <Badge className="bg-green-100 text-green-800">{stats.easySolved}</Badge>
              </div>
              <Progress value={easyProgress} className="h-2" />
              <p className="text-xs text-gray-500">{Math.round(easyProgress)}% of total solved</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Medium</span>
                <Badge className="bg-yellow-100 text-yellow-800">{stats.mediumSolved}</Badge>
              </div>
              <Progress value={mediumProgress} className="h-2" />
              <p className="text-xs text-gray-500">{Math.round(mediumProgress)}% of total solved</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Hard</span>
                <Badge className="bg-red-100 text-red-800">{stats.hardSolved}</Badge>
              </div>
              <Progress value={hardProgress} className="h-2" />
              <p className="text-xs text-gray-500">{Math.round(hardProgress)}% of total solved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Trophy, Calendar, Code2 } from "lucide-react"
import { useUserStats } from "@/lib/hooks/use-user-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardStats() {
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
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Failed to load statistics</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dynamicStats = [
    {
      title: "Total Submissions",
      value: stats.totalSubmissions.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Code2,
      description: "This month",
    },
    {
      title: "Contest Rating",
      value: stats.contestRating > 0 ? stats.contestRating.toLocaleString() : "Unrated",
      change: stats.contestRating > 0 ? `+${Math.floor(stats.contestRating * 0.1)}` : "Start competing",
      changeType: "positive" as const,
      icon: Trophy,
      description: "Current rating",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      change: stats.currentStreak > 0 ? "Active" : "Start solving",
      changeType: stats.currentStreak > 0 ? ("positive" as const) : ("neutral" as const),
      icon: TrendingUp,
      description: stats.currentStreak > 0 ? "Keep it up!" : "Build momentum",
    },
    {
      title: "Upcoming Contests",
      value: stats.upcomingContests.toString(),
      change: "This week",
      changeType: "neutral" as const,
      icon: Calendar,
      description: "Don't miss out",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dynamicStats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant={
                  stat.changeType === "positive"
                    ? "default"
                    : stat.changeType === "negative"
                      ? "destructive"
                      : "secondary"
                }
                className="text-xs"
              >
                {stat.change}
              </Badge>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Trophy, Calendar, Code2 } from "lucide-react"

const stats = [
  {
    title: "Total Submissions",
    value: "247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Code2,
    description: "This month",
  },
  {
    title: "Contest Rating",
    value: "1,847",
    change: "+156",
    changeType: "positive" as const,
    icon: Trophy,
    description: "Codeforces",
  },
  {
    title: "Current Streak",
    value: "7 days",
    change: "Active",
    changeType: "neutral" as const,
    icon: TrendingUp,
    description: "Keep it up!",
  },
  {
    title: "Upcoming Contests",
    value: "3",
    change: "This week",
    changeType: "neutral" as const,
    icon: Calendar,
    description: "Don't miss out",
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
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

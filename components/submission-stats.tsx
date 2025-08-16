import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Code } from "lucide-react"

interface SubmissionStatsProps {
  stats: {
    total: number
    accepted: number
    wrongAnswer: number
    timeLimit: number
    averageTime: number
    favoriteLanguage: string
    streak: number
  }
}

export default function SubmissionStats({ stats }: SubmissionStatsProps) {
  const acceptanceRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{acceptanceRate}%</div>
          <p className="text-xs text-muted-foreground">{stats.accepted} accepted</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Time</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.averageTime}ms</div>
          <p className="text-xs text-muted-foreground">Execution time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            {stats.streak} days
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.favoriteLanguage}</div>
          <p className="text-xs text-muted-foreground">Favorite language</p>
        </CardContent>
      </Card>
    </div>
  )
}

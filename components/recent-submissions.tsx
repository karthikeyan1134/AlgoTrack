import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"
import { useRecentSubmissions } from "@/lib/hooks/use-recent-submissions"
import { Skeleton } from "@/components/ui/skeleton"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-800"
    case "Wrong Answer":
      return "bg-red-100 text-red-800"
    case "Time Limit Exceeded":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Hard":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function RecentSubmissions() {
  const { submissions, loading, error } = useRecentSubmissions(4)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than an hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Submissions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error || submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {error ? "Failed to load submissions" : "No submissions yet. Start solving problems!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{submission.problem_title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {submission.platform_name}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Badge className={`text-xs ${getDifficultyColor(submission.difficulty)}`}>
                      {submission.difficulty}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(submission.status)}`}>{submission.status}</Badge>
                    <span>{submission.language}</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(submission.submission_date)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={submission.problem_url || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

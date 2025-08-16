import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"
import { useUpcomingContests } from "@/lib/hooks/use-upcoming-contests"
import { Skeleton } from "@/components/ui/skeleton"

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "Codeforces":
      return "bg-blue-100 text-blue-800"
    case "AtCoder":
      return "bg-gray-100 text-gray-800"
    case "LeetCode":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UpcomingContests() {
  const { contests, loading, error } = useUpcomingContests(3)

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Upcoming Contests</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-64 mb-2" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error || contests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{error ? "Failed to load contests" : "No upcoming contests found"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{contest.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getPlatformColor(contest.platform_name)}`}>
                        {contest.platform_name}
                      </Badge>
                      {contest.is_rated && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Rated
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Set Reminder
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDateTime(contest.start_time)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDuration(contest.duration)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    TBD participants
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"

const contests = [
  {
    id: 1,
    title: "Codeforces Round #913 (Div. 2)",
    platform: "Codeforces",
    startTime: "Dec 15, 2024 at 2:35 PM",
    duration: "2h 15m",
    participants: "12,000+",
    isRated: true,
  },
  {
    id: 2,
    title: "AtCoder Beginner Contest 330",
    platform: "AtCoder",
    startTime: "Dec 16, 2024 at 8:00 AM",
    duration: "1h 40m",
    participants: "8,500+",
    isRated: true,
  },
  {
    id: 3,
    title: "LeetCode Weekly Contest 375",
    platform: "LeetCode",
    startTime: "Dec 17, 2024 at 10:30 AM",
    duration: "1h 30m",
    participants: "15,000+",
    isRated: false,
  },
]

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Upcoming Contests</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contests.map((contest) => (
            <div key={contest.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{contest.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getPlatformColor(contest.platform)}`}>{contest.platform}</Badge>
                    {contest.isRated && (
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
                  {contest.startTime}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {contest.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {contest.participants}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

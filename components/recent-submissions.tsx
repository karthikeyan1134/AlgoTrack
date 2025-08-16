import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"

const submissions = [
  {
    id: 1,
    title: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    status: "Accepted",
    language: "Python",
    time: "2 hours ago",
    url: "#",
  },
  {
    id: 2,
    title: "Binary Tree Inorder Traversal",
    platform: "LeetCode",
    difficulty: "Easy",
    status: "Accepted",
    language: "JavaScript",
    time: "5 hours ago",
    url: "#",
  },
  {
    id: 3,
    title: "Codeforces Round #912 (Div. 2) - A",
    platform: "Codeforces",
    difficulty: "Medium",
    status: "Wrong Answer",
    language: "C++",
    time: "1 day ago",
    url: "#",
  },
  {
    id: 4,
    title: "AtCoder Beginner Contest 329 - B",
    platform: "AtCoder",
    difficulty: "Easy",
    status: "Accepted",
    language: "Python",
    time: "2 days ago",
    url: "#",
  },
]

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Submissions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{submission.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {submission.platform}
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
                    {submission.time}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

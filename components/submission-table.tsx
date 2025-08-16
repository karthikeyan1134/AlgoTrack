"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Clock, MemoryStickIcon as Memory, Code, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Submission {
  id: number
  problem_title: string
  problem_url?: string
  platform_name: string
  difficulty?: string
  category?: string
  status: string
  language?: string
  submission_date: string
  execution_time?: number
  memory_used?: number
}

interface SubmissionTableProps {
  submissions: Submission[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-800"
    case "Wrong Answer":
      return "bg-red-100 text-red-800"
    case "Time Limit Exceeded":
      return "bg-yellow-100 text-yellow-800"
    case "Runtime Error":
      return "bg-orange-100 text-orange-800"
    case "Compilation Error":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getDifficultyColor = (difficulty: string) => {
  if (!difficulty) return "bg-gray-100 text-gray-800"

  if (
    difficulty.toLowerCase().includes("easy") ||
    (Number.parseInt(difficulty) && Number.parseInt(difficulty) < 1200)
  ) {
    return "bg-green-100 text-green-800"
  }
  if (
    difficulty.toLowerCase().includes("hard") ||
    (Number.parseInt(difficulty) && Number.parseInt(difficulty) > 1800)
  ) {
    return "bg-red-100 text-red-800"
  }
  return "bg-yellow-100 text-yellow-800"
}

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "Codeforces":
      return "bg-blue-100 text-blue-800"
    case "AtCoder":
      return "bg-gray-100 text-gray-800"
    case "LeetCode":
      return "bg-orange-100 text-orange-800"
    case "CodeChef":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SubmissionTable({
  submissions,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: SubmissionTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No submissions found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or sync your platforms</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 truncate max-w-xs">{submission.problem_title}</div>
                      {submission.category && (
                        <div className="text-sm text-gray-500 truncate">{submission.category}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getPlatformColor(submission.platform_name)}`}>
                      {submission.platform_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(submission.status)}`}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {submission.difficulty && (
                      <Badge className={`text-xs ${getDifficultyColor(submission.difficulty)}`}>
                        {submission.difficulty}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{submission.language || "N/A"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-xs text-gray-500">
                      {submission.execution_time && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {submission.execution_time}ms
                        </div>
                      )}
                      {submission.memory_used && (
                        <div className="flex items-center">
                          <Memory className="h-3 w-3 mr-1" />
                          {Math.round(submission.memory_used / 1024)}KB
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(submission.submission_date), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {submission.problem_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={submission.problem_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

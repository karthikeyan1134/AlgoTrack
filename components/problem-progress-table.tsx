"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface ProblemProgress {
  id: number
  problem_title: string
  platform_name: string
  difficulty: string
  category: string
  status: string
  attempts: number
  solved_date: string | null
  problem_url: string | null
}

export default function ProblemProgressTable() {
  const [problems, setProblems] = useState<ProblemProgress[]>([])
  const [filteredProblems, setFilteredProblems] = useState<ProblemProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  useEffect(() => {
    fetchProblemProgress()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [problems, searchTerm, statusFilter, difficultyFilter])

  const fetchProblemProgress = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Mock data for now - in real implementation, fetch from user_problem_progress table
      const mockProblems: ProblemProgress[] = [
        {
          id: 1,
          problem_title: "Two Sum",
          platform_name: "LeetCode",
          difficulty: "Easy",
          category: "Array",
          status: "solved",
          attempts: 2,
          solved_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          problem_url: "https://leetcode.com/problems/two-sum/",
        },
        {
          id: 2,
          problem_title: "Binary Tree Inorder Traversal",
          platform_name: "LeetCode",
          difficulty: "Easy",
          category: "Tree",
          status: "solved",
          attempts: 1,
          solved_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          problem_url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        },
        {
          id: 3,
          problem_title: "Longest Palindromic Substring",
          platform_name: "LeetCode",
          difficulty: "Medium",
          category: "String",
          status: "attempted",
          attempts: 3,
          solved_date: null,
          problem_url: "https://leetcode.com/problems/longest-palindromic-substring/",
        },
        {
          id: 4,
          problem_title: "Codeforces Round #912 (Div. 2) - A",
          platform_name: "Codeforces",
          difficulty: "Medium",
          category: "Math",
          status: "attempted",
          attempts: 2,
          solved_date: null,
          problem_url: "https://codeforces.com/contest/1912/problem/A",
        },
      ]

      setProblems(mockProblems)
    } catch (error) {
      console.error("Error fetching problem progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...problems]

    if (searchTerm) {
      filtered = filtered.filter(
        (problem) =>
          problem.problem_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          problem.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((problem) => problem.status === statusFilter)
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((problem) => problem.difficulty === difficultyFilter)
    }

    setFilteredProblems(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-100 text-green-800"
      case "attempted":
        return "bg-yellow-100 text-yellow-800"
      case "not_attempted":
        return "bg-gray-100 text-gray-800"
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not solved"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Problem Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Problem Progress</span>
          <Badge variant="secondary">{filteredProblems.length} problems</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="attempted">Attempted</SelectItem>
              <SelectItem value="not_attempted">Not Attempted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulty</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Problem</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Difficulty</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Attempts</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Solved Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{problem.problem_title}</div>
                      <div className="text-sm text-gray-500">{problem.category}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{problem.platform_name}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
                      {problem.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{problem.attempts}</td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(problem.solved_date)}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={problem.problem_url || "#"} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProblems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No problems found matching your filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

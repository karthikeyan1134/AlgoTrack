"use client"

import { useEffect, useState } from "react"
import SubmissionFilters from "@/components/submission-filters"
import SubmissionTable from "@/components/submission-table"
import SubmissionStats from "@/components/submission-stats"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

interface FilterState {
  search: string
  platform: string
  difficulty: string
  status: string
  language: string
  category: string
  dateRange: string
}

const initialFilters: FilterState = {
  search: "",
  platform: "All",
  difficulty: "All",
  status: "All",
  language: "All",
  category: "All",
  dateRange: "All Time",
}

export default function SubmissionsPageClient() {
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    wrongAnswer: 0,
    timeLimit: 0,
    averageTime: 0,
    favoriteLanguage: "Python",
    streak: 7,
  })

  const itemsPerPage = 20

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [submissions, filters])

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/submissions")
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.submissions)
        calculateStats(data.submissions)
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (submissionData: any[]) => {
    const total = submissionData.length
    const accepted = submissionData.filter((s) => s.status === "Accepted").length
    const wrongAnswer = submissionData.filter((s) => s.status === "Wrong Answer").length
    const timeLimit = submissionData.filter((s) => s.status === "Time Limit Exceeded").length

    const executionTimes = submissionData.filter((s) => s.execution_time).map((s) => s.execution_time)
    const averageTime =
      executionTimes.length > 0 ? Math.round(executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length) : 0

    const languageCounts = submissionData.reduce((acc, s) => {
      if (s.language) {
        acc[s.language] = (acc[s.language] || 0) + 1
      }
      return acc
    }, {})

    const favoriteLanguage = Object.keys(languageCounts).reduce(
      (a, b) => (languageCounts[a] > languageCounts[b] ? a : b),
      "Python",
    )

    setStats({
      total,
      accepted,
      wrongAnswer,
      timeLimit,
      averageTime,
      favoriteLanguage,
      streak: 7,
    })
  }

  const applyFilters = () => {
    let filtered = [...submissions]

    if (filters.search) {
      filtered = filtered.filter((submission: any) =>
        submission.problem_title.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.platform !== "All") {
      filtered = filtered.filter((submission: any) => submission.platform_name === filters.platform)
    }

    if (filters.status !== "All") {
      filtered = filtered.filter((submission: any) => submission.status === filters.status)
    }

    if (filters.difficulty !== "All") {
      filtered = filtered.filter((submission: any) => {
        if (!submission.difficulty) return false
        const difficulty = submission.difficulty.toLowerCase()
        return difficulty.includes(filters.difficulty.toLowerCase())
      })
    }

    if (filters.language !== "All") {
      filtered = filtered.filter((submission: any) => submission.language === filters.language)
    }

    if (filters.category !== "All") {
      filtered = filtered.filter(
        (submission: any) => submission.category && submission.category.includes(filters.category),
      )
    }

    if (filters.dateRange !== "All Time") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (filters.dateRange) {
        case "Last 7 days":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "Last 30 days":
          cutoffDate.setDate(now.getDate() - 30)
          break
        case "Last 3 months":
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case "Last year":
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((submission: any) => new Date(submission.submission_date) >= cutoffDate)
    }

    setFilteredSubmissions(filtered)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Problem,Platform,Status,Difficulty,Language,Date\n" +
      filteredSubmissions
        .map(
          (s: any) =>
            `"${s.problem_title}","${s.platform_name}","${s.status}","${s.difficulty || ""}","${s.language || ""}","${s.submission_date}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "submissions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="lg:pl-64">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Question Tracker</h1>
            <p className="text-gray-600 mt-2">Track and analyze your coding submissions</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={fetchSubmissions} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <SubmissionStats stats={stats} />
          <SubmissionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
          <SubmissionTable
            submissions={paginatedSubmissions}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

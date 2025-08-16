"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Calendar, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Goal {
  id: number
  title: string
  description: string
  target_value: number
  current_value: number
  deadline: string
  goal_type: string
  is_completed: boolean
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // For now, using mock goals since we haven't created the goals table
      // In a real implementation, you'd fetch from a goals table
      const mockGoals: Goal[] = [
        {
          id: 1,
          title: "Weekly Problem Goal",
          description: "Solve 10 problems this week",
          target_value: 10,
          current_value: 7,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          goal_type: "weekly",
          is_completed: false,
        },
        {
          id: 2,
          title: "Contest Rating Goal",
          description: "Reach 1800 rating",
          target_value: 1800,
          current_value: 1650,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          goal_type: "rating",
          is_completed: false,
        },
        {
          id: 3,
          title: "Hard Problems Challenge",
          description: "Solve 5 hard problems",
          target_value: 5,
          current_value: 2,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          goal_type: "difficulty",
          is_completed: false,
        },
      ]

      setGoals(mockGoals)
    } catch (error) {
      console.error("Error fetching goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "weekly":
        return <Calendar className="h-4 w-4" />
      case "rating":
        return <TrendingUp className="h-4 w-4" />
      case "difficulty":
        return <Target className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getGoalColor = (type: string) => {
    switch (type) {
      case "weekly":
        return "text-blue-600"
      case "rating":
        return "text-purple-600"
      case "difficulty":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Tomorrow"
    if (diffInDays > 0) return `${diffInDays} days left`
    return "Overdue"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Goals</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current_value / goal.target_value) * 100
            const isCompleted = goal.current_value >= goal.target_value

            return (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={getGoalColor(goal.goal_type)}>{getGoalIcon(goal.goal_type)}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  {isCompleted && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {goal.current_value} / {goal.target_value}
                    </span>
                    <span className="text-gray-500">{formatDeadline(goal.deadline)}</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
                </div>
              </div>
            )
          })}

          {goals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No goals set yet</p>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

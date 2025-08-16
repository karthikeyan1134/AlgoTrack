"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Code, Calendar, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface ActivityItem {
  id: number
  activity_type: string
  title: string
  description: string
  created_at: string
  metadata: any
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "problem_solved":
      return <Code className="h-4 w-4 text-green-600" />
    case "contest_participated":
      return <Trophy className="h-4 w-4 text-blue-600" />
    case "streak_updated":
      return <TrendingUp className="h-4 w-4 text-orange-600" />
    default:
      return <Calendar className="h-4 w-4 text-gray-600" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "problem_solved":
      return "bg-green-100 text-green-800"
    case "contest_participated":
      return "bg-blue-100 text-blue-800"
    case "streak_updated":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export default function DashboardActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
    setupRealtimeSubscription()
  }, [])

  const fetchActivities = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("activity_feed")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (!error && data) {
        setActivities(data)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      const subscription = supabase
        .channel("activity_feed_changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "activity_feed",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("[v0] New activity:", payload)
            setActivities((prev) => [payload.new as ActivityItem, ...prev.slice(0, 9)])
          },
        )
        .subscribe()

      return () => subscription.unsubscribe()
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity. Start solving problems to see your progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.activity_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{activity.title}</h4>
                    <Badge className={`text-xs ${getActivityColor(activity.activity_type)}`}>
                      {activity.activity_type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <p className="text-xs text-gray-400">{formatTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

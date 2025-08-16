"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Check, Calendar, Trophy, Zap, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Notification {
  id: string
  type: "contest_reminder" | "sync_complete" | "goal_achieved" | "streak_reminder" | "submission_update"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  metadata?: any
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    setupRealtimeSubscription()
  }, [])

  const fetchNotifications = async () => {
    try {
      // Mock notifications for now - in real implementation, fetch from notifications table
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "contest_reminder",
          title: "Contest Starting Soon",
          message: "Codeforces Round #913 starts in 30 minutes",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "https://codeforces.com/contest/1913",
        },
        {
          id: "2",
          type: "sync_complete",
          title: "Platform Sync Complete",
          message: "Successfully synced 15 new submissions from LeetCode",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "3",
          type: "goal_achieved",
          title: "Goal Achieved!",
          message: "Congratulations! You've completed your weekly problem goal",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "4",
          type: "streak_reminder",
          title: "Maintain Your Streak",
          message: "Don't forget to solve a problem today to keep your 7-day streak!",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const supabase = createClient()

    // In real implementation, subscribe to notifications table changes
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      // Mock real-time notification
      const interval = setInterval(() => {
        if (Math.random() > 0.95) {
          // 5% chance every 10 seconds
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: "submission_update",
            title: "New Submission",
            message: "Your solution to 'Two Sum' was accepted!",
            timestamp: new Date().toISOString(),
            read: false,
          }

          setNotifications((prev) => [newNotification, ...prev])
          console.log("[v0] New notification received:", newNotification)
        }
      }, 10000)

      return () => clearInterval(interval)
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "contest_reminder":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "sync_complete":
        return <Zap className="h-4 w-4 text-green-600" />
      case "goal_achieved":
        return <Trophy className="h-4 w-4 text-yellow-600" />
      case "streak_reminder":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      case "submission_update":
        return <Check className="h-4 w-4 text-green-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{formatTimeAgo(notification.timestamp)}</span>
                            <div className="flex items-center space-x-2">
                              {notification.actionUrl && (
                                <Button variant="outline" size="sm" className="text-xs h-6 bg-transparent" asChild>
                                  <a href={notification.actionUrl} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                              )}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs h-6"
                                >
                                  Mark read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

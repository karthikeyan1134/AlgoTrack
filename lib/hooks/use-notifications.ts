"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    requestNotificationPermission()
    fetchNotifications()
    setupRealtimeSubscription()
  }, [])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setPermissionGranted(permission === "granted")
      console.log("[v0] Notification permission:", permission)
    }
  }

  const fetchNotifications = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // In real implementation, fetch from notifications table
      // For now, using mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "contest_reminder",
          title: "Contest Starting Soon",
          message: "Codeforces Round #913 starts in 30 minutes",
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: "https://codeforces.com/contest/1913",
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

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      // Mock real-time notifications
      const interval = setInterval(() => {
        if (Math.random() > 0.98) {
          // 2% chance every 5 seconds
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: "submission_update",
            title: "New Submission Result",
            message: "Your solution was accepted!",
            timestamp: new Date().toISOString(),
            read: false,
          }

          addNotification(newNotification)
        }
      }, 5000)

      return () => clearInterval(interval)
    })
  }

  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 49)]) // Keep max 50 notifications

      // Show browser notification if permission granted
      if (permissionGranted && "Notification" in window) {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          tag: notification.id,
        })
      }

      console.log("[v0] New notification added:", notification)
    },
    [permissionGranted],
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Utility functions for creating specific notification types
  const createContestReminder = useCallback(
    (contestTitle: string, startTime: Date, contestUrl?: string) => {
      const minutesUntil = Math.floor((startTime.getTime() - Date.now()) / (1000 * 60))
      const notification: Notification = {
        id: `contest_${Date.now()}`,
        type: "contest_reminder",
        title: "Contest Starting Soon",
        message: `${contestTitle} starts in ${minutesUntil} minutes`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: contestUrl,
      }
      addNotification(notification)
    },
    [addNotification],
  )

  const createSyncNotification = useCallback(
    (platform: string, submissionsCount: number) => {
      const notification: Notification = {
        id: `sync_${Date.now()}`,
        type: "sync_complete",
        title: "Platform Sync Complete",
        message: `Successfully synced ${submissionsCount} submissions from ${platform}`,
        timestamp: new Date().toISOString(),
        read: false,
      }
      addNotification(notification)
    },
    [addNotification],
  )

  const createGoalAchievement = useCallback(
    (goalTitle: string) => {
      const notification: Notification = {
        id: `goal_${Date.now()}`,
        type: "goal_achieved",
        title: "Goal Achieved!",
        message: `Congratulations! You've completed: ${goalTitle}`,
        timestamp: new Date().toISOString(),
        read: false,
      }
      addNotification(notification)
    },
    [addNotification],
  )

  const createStreakReminder = useCallback(
    (currentStreak: number) => {
      const notification: Notification = {
        id: `streak_${Date.now()}`,
        type: "streak_reminder",
        title: "Maintain Your Streak",
        message: `Don't forget to solve a problem today to keep your ${currentStreak}-day streak!`,
        timestamp: new Date().toISOString(),
        read: false,
      }
      addNotification(notification)
    },
    [addNotification],
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    loading,
    unreadCount,
    permissionGranted,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    createContestReminder,
    createSyncNotification,
    createGoalAchievement,
    createStreakReminder,
    refetch: fetchNotifications,
  }
}

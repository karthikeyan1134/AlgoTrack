"use client"

import { useEffect, useState } from "react"
import ReminderCard from "@/components/reminder-card"
import ReminderSettings from "@/components/reminder-settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Settings } from "lucide-react"

interface Contest {
  id: number
  title: string
  platform_name: string
  start_time: string
  duration: number
  is_rated: boolean
  contest_url?: string
}

interface Reminder {
  id: number
  contest_id: number
  reminder_time: string
  is_sent: boolean
}

export default function RemindersPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    defaultReminderTime: "30",
    platforms: ["LeetCode", "Codeforces", "AtCoder"],
  })

  useEffect(() => {
    fetchContests()
    fetchReminders()
  }, [])

  const fetchContests = async () => {
    try {
      const response = await fetch("/api/platforms/contests")
      const data = await response.json()
      if (data.success) {
        setContests(data.contests)
      }
    } catch (error) {
      console.error("Error fetching contests:", error)
    }
  }

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders")
      const data = await response.json()
      if (data.success) {
        setReminders(data.reminders)
      }
    } catch (error) {
      console.error("Error fetching reminders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetReminder = async (contestId: number, reminderMinutes: number) => {
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId, reminderMinutes }),
      })

      if (response.ok) {
        fetchReminders()
      }
    } catch (error) {
      console.error("Error setting reminder:", error)
    }
  }

  const handleDeleteReminder = async (reminderId: number) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchReminders()
      }
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      const response = await fetch("/api/reminders/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        setSettings(newSettings)
      }
    } catch (error) {
      console.error("Error updating settings:", error)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchContests()
    fetchReminders()
  }

  const upcomingContests = contests.filter((contest) => new Date(contest.start_time) > new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contest Reminders</h1>
              <p className="text-gray-600 mt-2">Never miss a contest with personalized reminders</p>
            </div>
            <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="contests" className="space-y-6">
            <TabsList>
              <TabsTrigger value="contests">Upcoming Contests</TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contests" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Loading contests...</p>
                </div>
              ) : upcomingContests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingContests.map((contest) => {
                    const reminder = reminders.find((r) => r.contest_id === contest.id)
                    return (
                      <ReminderCard
                        key={contest.id}
                        contest={contest}
                        reminder={reminder}
                        onSetReminder={handleSetReminder}
                        onDeleteReminder={handleDeleteReminder}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No upcoming contests found</p>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Contests
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <div className="max-w-2xl">
                <ReminderSettings settings={settings} onUpdateSettings={handleUpdateSettings} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

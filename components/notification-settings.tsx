"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, Trophy, Zap, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

interface NotificationSettings {
  contestReminders: boolean
  contestReminderTime: number // minutes before contest
  syncUpdates: boolean
  goalAchievements: boolean
  streakReminders: boolean
  submissionUpdates: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    contestReminders: true,
    contestReminderTime: 30,
    syncUpdates: true,
    goalAchievements: true,
    streakReminders: true,
    submissionUpdates: true,
    emailNotifications: false,
    pushNotifications: true,
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // In real implementation, load from user preferences table
    console.log("[v0] Loading notification settings")
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      // In real implementation, save to user preferences table
      console.log("[v0] Saving notification settings:", settings)

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof NotificationSettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const notificationTypes = [
    {
      key: "contestReminders" as keyof NotificationSettings,
      title: "Contest Reminders",
      description: "Get notified before contests start",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      key: "syncUpdates" as keyof NotificationSettings,
      title: "Sync Updates",
      description: "Notifications when platform data is synced",
      icon: Zap,
      color: "text-green-600",
    },
    {
      key: "goalAchievements" as keyof NotificationSettings,
      title: "Goal Achievements",
      description: "Celebrate when you reach your goals",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      key: "streakReminders" as keyof NotificationSettings,
      title: "Streak Reminders",
      description: "Daily reminders to maintain your streak",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      key: "submissionUpdates" as keyof NotificationSettings,
      title: "Submission Updates",
      description: "Updates on your problem submissions",
      icon: Bell,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Types */}
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{type.title}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[type.key] as boolean}
                  onCheckedChange={(checked) => updateSetting(type.key, checked)}
                />
              </div>
            ))}
          </div>

          {/* Contest Reminder Timing */}
          {settings.contestReminders && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Contest Reminder Timing</h4>
                  <p className="text-sm text-blue-700">How early should we remind you?</p>
                </div>
                <Select
                  value={settings.contestReminderTime.toString()}
                  onValueChange={(value) => updateSetting("contestReminderTime", Number.parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="1440">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Delivery Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Delivery Methods</h3>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications in your browser</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

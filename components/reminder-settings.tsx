"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bell, Mail, Smartphone } from "lucide-react"

interface ReminderSettingsProps {
  settings: {
    emailNotifications: boolean
    pushNotifications: boolean
    defaultReminderTime: string
    platforms: string[]
  }
  onUpdateSettings: (settings: any) => Promise<void>
}

const reminderTimeOptions = [
  { value: "5", label: "5 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
]

const platforms = ["LeetCode", "Codeforces", "AtCoder", "CodeChef", "HackerRank"]

export default function ReminderSettings({ settings, onUpdateSettings }: ReminderSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdateSettings(localSettings)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlatform = (platform: string) => {
    const updatedPlatforms = localSettings.platforms.includes(platform)
      ? localSettings.platforms.filter((p) => p !== platform)
      : [...localSettings.platforms, platform]

    setLocalSettings({
      ...localSettings,
      platforms: updatedPlatforms,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Reminder Settings
        </CardTitle>
        <CardDescription>Configure how and when you want to be notified about contests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Methods */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch
                id="email-notifications"
                checked={localSettings.emailNotifications}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <Switch
                id="push-notifications"
                checked={localSettings.pushNotifications}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, pushNotifications: checked })}
              />
            </div>
          </div>
        </div>

        {/* Default Reminder Time */}
        <div className="space-y-2">
          <Label htmlFor="default-reminder-time">Default Reminder Time</Label>
          <Select
            value={localSettings.defaultReminderTime}
            onValueChange={(value) => setLocalSettings({ ...localSettings, defaultReminderTime: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reminderTimeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <Label>Platforms to Monitor</Label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Switch
                  id={`platform-${platform}`}
                  checked={localSettings.platforms.includes(platform)}
                  onCheckedChange={() => togglePlatform(platform)}
                />
                <Label htmlFor={`platform-${platform}`} className="text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}

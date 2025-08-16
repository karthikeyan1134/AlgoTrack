"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, Clock, Users, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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
  id?: number
  contest_id: number
  reminder_time: string
  is_sent: boolean
}

interface ReminderCardProps {
  contest: Contest
  reminder?: Reminder
  onSetReminder: (contestId: number, reminderMinutes: number) => Promise<void>
  onDeleteReminder: (reminderId: number) => Promise<void>
}

const reminderOptions = [
  { value: "5", label: "5 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
]

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "Codeforces":
      return "bg-blue-100 text-blue-800"
    case "AtCoder":
      return "bg-gray-100 text-gray-800"
    case "LeetCode":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ReminderCard({ contest, reminder, onSetReminder, onDeleteReminder }: ReminderCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReminderTime, setSelectedReminderTime] = useState("30")

  const contestStartTime = new Date(contest.start_time)
  const timeUntilContest = formatDistanceToNow(contestStartTime, { addSuffix: true })

  const handleSetReminder = async () => {
    setIsLoading(true)
    try {
      await onSetReminder(contest.id, Number.parseInt(selectedReminderTime))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReminder = async () => {
    if (!reminder?.id) return
    setIsLoading(true)
    try {
      await onDeleteReminder(reminder.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">{contest.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <Badge className={`text-xs ${getPlatformColor(contest.platform_name)}`}>{contest.platform_name}</Badge>
              {contest.is_rated && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                  Rated
                </Badge>
              )}
              {reminder && (
                <Badge variant="secondary" className="text-xs">
                  <Bell className="h-3 w-3 mr-1" />
                  Reminder Set
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {contestStartTime.toLocaleDateString()} at {contestStartTime.toLocaleTimeString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {Math.floor(contest.duration / 60)}h {contest.duration % 60}m
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {timeUntilContest}
            </div>
          </div>

          {reminder ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Reminder set for {new Date(reminder.reminder_time).toLocaleString()}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDeleteReminder} disabled={isLoading}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Select value={selectedReminderTime} onValueChange={setSelectedReminderTime}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reminderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSetReminder} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                <Bell className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            </div>
          )}

          {contest.contest_url && (
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <a href={contest.contest_url} target="_blank" rel="noopener noreferrer">
                View Contest
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

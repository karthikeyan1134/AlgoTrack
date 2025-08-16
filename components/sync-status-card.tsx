"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"
import { usePlatformSync } from "@/lib/hooks/use-platform-sync"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "syncing":
      return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "syncing":
      return "bg-blue-100 text-blue-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatLastSync = (dateString: string | null) => {
  if (!dateString) return "Never"

  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export default function SyncStatusCard() {
  const { syncStatuses, connections, loading, syncing, syncAllPlatforms, syncPlatform } = usePlatformSync()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Platform Sync Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeSyncs = syncStatuses.filter((status) => status.sync_status === "syncing").length
  const completedSyncs = syncStatuses.filter((status) => status.sync_status === "completed").length
  const failedSyncs = syncStatuses.filter((status) => status.sync_status === "failed").length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Platform Sync Status</span>
        </CardTitle>
        <Button
          onClick={syncAllPlatforms}
          disabled={syncing || connections.length === 0}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          Sync All
        </Button>
      </CardHeader>
      <CardContent>
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No platform connections found</p>
            <Button variant="outline" size="sm">
              Connect Platforms
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Progress */}
            {syncing && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Syncing platforms...</span>
                  <span className="text-sm text-blue-700">{activeSyncs} active</span>
                </div>
                <Progress value={(completedSyncs / connections.length) * 100} className="h-2" />
              </div>
            )}

            {/* Platform Status List */}
            <div className="space-y-3">
              {connections.map((connection) => {
                const status = syncStatuses.find((s) => s.platform_name === connection.platform_name)
                const currentStatus = status?.sync_status || "pending"

                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(currentStatus)}
                        <div>
                          <h4 className="font-medium text-gray-900">{connection.platform_name}</h4>
                          <p className="text-sm text-gray-500">@{connection.platform_username}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <Badge className={`text-xs ${getStatusColor(currentStatus)}`}>
                          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{status?.submissions_synced || 0} submissions</p>
                        <p className="text-xs text-gray-400">{formatLastSync(status?.last_sync_time)}</p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncPlatform(connection.platform_name, connection.platform_username)}
                        disabled={syncing || currentStatus === "syncing"}
                      >
                        <RefreshCw className={`h-3 w-3 ${currentStatus === "syncing" ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedSyncs}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeSyncs}</div>
                <div className="text-xs text-gray-500">Syncing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedSyncs}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

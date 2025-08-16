"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { usePlatformSync } from "@/lib/hooks/use-platform-sync"
import { Skeleton } from "@/components/ui/skeleton"

export default function PlatformConnections() {
  const { connections, syncStatuses, loading, syncing, syncPlatform, getSyncStatus } = usePlatformSync()

  const allPlatforms = [
    { name: "LeetCode", color: "bg-orange-500" },
    { name: "Codeforces", color: "bg-blue-500" },
    { name: "AtCoder", color: "bg-gray-500" },
    { name: "GeeksforGeeks", color: "bg-green-600" },
  ]

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Platform Connections</CardTitle>
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Platform Connections</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allPlatforms.map((platform) => {
            const connection = connections.find((c) => c.platform_name === platform.name)
            const syncStatus = getSyncStatus(platform.name)
            const isConnected = !!connection
            const isSyncing = syncStatus?.sync_status === "syncing"

            return (
              <div
                key={platform.name}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">{platform.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    {isConnected ? (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>@{connection.platform_username}</span>
                        {syncStatus && (
                          <>
                            <span>•</span>
                            <span>{syncStatus.submissions_synced} submissions</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Not connected</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          connection && syncPlatform(connection.platform_name, connection.platform_username)
                        }
                        disabled={syncing || isSyncing}
                      >
                        <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </Badge>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Connect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

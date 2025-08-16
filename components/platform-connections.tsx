import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, AlertCircle } from "lucide-react"

const platforms = [
  {
    name: "LeetCode",
    connected: true,
    username: "john_doe",
    lastSync: "2 hours ago",
    color: "bg-orange-500",
  },
  {
    name: "Codeforces",
    connected: true,
    username: "john_doe_cf",
    lastSync: "5 hours ago",
    color: "bg-blue-500",
  },
  {
    name: "AtCoder",
    connected: false,
    username: null,
    lastSync: null,
    color: "bg-gray-500",
  },
  {
    name: "CodeChef",
    connected: false,
    username: null,
    lastSync: null,
    color: "bg-amber-600",
  },
]

export default function PlatformConnections() {
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
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">{platform.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{platform.name}</h4>
                  {platform.connected ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>@{platform.username}</span>
                      <span>•</span>
                      <span>Synced {platform.lastSync}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {platform.connected ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm">
                      Sync
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

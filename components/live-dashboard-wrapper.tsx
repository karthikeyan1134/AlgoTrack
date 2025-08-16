"use client"

import type React from "react"

import { useAutoSync } from "@/lib/hooks/use-auto-sync"
import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface LiveDashboardWrapperProps {
  children: React.ReactNode
}

export default function LiveDashboardWrapper({ children }: LiveDashboardWrapperProps) {
  const [showSyncToast, setShowSyncToast] = useState(false)
  const [syncMessage, setSyncMessage] = useState("")
  const [syncType, setSyncType] = useState<"success" | "error" | "info">("info")

  const { isAutoSyncEnabled, triggerManualSync } = useAutoSync({
    enabled: true,
    intervalMinutes: 30,
    syncOnMount: true,
  })

  useEffect(() => {
    // Show initial sync notification
    if (isAutoSyncEnabled) {
      setSyncMessage("Auto-sync enabled - your data will update automatically")
      setSyncType("info")
      setShowSyncToast(true)

      const timer = setTimeout(() => setShowSyncToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isAutoSyncEnabled])

  const handleManualSync = async () => {
    setSyncMessage("Syncing platform data...")
    setSyncType("info")
    setShowSyncToast(true)

    try {
      const result = await triggerManualSync()

      if (result.success) {
        setSyncMessage("Platform data synced successfully!")
        setSyncType("success")
      } else {
        setSyncMessage(result.error || "Failed to sync platform data")
        setSyncType("error")
      }
    } catch (error) {
      setSyncMessage("An error occurred during sync")
      setSyncType("error")
    }

    setTimeout(() => setShowSyncToast(false), 3000)
  }

  return (
    <>
      {children}

      <button
        onClick={handleManualSync}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Manual sync"
      >
        <RefreshCw className="h-5 w-5" />
      </button>

      {showSyncToast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
              syncType === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : syncType === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {syncType === "success" && <CheckCircle className="h-4 w-4" />}
            {syncType === "error" && <AlertCircle className="h-4 w-4" />}
            {syncType === "info" && <RefreshCw className="h-4 w-4" />}
            <span className="text-sm font-medium">{syncMessage}</span>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface SyncStatus {
  platform_id: number
  platform_name: string
  sync_status: "pending" | "syncing" | "completed" | "failed"
  last_sync_time: string | null
  submissions_synced: number
  error_message: string | null
}

interface PlatformConnection {
  id: number
  platform_name: string
  platform_username: string
  is_active: boolean
  last_synced: string | null
}

export function usePlatformSync() {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([])
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSyncStatuses()
    fetchConnections()
    setupRealtimeSubscription()
  }, [])

  const fetchSyncStatuses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("sync_status")
        .select(`
          *,
          platforms!inner(name)
        `)
        .eq("user_id", user.id)

      if (!error && data) {
        const formattedStatuses = data.map((status) => ({
          ...status,
          platform_name: status.platforms.name,
        }))
        setSyncStatuses(formattedStatuses)
      }
    } catch (error) {
      console.error("Error fetching sync statuses:", error)
    }
  }

  const fetchConnections = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("user_platforms")
        .select(`
          id,
          platform_username,
          is_active,
          last_synced,
          platforms!inner(name)
        `)
        .eq("user_id", user.id)
        .eq("is_active", true)

      if (!error && data) {
        const formattedConnections = data.map((conn) => ({
          ...conn,
          platform_name: conn.platforms.name,
        }))
        setConnections(formattedConnections)
      }
    } catch (error) {
      console.error("Error fetching connections:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const {
      data: { user },
    } = supabase.auth.getUser()

    user.then(({ user }) => {
      if (!user) return

      const subscription = supabase
        .channel("sync_status_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "sync_status",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("[v0] Sync status updated:", payload)
            fetchSyncStatuses()
          },
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    })
  }

  const syncPlatform = useCallback(async (platform: string, username: string) => {
    try {
      setSyncing(true)

      const response = await fetch("/api/sync/platform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform, username }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchSyncStatuses()
        await fetchConnections()
      }

      return result
    } catch (error) {
      console.error("Error syncing platform:", error)
      return { success: false, error: "Failed to sync platform" }
    } finally {
      setSyncing(false)
    }
  }, [])

  const syncAllPlatforms = useCallback(async () => {
    try {
      setSyncing(true)

      const syncPromises = connections.map((conn) => syncPlatform(conn.platform_name, conn.platform_username))

      const results = await Promise.all(syncPromises)
      const successCount = results.filter((r) => r.success).length

      return {
        success: successCount > 0,
        message: `Synced ${successCount}/${connections.length} platforms successfully`,
      }
    } catch (error) {
      console.error("Error syncing all platforms:", error)
      return { success: false, error: "Failed to sync platforms" }
    } finally {
      setSyncing(false)
    }
  }, [connections, syncPlatform])

  const getSyncStatus = (platformName: string) => {
    return syncStatuses.find((status) => status.platform_name === platformName)
  }

  return {
    syncStatuses,
    connections,
    loading,
    syncing,
    syncPlatform,
    syncAllPlatforms,
    getSyncStatus,
    refetch: () => {
      fetchSyncStatuses()
      fetchConnections()
    },
  }
}

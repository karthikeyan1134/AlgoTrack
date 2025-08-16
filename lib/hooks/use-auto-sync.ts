"use client"

import { useEffect, useRef } from "react"
import { usePlatformSync } from "./use-platform-sync"

interface AutoSyncOptions {
  enabled: boolean
  intervalMinutes: number
  syncOnMount: boolean
}

const DEFAULT_OPTIONS: AutoSyncOptions = {
  enabled: true,
  intervalMinutes: 30, // Sync every 30 minutes
  syncOnMount: true,
}

export function useAutoSync(options: Partial<AutoSyncOptions> = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const { connections, syncAllPlatforms, syncing } = usePlatformSync()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)

  useEffect(() => {
    // Sync on mount if enabled and has connections
    if (config.syncOnMount && connections.length > 0 && !syncing) {
      const now = Date.now()
      const timeSinceLastSync = now - lastSyncRef.current
      const minInterval = 5 * 60 * 1000 // Minimum 5 minutes between syncs

      if (timeSinceLastSync > minInterval) {
        console.log("[v0] Auto-sync: Syncing on mount")
        syncAllPlatforms().then(() => {
          lastSyncRef.current = Date.now()
        })
      }
    }
  }, [connections.length, config.syncOnMount, syncAllPlatforms, syncing])

  useEffect(() => {
    if (!config.enabled || connections.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Set up periodic sync
    intervalRef.current = setInterval(
      async () => {
        if (!syncing) {
          console.log("[v0] Auto-sync: Periodic sync triggered")
          try {
            await syncAllPlatforms()
            lastSyncRef.current = Date.now()
          } catch (error) {
            console.error("[v0] Auto-sync: Failed to sync platforms", error)
          }
        }
      },
      config.intervalMinutes * 60 * 1000,
    )

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [config.enabled, config.intervalMinutes, connections.length, syncAllPlatforms, syncing])

  const triggerManualSync = async () => {
    if (!syncing && connections.length > 0) {
      console.log("[v0] Auto-sync: Manual sync triggered")
      const result = await syncAllPlatforms()
      lastSyncRef.current = Date.now()
      return result
    }
    return { success: false, error: "Sync already in progress or no connections" }
  }

  return {
    isAutoSyncEnabled: config.enabled,
    syncInterval: config.intervalMinutes,
    triggerManualSync,
    lastSyncTime: lastSyncRef.current,
  }
}

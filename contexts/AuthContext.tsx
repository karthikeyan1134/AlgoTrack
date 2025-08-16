"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get initial session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (isMounted) {
          setUser(session?.user || null)
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Authentication failed")
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        setUser(session?.user || null)
        setLoading(false)
        setError(null)

        // Initialize user stats on sign up
        if (event === "SIGNED_UP" && session?.user) {
          await initializeUserStats(session.user.id)
        }
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const initializeUserStats = async (userId: string) => {
    try {
      const { error } = await supabase.from("user_statistics").upsert(
        {
          user_id: userId,
          total_solved: 0,
          easy_solved: 0,
          medium_solved: 0,
          hard_solved: 0,
          current_streak: 0,
          max_streak: 0,
        },
        {
          onConflict: "user_id",
        },
      )

      if (error) console.error("Error initializing user stats:", error)
    } catch (err) {
      console.error("Failed to initialize user stats:", err)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed"
      setError(errorMessage)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign out failed"
      setError(errorMessage)
      return { error: err }
    }
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

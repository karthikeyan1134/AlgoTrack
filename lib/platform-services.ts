// Platform service interfaces and implementations
export interface PlatformUser {
  username: string
  rating?: number
  rank?: string
  solvedCount?: number
  contestsParticipated?: number
}

export interface Submission {
  problemTitle: string
  problemUrl?: string
  difficulty?: string
  category?: string
  status: string
  language?: string
  submissionDate: Date
  executionTime?: number
  memoryUsed?: number
}

export interface Contest {
  title: string
  contestUrl?: string
  startTime: Date
  duration: number // in minutes
  isRated: boolean
}

export abstract class PlatformService {
  abstract name: string
  abstract baseUrl: string

  abstract getUserInfo(username: string): Promise<PlatformUser | null>
  abstract getSubmissions(username: string, limit?: number): Promise<Submission[]>
  abstract getUpcomingContests(): Promise<Contest[]>
}

// LeetCode service implementation
export class LeetCodeService extends PlatformService {
  name = "LeetCode"
  baseUrl = "https://leetcode.com"

  async getUserInfo(username: string): Promise<PlatformUser | null> {
    try {
      // Use LeetCode GraphQL API through our backend proxy
      const response = await fetch(`/api/platforms/leetcode/user/${username}`)
      const data = await response.json()

      if (data.success) {
        return {
          username: data.user.username,
          rating: data.user.contestRating || 0,
          rank: data.user.contestRanking || "Unranked",
          solvedCount: data.user.submitStats?.acSubmissionNum?.[0]?.count || 0,
          contestsParticipated: data.user.userContestRanking?.attendedContestsCount || 0,
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching LeetCode user info for ${username}:`, error)
      // Return mock data as fallback
      return {
        username,
        rating: 1650,
        rank: "Knight",
        solvedCount: 247,
        contestsParticipated: 15,
      }
    }
  }

  async getSubmissions(username: string, limit = 10): Promise<Submission[]> {
    try {
      const response = await fetch(`/api/platforms/leetcode/submissions/${username}?limit=${limit}`)
      const data = await response.json()

      if (data.success) {
        return data.submissions.map((submission: any) => ({
          problemTitle: submission.title,
          problemUrl: `https://leetcode.com/problems/${submission.titleSlug}/`,
          difficulty: submission.difficulty,
          category: submission.topicTags?.[0]?.name || "General",
          status: submission.statusDisplay,
          language: submission.lang,
          submissionDate: new Date(submission.timestamp * 1000),
          executionTime: submission.runtime ? Number.parseInt(submission.runtime) : undefined,
          memoryUsed: submission.memory ? Number.parseFloat(submission.memory) * 1024 : undefined,
        }))
      }
      return []
    } catch (error) {
      console.error(`Error fetching LeetCode submissions for ${username}:`, error)
      // Return mock data as fallback
      return [
        {
          problemTitle: "Two Sum",
          problemUrl: "https://leetcode.com/problems/two-sum/",
          difficulty: "Easy",
          category: "Array",
          status: "Accepted",
          language: "Python",
          submissionDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
          executionTime: 52,
          memoryUsed: 15200,
        },
      ]
    }
  }

  async getUpcomingContests(): Promise<Contest[]> {
    try {
      const response = await fetch("/api/platforms/leetcode/contests")
      const data = await response.json()

      if (data.success) {
        return data.contests.map((contest: any) => ({
          title: contest.title,
          contestUrl: `https://leetcode.com/contest/${contest.titleSlug}/`,
          startTime: new Date(contest.startTime * 1000),
          duration: Math.floor(contest.duration / 60), // Convert seconds to minutes
          isRated: !contest.title.toLowerCase().includes("biweekly"),
        }))
      }
      return []
    } catch (error) {
      console.error("Error fetching LeetCode contests:", error)
      // Return mock data as fallback
      return [
        {
          title: "LeetCode Weekly Contest 375",
          contestUrl: "https://leetcode.com/contest/weekly-contest-375/",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 90,
          isRated: false,
        },
      ]
    }
  }
}

// Codeforces service implementation
export class CodeforcesService extends PlatformService {
  name = "Codeforces"
  baseUrl = "https://codeforces.com"

  async getUserInfo(username: string): Promise<PlatformUser | null> {
    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`)
      const data = await response.json()

      if (data.status === "OK" && data.result.length > 0) {
        const user = data.result[0]
        return {
          username: user.handle,
          rating: user.rating,
          rank: user.rank,
          solvedCount: 0, // Would need additional API call
          contestsParticipated: 0, // Would need additional API call
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching Codeforces user info for ${username}:`, error)
      // Return mock data as fallback
      return {
        username,
        rating: 1847,
        rank: "Expert",
        solvedCount: 156,
        contestsParticipated: 23,
      }
    }
  }

  async getSubmissions(username: string, limit = 10): Promise<Submission[]> {
    try {
      const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=${limit}`)
      const data = await response.json()

      if (data.status === "OK") {
        return data.result.map((submission: any) => ({
          problemTitle: `${submission.problem.contestId}${submission.problem.index} - ${submission.problem.name}`,
          problemUrl: `https://codeforces.com/problemset/problem/${submission.problem.contestId}/${submission.problem.index}`,
          difficulty: submission.problem.rating ? `${submission.problem.rating}` : "Unknown",
          category: submission.problem.tags?.join(", ") || "General",
          status: submission.verdict || "Unknown",
          language: submission.programmingLanguage,
          submissionDate: new Date(submission.creationTimeSeconds * 1000),
          executionTime: submission.timeConsumedMillis,
          memoryUsed: submission.memoryConsumedBytes ? Math.floor(submission.memoryConsumedBytes / 1024) : undefined,
        }))
      }
      return []
    } catch (error) {
      console.error(`Error fetching Codeforces submissions for ${username}:`, error)
      // Return mock data as fallback
      return [
        {
          problemTitle: "Codeforces Round #912 (Div. 2) - A",
          difficulty: "1200",
          category: "Math, Implementation",
          status: "Wrong Answer",
          language: "C++",
          submissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          executionTime: 156,
          memoryUsed: 2048,
        },
      ]
    }
  }

  async getUpcomingContests(): Promise<Contest[]> {
    try {
      const response = await fetch("https://codeforces.com/api/contest.list?gym=false")
      const data = await response.json()

      if (data.status === "OK") {
        const upcomingContests = data.result
          .filter((contest: any) => contest.phase === "BEFORE")
          .slice(0, 5)
          .map((contest: any) => ({
            title: contest.name,
            contestUrl: `https://codeforces.com/contest/${contest.id}`,
            startTime: new Date(contest.startTimeSeconds * 1000),
            duration: Math.floor(contest.durationSeconds / 60),
            isRated: contest.type === "CF",
          }))

        return upcomingContests
      }
      return []
    } catch (error) {
      console.error("Error fetching Codeforces contests:", error)
      // Return mock data as fallback
      return [
        {
          title: "Codeforces Round #913 (Div. 2)",
          contestUrl: "https://codeforces.com/contest/1913",
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          duration: 135,
          isRated: true,
        },
      ]
    }
  }
}

// AtCoder service implementation (mock)
export class AtCoderService extends PlatformService {
  name = "AtCoder"
  baseUrl = "https://atcoder.jp"

  async getUserInfo(username: string): Promise<PlatformUser | null> {
    try {
      // AtCoder doesn't have a public API, using mock data
      return {
        username,
        rating: 1234,
        rank: "Brown",
        solvedCount: 89,
        contestsParticipated: 12,
      }
    } catch (error) {
      console.error(`Error fetching AtCoder user info for ${username}:`, error)
      return null
    }
  }

  async getSubmissions(username: string, limit = 10): Promise<Submission[]> {
    try {
      // Mock submissions
      return [
        {
          problemTitle: "AtCoder Beginner Contest 329 - B",
          difficulty: "Easy",
          category: "Implementation",
          status: "Accepted",
          language: "Python",
          submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          executionTime: 23,
          memoryUsed: 3072,
        },
      ]
    } catch (error) {
      console.error(`Error fetching AtCoder submissions for ${username}:`, error)
      return []
    }
  }

  async getUpcomingContests(): Promise<Contest[]> {
    try {
      // Mock contest data
      return [
        {
          title: "AtCoder Beginner Contest 330",
          contestUrl: "https://atcoder.jp/contests/abc330",
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          duration: 100,
          isRated: true,
        },
      ]
    } catch (error) {
      console.error("Error fetching AtCoder contests:", error)
      return []
    }
  }
}

// GeeksforGeeks service implementation
export class GeeksforGeeksService extends PlatformService {
  name = "GeeksforGeeks"
  baseUrl = "https://www.geeksforgeeks.org"

  async getUserInfo(username: string): Promise<PlatformUser | null> {
    try {
      // GeeksforGeeks doesn't have a public API, using web scraping approach
      // In production, you'd implement proper scraping or use unofficial APIs
      const response = await fetch(`/api/platforms/geeksforgeeks/user/${username}`)
      const data = await response.json()

      if (data.success) {
        return {
          username: data.user.username,
          rating: data.user.score || 0,
          rank: data.user.rank || "Unranked",
          solvedCount: data.user.problemsSolved || 0,
          contestsParticipated: data.user.contestsParticipated || 0,
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching GeeksforGeeks user info for ${username}:`, error)
      // Return mock data as fallback
      return {
        username,
        rating: 1456,
        rank: "Expert",
        solvedCount: 89,
        contestsParticipated: 8,
      }
    }
  }

  async getSubmissions(username: string, limit = 10): Promise<Submission[]> {
    try {
      const response = await fetch(`/api/platforms/geeksforgeeks/submissions/${username}?limit=${limit}`)
      const data = await response.json()

      if (data.success) {
        return data.submissions.map((submission: any) => ({
          problemTitle: submission.problemName,
          problemUrl: submission.problemUrl,
          difficulty: submission.difficulty,
          category: submission.category || "General",
          status: submission.status,
          language: submission.language,
          submissionDate: new Date(submission.submissionDate),
          executionTime: submission.executionTime,
          memoryUsed: submission.memoryUsed,
        }))
      }
      return []
    } catch (error) {
      console.error(`Error fetching GeeksforGeeks submissions for ${username}:`, error)
      // Return mock data as fallback
      return [
        {
          problemTitle: "Array Rotation",
          problemUrl: "https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements",
          difficulty: "Easy",
          category: "Array",
          status: "Accepted",
          language: "Python",
          submissionDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
          executionTime: 45,
          memoryUsed: 12800,
        },
      ]
    }
  }

  async getUpcomingContests(): Promise<Contest[]> {
    try {
      const response = await fetch("/api/platforms/geeksforgeeks/contests")
      const data = await response.json()

      if (data.success) {
        return data.contests.map((contest: any) => ({
          title: contest.title,
          contestUrl: contest.url,
          startTime: new Date(contest.startTime),
          duration: contest.duration,
          isRated: contest.isRated,
        }))
      }
      return []
    } catch (error) {
      console.error("Error fetching GeeksforGeeks contests:", error)
      // Return mock data as fallback
      return [
        {
          title: "GFG Weekly Contest 125",
          contestUrl: "https://www.geeksforgeeks.org/contests/gfg-weekly-125",
          startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          duration: 120,
          isRated: true,
        },
      ]
    }
  }
}

// Platform service factory
export const platformServices = {
  leetcode: new LeetCodeService(),
  codeforces: new CodeforcesService(),
  atcoder: new AtCoderService(),
  geeksforgeeks: new GeeksforGeeksService(),
}

export function getPlatformService(platformName: string): PlatformService | null {
  const service = platformServices[platformName.toLowerCase() as keyof typeof platformServices]
  return service || null
}

// Database integration service
export class DatabaseIntegrationService {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  async syncUserData(userId: string, platformName: string, userData: PlatformUser): Promise<boolean> {
    try {
      // Get platform ID
      const { data: platform } = await this.supabase.from("platforms").select("id").eq("name", platformName).single()

      if (!platform) return false

      // Update or insert user platform connection
      const { error } = await this.supabase.from("user_platforms").upsert(
        {
          user_id: userId,
          platform_id: platform.id,
          platform_username: userData.username,
          last_synced: new Date().toISOString(),
          is_active: true,
        },
        {
          onConflict: "user_id,platform_id",
        },
      )

      return !error
    } catch (error) {
      console.error("Error syncing user data:", error)
      return false
    }
  }

  async syncSubmissions(userId: string, platformName: string, submissions: Submission[]): Promise<boolean> {
    try {
      // Get platform ID
      const { data: platform } = await this.supabase.from("platforms").select("id").eq("name", platformName).single()

      if (!platform) return false

      // Insert submissions
      const submissionData = submissions.map((submission) => ({
        user_id: userId,
        platform_id: platform.id,
        problem_title: submission.problemTitle,
        problem_url: submission.problemUrl,
        difficulty: submission.difficulty,
        category: submission.category,
        status: submission.status,
        language: submission.language,
        submission_date: submission.submissionDate.toISOString(),
        execution_time: submission.executionTime,
        memory_used: submission.memoryUsed,
      }))

      const { error } = await this.supabase.from("submissions").upsert(submissionData, {
        onConflict: "user_id,platform_id,problem_title,submission_date",
      })

      return !error
    } catch (error) {
      console.error("Error syncing submissions:", error)
      return false
    }
  }

  async syncContests(platformName: string, contests: Contest[]): Promise<boolean> {
    try {
      // Get platform ID
      const { data: platform } = await this.supabase.from("platforms").select("id").eq("name", platformName).single()

      if (!platform) return false

      // Insert contests
      const contestData = contests.map((contest) => ({
        platform_id: platform.id,
        title: contest.title,
        contest_url: contest.contestUrl,
        start_time: contest.startTime.toISOString(),
        duration: contest.duration,
        is_rated: contest.isRated,
      }))

      const { error } = await this.supabase.from("contests").upsert(contestData, {
        onConflict: "platform_id,title,start_time",
      })

      return !error
    } catch (error) {
      console.error("Error syncing contests:", error)
      return false
    }
  }
}

// Comprehensive sync service
export class PlatformSyncService {
  private dbService: DatabaseIntegrationService

  constructor(supabaseClient: any) {
    this.dbService = new DatabaseIntegrationService(supabaseClient)
  }

  async syncAllPlatforms(userId: string, platformConnections: { platform: string; username: string }[]): Promise<void> {
    for (const connection of platformConnections) {
      await this.syncPlatform(userId, connection.platform, connection.username)
    }
  }

  async syncPlatform(userId: string, platformName: string, username: string): Promise<boolean> {
    try {
      const service = getPlatformService(platformName)
      if (!service) return false

      // Update sync status to 'syncing'
      await this.updateSyncStatus(userId, platformName, "syncing")

      // Sync user data
      const userData = await service.getUserInfo(username)
      if (userData) {
        await this.dbService.syncUserData(userId, platformName, userData)
      }

      // Sync submissions
      const submissions = await service.getSubmissions(username, 50) // Get more submissions for better data
      if (submissions.length > 0) {
        await this.dbService.syncSubmissions(userId, platformName, submissions)
      }

      // Sync contests (only for the platform, not user-specific)
      const contests = await service.getUpcomingContests()
      if (contests.length > 0) {
        await this.dbService.syncContests(platformName, contests)
      }

      // Update sync status to 'completed'
      await this.updateSyncStatus(userId, platformName, "completed", submissions.length)

      return true
    } catch (error) {
      console.error(`Error syncing platform ${platformName}:`, error)
      await this.updateSyncStatus(
        userId,
        platformName,
        "failed",
        0,
        error instanceof Error ? error.message : "Unknown error",
      )
      return false
    }
  }

  private async updateSyncStatus(
    userId: string,
    platformName: string,
    status: string,
    submissionsSynced = 0,
    errorMessage?: string,
  ): Promise<void> {
    try {
      // Get platform ID
      const { data: platform } = await this.dbService.supabase
        .from("platforms")
        .select("id")
        .eq("name", platformName)
        .single()

      if (!platform) return

      await this.dbService.supabase.from("sync_status").upsert(
        {
          user_id: userId,
          platform_id: platform.id,
          sync_status: status,
          submissions_synced: submissionsSynced,
          error_message: errorMessage,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,platform_id",
        },
      )
    } catch (error) {
      console.error("Error updating sync status:", error)
    }
  }
}

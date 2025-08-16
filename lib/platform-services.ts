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
      // Note: LeetCode doesn't have a public API, this is a mock implementation
      // In a real app, you'd use web scraping or unofficial APIs
      const mockData: PlatformUser = {
        username,
        rating: 1650,
        rank: "Knight",
        solvedCount: 247,
        contestsParticipated: 15,
      }
      return mockData
    } catch (error) {
      console.error(`Error fetching LeetCode user info for ${username}:`, error)
      return null
    }
  }

  async getSubmissions(username: string, limit = 10): Promise<Submission[]> {
    try {
      // Mock submissions data
      const mockSubmissions: Submission[] = [
        {
          problemTitle: "Two Sum",
          problemUrl: "https://leetcode.com/problems/two-sum/",
          difficulty: "Easy",
          category: "Array",
          status: "Accepted",
          language: "Python",
          submissionDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          executionTime: 52,
          memoryUsed: 15200,
        },
        {
          problemTitle: "Binary Tree Inorder Traversal",
          problemUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
          difficulty: "Easy",
          category: "Tree",
          status: "Accepted",
          language: "JavaScript",
          submissionDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          executionTime: 68,
          memoryUsed: 42100,
        },
      ]
      return mockSubmissions.slice(0, limit)
    } catch (error) {
      console.error(`Error fetching LeetCode submissions for ${username}:`, error)
      return []
    }
  }

  async getUpcomingContests(): Promise<Contest[]> {
    try {
      // Mock contest data
      const mockContests: Contest[] = [
        {
          title: "LeetCode Weekly Contest 375",
          contestUrl: "https://leetcode.com/contest/weekly-contest-375/",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          duration: 90, // 1.5 hours
          isRated: false,
        },
      ]
      return mockContests
    } catch (error) {
      console.error("Error fetching LeetCode contests:", error)
      return []
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
          submissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
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
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          duration: 135, // 2h 15m
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
          submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          duration: 100, // 1h 40m
          isRated: true,
        },
      ]
    } catch (error) {
      console.error("Error fetching AtCoder contests:", error)
      return []
    }
  }
}

// Platform service factory
export const platformServices = {
  leetcode: new LeetCodeService(),
  codeforces: new CodeforcesService(),
  atcoder: new AtCoderService(),
}

export function getPlatformService(platformName: string): PlatformService | null {
  const service = platformServices[platformName.toLowerCase() as keyof typeof platformServices]
  return service || null
}

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code2, TrendingUp, Trophy, Calendar } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Code2 className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">CP Tracker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your competitive programming journey across multiple platforms. Monitor progress, analyze performance,
            and never miss a contest.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your submissions across LeetCode, Codeforces, AtCoder, and more</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Contest Analytics</h3>
            <p className="text-gray-600">Analyze your contest performance and track rating changes</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Never Miss Contests</h3>
            <p className="text-gray-600">Get reminders for upcoming contests across all platforms</p>
          </div>
        </div>
      </div>
    </div>
  )
}

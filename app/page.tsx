import { Suspense } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RecentStudySessions from "@/components/recent-study-sessions"
import GoalProgress from "@/components/goal-progress"
import StudyTimeChart from "@/components/study-time-chart"
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Study Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your study sessions, set goals, and monitor your academic progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/log-session">
              <Clock className="mr-2 h-4 w-4" />
              Log New Session
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h 30m</div>
            <p className="text-xs text-muted-foreground">+2.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Mathematics, Science, Literature, History, Programming</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/7</div>
            <p className="text-xs text-muted-foreground">42% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Study Time by Subject</CardTitle>
            <CardDescription>Your study distribution over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <StudyTimeChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>Your current academic goals</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <GoalProgress />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Study Sessions</CardTitle>
            <CardDescription>Your latest study activities</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/sessions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <RecentStudySessions />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}


"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Clock, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { StudySession } from "@/lib/types"
import { getStudySessions, deleteStudySession } from "@/lib/storage"
import Link from "next/link"

export default function SessionsPage() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<StudySession[]>([])
  const [subjects, setSubjects] = useState<string[]>([])

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    try {
      const loadedSessions = getStudySessions()
      setSessions(loadedSessions)

      // Extract unique subjects
      const uniqueSubjects = Array.from(new Set(loadedSessions.map((session) => session.subject)))
      setSubjects(uniqueSubjects)

      // Initial filtering
      setFilteredSessions(loadedSessions)
    } catch (error) {
      toast({
        title: "Error loading sessions",
        description: "There was a problem loading your study sessions.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...sessions]

    // Apply subject filter
    if (subjectFilter) {
      result = result.filter((session) => session.subject === subjectFilter)
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (session) =>
          session.subject.toLowerCase().includes(term) || (session.notes && session.notes.toLowerCase().includes(term)),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "date-asc":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "duration-desc":
        result.sort((a, b) => b.duration - a.duration)
        break
      case "duration-asc":
        result.sort((a, b) => a.duration - b.duration)
        break
      case "subject-asc":
        result.sort((a, b) => a.subject.localeCompare(b.subject))
        break
      default:
        break
    }

    setFilteredSessions(result)
  }, [sessions, searchTerm, subjectFilter, sortBy])

  const handleDeleteSession = (id: string) => {
    try {
      deleteStudySession(id)
      const updatedSessions = sessions.filter((session) => session.id !== id)
      setSessions(updatedSessions)

      toast({
        title: "Session deleted",
        description: "Your study session has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting session",
        description: "There was a problem deleting your study session.",
        variant: "destructive",
      })
    }
  }

  const getTotalStudyTime = () => {
    return filteredSessions.reduce((total, session) => total + session.duration, 0)
  }

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Study Sessions</CardTitle>
            <CardDescription>View and manage your study history</CardDescription>
          </div>
          <Button asChild>
            <Link href="/log-session">
              <Clock className="mr-2 h-4 w-4" />
              Log New Session
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by subject or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="duration-desc">Longest First</SelectItem>
                  <SelectItem value="duration-asc">Shortest First</SelectItem>
                  <SelectItem value="subject-asc">Subject (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredSessions.length > 0 ? (
            <>
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">Total Sessions: </span>
                    <span className="text-sm">{filteredSessions.length}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Total Study Time: </span>
                    <span className="text-sm">{formatStudyTime(getTotalStudyTime())}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{session.subject}</h3>
                        <Badge variant="outline" className="ml-2">
                          {session.duration} minutes
                        </Badge>
                        {session.difficulty && (
                          <Badge
                            className={`ml-2 ${
                              session.difficulty === "easy"
                                ? "bg-green-100 text-green-800"
                                : session.difficulty === "hard"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                            variant="outline"
                          >
                            {session.difficulty}
                          </Badge>
                        )}
                      </div>
                      {session.notes && <p className="text-sm text-muted-foreground">{session.notes}</p>}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(session.date), "PPP")} (
                        {formatDistanceToNow(new Date(session.date), { addSuffix: true })})
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Delete session</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No sessions found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {sessions.length === 0
                  ? "You haven't logged any study sessions yet."
                  : "Try adjusting your filters to find what you're looking for."}
              </p>
              {sessions.length === 0 && (
                <Button className="mt-4" asChild>
                  <Link href="/log-session">Log Your First Session</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}


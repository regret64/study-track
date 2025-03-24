"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { StudySession } from "@/lib/types"
import { getStudySessions } from "@/lib/storage"

export default function RecentStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const loadedSessions = getStudySessions()
      setSessions(loadedSessions.slice(0, 5)) // Get 5 most recent sessions
    } catch (error) {
      toast({
        title: "Error loading sessions",
        description: "There was a problem loading your study sessions.",
        variant: "destructive",
      })
    }
  }, [toast])

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No study sessions recorded yet. Start tracking your study time!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div key={session.id} className="flex items-start justify-between p-4 rounded-lg border">
          <div>
            <h3 className="font-medium">{session.subject}</h3>
            <p className="text-sm text-muted-foreground">{session.notes}</p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="outline">{session.duration} minutes</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


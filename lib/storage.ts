import type { StudySession, Goal } from "./types"

// Study Sessions Storage
export function getStudySessions(): StudySession[] {
  if (typeof window === "undefined") return []

  const sessions = localStorage.getItem("study-sessions")
  return sessions ? JSON.parse(sessions) : []
}

export function addStudySession(session: StudySession): void {
  const sessions = getStudySessions()
  sessions.unshift(session) // Add to beginning of array
  localStorage.setItem("study-sessions", JSON.stringify(sessions))
}

export function deleteStudySession(id: string): void {
  const sessions = getStudySessions()
  const updatedSessions = sessions.filter((session) => session.id !== id)
  localStorage.setItem("study-sessions", JSON.stringify(updatedSessions))
}

// Goals Storage
export function getGoals(): Goal[] {
  if (typeof window === "undefined") return []

  const goals = localStorage.getItem("study-goals")
  return goals ? JSON.parse(goals) : []
}

export function addGoal(goal: Goal): void {
  const goals = getGoals()
  goals.push(goal)
  localStorage.setItem("study-goals", JSON.stringify(goals))
}

export function updateGoal(id: string, updates: Partial<Goal>): void {
  const goals = getGoals()
  const updatedGoals = goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
  localStorage.setItem("study-goals", JSON.stringify(updatedGoals))
}

export function deleteGoal(id: string): void {
  const goals = getGoals()
  const updatedGoals = goals.filter((goal) => goal.id !== id)
  localStorage.setItem("study-goals", JSON.stringify(updatedGoals))
}

// Initialize with sample data if empty
export function initializeStorageWithSampleData(): void {
  if (typeof window === "undefined") return

  // Only initialize if storage is empty
  if (getStudySessions().length === 0) {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(now)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const sampleSessions: StudySession[] = [
      {
        id: "1",
        subject: "Mathematics",
        duration: 90,
        date: now.toISOString(),
        notes: "Studied calculus derivatives and integrals",
        difficulty: "medium",
      },
      {
        id: "2",
        subject: "Science",
        duration: 60,
        date: yesterday.toISOString(),
        notes: "Reviewed physics formulas for upcoming test",
        difficulty: "hard",
      },
      {
        id: "3",
        subject: "Literature",
        duration: 45,
        date: twoDaysAgo.toISOString(),
        notes: "Read Shakespeare's Hamlet",
        difficulty: "medium",
      },
      {
        id: "4",
        subject: "Programming",
        duration: 120,
        date: twoDaysAgo.toISOString(),
        notes: "Practiced TypeScript and React hooks",
        difficulty: "easy",
      },
    ]

    localStorage.setItem("study-sessions", JSON.stringify(sampleSessions))
  }

  if (getGoals().length === 0) {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const sampleGoals: Goal[] = [
      {
        id: "1",
        title: "Master Calculus",
        description: "Complete all practice problems and score 90% on final exam",
        target: "Score 90% on final exam",
        deadline: nextMonth.toISOString(),
        progress: 30,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Finish Programming Project",
        description: "Complete the full-stack web application",
        target: "Functional web app with all features",
        deadline: nextMonth.toISOString(),
        progress: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Read 5 Literature Books",
        target: "5 books",
        progress: 40,
        createdAt: new Date().toISOString(),
      },
    ]

    localStorage.setItem("study-goals", JSON.stringify(sampleGoals))
  }
}


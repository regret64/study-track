export interface StudySession {
  id: string
  subject: string
  duration: number // in minutes
  date: string // ISO string
  notes?: string
  difficulty?: "easy" | "medium" | "hard"
}

export interface Goal {
  id: string
  title: string
  description?: string
  target: string
  deadline?: string // ISO string
  progress: number // 0-100
  createdAt: string // ISO string
}


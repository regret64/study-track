"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Goal } from "@/lib/types"
import { getGoals, updateGoal } from "@/lib/storage"
import Link from "next/link"

export default function GoalProgress() {
  const [goals, setGoals] = useState<Goal[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const loadedGoals = getGoals()
      setGoals(loadedGoals)
    } catch (error) {
      toast({
        title: "Error loading goals",
        description: "There was a problem loading your goals.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleUpdateProgress = (id: string, newProgress: number) => {
    try {
      updateGoal(id, { progress: newProgress })
      setGoals(goals.map((goal) => (goal.id === id ? { ...goal, progress: newProgress } : goal)))

      toast({
        title: "Progress updated",
        description: "Your goal progress has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error updating progress",
        description: "There was a problem updating your goal progress.",
        variant: "destructive",
      })
    }
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No goals set yet</p>
        <Button asChild>
          <Link href="/goals">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Goal
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{goal.title}</h3>
            <span className="text-sm text-muted-foreground">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Target: {goal.target}</span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpdateProgress(goal.id, Math.min(goal.progress + 10, 100))}
                className="h-7 px-2"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                <span>Update</span>
              </Button>
              {goal.progress === 100 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


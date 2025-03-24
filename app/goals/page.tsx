"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Goal } from "@/lib/types"
import { getGoals, addGoal, deleteGoal } from "@/lib/storage"

export default function GoalsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title || !formData.target) {
        throw new Error("Please fill in all required fields")
      }

      // Create new goal
      const newGoal: Goal = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        target: formData.target,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        progress: 0,
        createdAt: new Date().toISOString(),
      }

      // Save to storage
      addGoal(newGoal)

      // Update local state
      setGoals([...goals, newGoal])

      // Reset form
      setFormData({
        title: "",
        description: "",
        target: "",
        deadline: "",
      })

      toast({
        title: "Goal added successfully",
        description: `New goal "${formData.title}" has been added`,
      })
    } catch (error) {
      toast({
        title: "Error adding goal",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteGoal = (id: string) => {
    try {
      deleteGoal(id)
      setGoals(goals.filter((goal) => goal.id !== id))

      toast({
        title: "Goal deleted",
        description: "Your goal has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting goal",
        description: "There was a problem deleting your goal.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Goal</CardTitle>
              <CardDescription>Set academic goals to track your progress</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Master Calculus, Complete Programming Project"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    name="target"
                    placeholder="e.g., Score 90% on final exam, Complete 5 chapters"
                    value={formData.target}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Additional details about your goal"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Goal"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>Track and manage your academic goals</CardDescription>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No goals set yet. Add your first goal to get started!
                </div>
              ) : (
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          {goal.description && <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Delete goal</span>
                        </Button>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress: {goal.progress}%</span>
                          <span>Target: {goal.target}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2 mt-2" />
                      </div>

                      {goal.deadline && (
                        <div className="text-xs text-muted-foreground">
                          Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}


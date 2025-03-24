"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, BarChart2, Target } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <BookOpen className="h-6 w-6 mr-2" />
            <span className="font-bold text-lg">StudyTracker</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Button variant={isActive("/") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/">
                <BarChart2 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant={isActive("/sessions") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/sessions">
                <BookOpen className="h-4 w-4 mr-2" />
                Sessions
              </Link>
            </Button>
            <Button variant={isActive("/goals") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/goals">
                <Target className="h-4 w-4 mr-2" />
                Goals
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}


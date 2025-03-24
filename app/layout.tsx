import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import InitializeApp from "@/components/initialize-app"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Study Tracker",
  description: "Track your study sessions, set goals, and monitor your academic progress",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <Toaster />
          <InitializeApp />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
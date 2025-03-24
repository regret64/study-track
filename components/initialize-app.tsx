"use client"

import { useEffect } from "react"
import { initializeStorageWithSampleData } from "@/lib/storage"

export default function InitializeApp() {
  useEffect(() => {
    // Initialize storage with sample data if empty
    initializeStorageWithSampleData()
  }, [])

  return null
}


"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { getStudySessions } from "@/lib/storage"
import type { StudySession } from "@/lib/types"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StudyTimeChart() {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Minutes",
        data: [] as number[],
        backgroundColor: [] as string[],
      },
    ],
  })

  useEffect(() => {
    // Get study sessions from storage
    const sessions = getStudySessions()

    // Process data for chart
    const subjectMap = new Map<string, number>()

    sessions.forEach((session: StudySession) => {
      const currentTotal = subjectMap.get(session.subject) || 0
      subjectMap.set(session.subject, currentTotal + session.duration)
    })

    // Generate colors for each subject
    const colors = [
      "rgba(75, 192, 192, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
      "rgba(255, 99, 132, 0.6)",
      "rgba(255, 206, 86, 0.6)",
    ]

    const subjects = Array.from(subjectMap.keys())
    const durations = Array.from(subjectMap.values())
    const backgroundColors = subjects.map((_, index) => colors[index % colors.length])

    setChartData({
      labels: subjects,
      datasets: [
        {
          label: "Minutes",
          data: durations,
          backgroundColor: backgroundColors,
        },
      ],
    })
  }, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            const hours = Math.floor(value / 60)
            const minutes = value % 60
            return `${hours}h ${minutes}m`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Minutes",
        },
      },
    },
  }

  if (chartData.labels.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">No study data available yet</div>
    )
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}


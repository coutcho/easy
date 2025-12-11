"use client"

import ResultsDisplay from "@/components/results-display"
import ProtectedRoute from "@/components/protected-route"

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <ResultsDisplay />
      </main>
    </ProtectedRoute>
  )
}

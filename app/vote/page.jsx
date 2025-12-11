"use client"

import VotingForm from "@/components/voting-form"
import ProtectedRoute from "@/components/protected-route"

export default function VotePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <VotingForm />
      </main>
    </ProtectedRoute>
  )
}

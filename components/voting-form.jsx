"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/axios"
import { CheckCircle2 } from "lucide-react"

const CANDIDATES = [
  { id: 1, name: "Alice Johnson", party: "Progressive Party" },
  { id: 2, name: "Bob Smith", party: "Conservative Party" },
  { id: 3, name: "Carol Williams", party: "Independent" },
]

export default function VotingForm() {
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const { token } = useAuth()

  const handleVote = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!selectedCandidate) {
      setError("Please select a candidate")
      setLoading(false)
      return
    }

    try {
      const response = await api.post(
        "/vote",
        { candidateId: Number.parseInt(selectedCandidate) },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setSuccess(response.data.message || "Your vote has been recorded!")
      setHasVoted(true)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit vote. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (hasVoted) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="text-muted-foreground">{success}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Cast Your Vote</CardTitle>
        <CardDescription>Select your preferred candidate below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVote} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
            {CANDIDATES.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={String(candidate.id)} id={`candidate-${candidate.id}`} />
                <Label htmlFor={`candidate-${candidate.id}`} className="flex-1 cursor-pointer">
                  <div className="font-medium">{candidate.name}</div>
                  <div className="text-sm text-muted-foreground">{candidate.party}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button type="submit" className="w-full" disabled={loading || !selectedCandidate}>
            {loading ? "Submitting..." : "Submit Vote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

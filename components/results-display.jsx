"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/axios"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResultsDisplay() {
  const [results, setResults] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const fetchResults = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await api.get("/results", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setResults(response.data.results || [])
      setTotalVotes(response.data.totalVotes || 0)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load results")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [token])

  if (loading) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Election Results</CardTitle>
            <CardDescription>Total votes: {totalVotes}</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={fetchResults}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {results.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No votes recorded yet</p>
          ) : (
            results.map((candidate) => {
              const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
              return (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.party}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{candidate.votes} votes</p>
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

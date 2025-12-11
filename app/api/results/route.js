import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken, extractToken } from "@/lib/jwt"

// Logging middleware
function log(message, data = {}) {
  console.log(`[API /results] ${message}`, JSON.stringify(data))
}

export async function GET(request) {
  log("Results request started")

  try {
    // Verify JWT token
    const authHeader = request.headers.get("authorization")
    const token = extractToken(authHeader)

    if (!token) {
      log("No token provided")
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      log("Invalid token")
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Fetch results with vote counts
    const resultsQuery = await query(`
      SELECT 
        c.id,
        c.name,
        c.party,
        COUNT(v.id) as votes
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id, c.name, c.party
      ORDER BY votes DESC
    `)

    // Calculate total votes
    const totalVotesQuery = await query("SELECT COUNT(*) as total FROM votes")
    const totalVotes = Number.parseInt(totalVotesQuery.rows[0].total, 10)

    const results = resultsQuery.rows.map((row) => ({
      id: row.id,
      name: row.name,
      party: row.party,
      votes: Number.parseInt(row.votes, 10),
    }))

    log("Results fetched successfully", { totalVotes, candidateCount: results.length })

    return NextResponse.json({
      results,
      totalVotes,
    })
  } catch (error) {
    log("Server error", { error: error.message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

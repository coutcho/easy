import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken, extractToken } from "@/lib/jwt"

// Logging middleware
function log(message, data = {}) {
  console.log(`[API /vote] ${message}`, JSON.stringify(data))
}

export async function POST(request) {
  log("Vote attempt started")

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

    const userId = decoded.userId
    const body = await request.json()
    const { candidateId } = body

    // Validate input
    if (!candidateId) {
      log("Missing candidate ID")
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    // Check if user has already voted (prevent double voting)
    const existingVote = await query("SELECT id FROM votes WHERE user_id = $1", [userId])

    if (existingVote.rows.length > 0) {
      log("Double vote attempt", { userId })
      return NextResponse.json({ error: "You have already voted" }, { status: 400 })
    }

    // Verify candidate exists
    const candidateCheck = await query("SELECT id FROM candidates WHERE id = $1", [candidateId])

    if (candidateCheck.rows.length === 0) {
      log("Invalid candidate", { candidateId })
      return NextResponse.json({ error: "Invalid candidate" }, { status: 400 })
    }

    // Record the vote
    await query("INSERT INTO votes (user_id, candidate_id, created_at) VALUES ($1, $2, NOW())", [userId, candidateId])

    log("Vote recorded successfully", { userId, candidateId })

    return NextResponse.json({
      message: "Your vote has been recorded successfully!",
    })
  } catch (error) {
    log("Server error", { error: error.message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

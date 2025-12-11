import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { generateToken } from "@/lib/jwt"
import bcrypt from "bcryptjs"

// Logging middleware
function log(message, data = {}) {
  console.log(`[API /login] ${message}`, JSON.stringify(data))
}

export async function POST(request) {
  log("Login attempt started")

  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      log("Missing credentials")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Query user from database
    const result = await query("SELECT id, email, password_hash, name FROM users WHERE email = $1", [email])

    if (result.rows.length === 0) {
      log("User not found", { email })
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      log("Invalid password", { email })
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email })

    log("Login successful", { userId: user.id, email: user.email })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    log("Server error", { error: error.message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

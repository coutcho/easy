import { Pool } from "pg"

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function query(text, params) {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("[DB] Query executed", { text: text.substring(0, 50), duration, rows: result.rowCount })
    return result
  } catch (error) {
    console.error("[DB] Query error", { text: text.substring(0, 50), error: error.message })
    throw error
  }
}

export default pool

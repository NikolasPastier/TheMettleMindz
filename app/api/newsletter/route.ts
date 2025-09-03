import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (!process.env.NEON_DATABASE_URL) {
      console.error("Database connection not configured")
      // Continue with Beehiiv integration even if DB is not configured
    } else {
      try {
        // Create table if it doesn't exist
        await sql`
          CREATE TABLE IF NOT EXISTS subscribers (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `

        // Insert email into database (ignore if already exists)
        await sql`
          INSERT INTO subscribers (email) 
          VALUES (${email})
          ON CONFLICT (email) DO NOTHING
        `
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Continue with Beehiiv integration even if DB fails
      }
    }

    if (!process.env.BEEHIIV_API_KEY) {
      console.error("Beehiiv API key not configured")
      return NextResponse.json({
        success: true,
        message: "Subscribed successfully! (Email service temporarily unavailable)",
      })
    }

    const publicationId = process.env.BEEHIIV_PUBLICATION_ID || "pub_9898fcca-1346-4800-9d20-0d2e1b0057a4"

    // Add subscriber to Beehiiv
    const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "website",
        utm_medium: "newsletter_form",
      }),
    })

    if (!beehiivResponse.ok) {
      const errorData = await beehiivResponse.text()
      console.error("Beehiiv API error:", errorData)

      // If it's a duplicate email error, still return success
      if (beehiivResponse.status === 400 && errorData.includes("already exists")) {
        return NextResponse.json({
          success: true,
          message: "Already subscribed!",
        })
      }

      return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully!",
    })
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

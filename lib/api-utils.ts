import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * API route authentication middleware
 * Use this to protect API routes
 */
export async function withAuth<T>(handler: (user: any) => Promise<T>): Promise<T | NextResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return await handler(user)
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * Validate request body against schema
 */
export function validateRequestBody(body: any, requiredFields: string[]) {
  const missingFields = requiredFields.filter((field) => !body[field])

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

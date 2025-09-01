import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

/**
 * Server-side authentication utility
 * Use this in server components to protect routes
 */
export async function requireAuth() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return user
}

/**
 * Get user profile with authentication check
 */
export async function getUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching user profile:", profileError)
  }

  return { user, profile }
}

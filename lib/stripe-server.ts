import Stripe from "stripe"

const secretKey = process.env.STRIPE_SECRET_KEY

if (!secretKey) {
  console.error("[v0] STRIPE_SECRET_KEY is not set - server-side Stripe operations will fail")
  console.warn(
    "[v0] Available env vars:",
    Object.keys(process.env).filter((key) => key.includes("STRIPE")),
  )
}

console.log("[v0] Stripe server configuration status:", {
  hasSecretKey: !!secretKey,
  secretKeyPrefix: secretKey ? secretKey.substring(0, 7) + "..." : "not found",
})

// Server-side Stripe instance with proper error handling
export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    })
  : null

// Helper function to ensure Stripe is configured
export function ensureStripeConfigured(): Stripe {
  if (!stripe) {
    throw new Error("Stripe is not configured. Missing STRIPE_SECRET_KEY environment variable.")
  }
  return stripe
}

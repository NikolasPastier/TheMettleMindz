import { loadStripe } from "@stripe/stripe-js"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!publishableKey) {
  console.warn("[v0] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
  console.warn(
    "[v0] Available env vars:",
    Object.keys(process.env).filter((key) => key.includes("STRIPE")),
  )
}

console.log("[v0] Stripe client configuration status:", {
  hasPublishableKey: !!publishableKey,
  publishableKeyPrefix: publishableKey ? publishableKey.substring(0, 7) + "..." : "not found",
})

// Initialize Stripe with publishable key (client-side only)
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null

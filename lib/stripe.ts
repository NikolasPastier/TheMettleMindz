import { loadStripe } from "@stripe/stripe-js"
import Stripe from "stripe"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const secretKey = process.env.STRIPE_SECRET_KEY

if (!publishableKey) {
  console.warn("[v0] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
}

if (!secretKey) {
  console.warn("[v0] STRIPE_SECRET_KEY is not set")
}

// Initialize Stripe with publishable key (client-side)
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null

// Server-side Stripe instance with proper error handling
export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    })
  : null

"use client"

import { useState } from "react"
import type { CartItem } from "@/contexts/cart-context"
import { createClient } from "@/lib/supabase/client"

interface CheckoutResponse {
  sessionId: string
  url?: string
}

interface Discount {
  code: string
  amount: number
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectToCheckout = async (items: CartItem[], discount?: Discount | null) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!items || items.length === 0) {
        throw new Error("No items in cart")
      }

      const supabase = createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user?.email) {
        throw new Error("User must be logged in to checkout")
      }

      const userId = user.id
      const userEmail = user.email

      // Validate items have required fields
      const invalidItems = items.filter((item) => !item.id || !item.title || !item.price)
      if (invalidItems.length > 0) {
        throw new Error("Invalid items in cart")
      }

      console.log("[v0] Creating checkout session for items:", items)
      console.log("[v0] User ID:", userId)
      console.log("[v0] User email:", userEmail)
      if (discount) {
        console.log("[v0] Applying discount:", discount)
      }

      const requestBody = {
        cartItems: items,
        userId: userId,
        userEmail: userEmail,
        ...(discount && { discount }),
      }

      // Create checkout session with enhanced error handling
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log("[v0] Checkout session creation failed:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create checkout session`)
      }

      const data: CheckoutResponse = await response.json()

      console.log("[v0] Checkout session created successfully:", data)

      if (data.sessionId) {
        // Load Stripe.js dynamically
        const stripe = await import("@stripe/stripe-js").then((module) =>
          module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
        )

        if (!stripe) {
          throw new Error("Failed to load Stripe")
        }

        console.log("[v0] Redirecting to Stripe checkout with sessionId:", data.sessionId)

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (stripeError) {
          throw new Error(stripeError.message || "Failed to redirect to checkout")
        }

        return
      }

      throw new Error("No session ID received from server")
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    redirectToCheckout,
    isLoading,
    error,
    clearError,
  }
}

"use client"

import { useState } from "react"
import { stripePromise } from "@/lib/stripe"
import type { CartItem } from "@/contexts/cart-context"

interface CheckoutResponse {
  sessionId: string
  url?: string
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectToCheckout = async (items: CartItem[]) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!items || items.length === 0) {
        throw new Error("No items in cart")
      }

      // Validate items have required fields
      const invalidItems = items.filter((item) => !item.id || !item.title || !item.price)
      if (invalidItems.length > 0) {
        throw new Error("Invalid items in cart")
      }

      // Create checkout session with enhanced error handling
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create checkout session`)
      }

      const data: CheckoutResponse = await response.json()

      if (!data.sessionId) {
        throw new Error("No session ID received from server")
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to initialize. Please refresh and try again.")
      }

      // Use direct URL redirect if available, otherwise use sessionId
      if (data.url) {
        window.location.href = data.url
        return
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message || "Failed to redirect to checkout")
      }
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

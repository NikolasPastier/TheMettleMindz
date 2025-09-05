"use client"

import { useState } from "react"
import type { CartItem } from "@/contexts/cart-context"

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

  const redirectToCheckout = async (items: CartItem[], discount?: Discount | null, userEmail?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!items || items.length === 0) {
        throw new Error("No items in cart")
      }

      if (!userEmail) {
        throw new Error("User email is required for checkout")
      }

      // Validate items have required fields
      const invalidItems = items.filter((item) => !item.id || !item.title || !item.price)
      if (invalidItems.length > 0) {
        throw new Error("Invalid items in cart")
      }

      console.log("[v0] Creating checkout session for items:", items)
      if (discount) {
        console.log("[v0] Applying discount:", discount)
      }

      const requestBody = {
        items,
        user_email: userEmail, // Include user email in request
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

      if (data.url) {
        console.log("[v0] Redirecting to Stripe checkout URL:", data.url)
        window.location.href = data.url
        return
      }

      throw new Error("No checkout URL received from server")
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

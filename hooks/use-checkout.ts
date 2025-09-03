"use client"

import { useState } from "react"
import { stripePromise } from "@/lib/stripe"
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

  const redirectToCheckout = async (items: CartItem[], discount?: Discount | null) => {
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

      console.log("[v0] Creating checkout session for items:", items)
      if (discount) {
        console.log("[v0] Applying discount:", discount)
      }

      const requestBody = {
        items,
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

      if (!data.sessionId) {
        console.log("[v0] No session ID received from server")
        throw new Error("No session ID received from server")
      }

      console.log("[v0] Session ID received:", data.sessionId)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const stripe = await stripePromise
      if (!stripe) {
        console.log("[v0] Stripe failed to initialize")
        throw new Error("Stripe failed to initialize. Please refresh and try again.")
      }

      console.log("[v0] Stripe initialized successfully")

      console.log("[v0] Attempting Stripe redirect to checkout with session ID:", data.sessionId)

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (stripeError) {
          console.log("[v0] Stripe redirect error:", stripeError.message)
          if (stripeError.message?.includes("insecure") || stripeError.message?.includes("security")) {
            console.log("[v0] Security error detected, attempting direct redirect as fallback")
            window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`
            return
          }
          throw new Error(stripeError.message || "Failed to redirect to checkout")
        }

        console.log("[v0] Stripe redirect initiated successfully")
      } catch (redirectError) {
        console.log("[v0] Redirect error caught:", redirectError)
        if (data.url) {
          console.log("[v0] Using fallback URL redirect:", data.url)
          window.location.href = data.url
        } else {
          throw redirectError
        }
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

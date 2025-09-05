import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      console.error("Stripe is not configured. Missing STRIPE_SECRET_KEY environment variable.")
      return NextResponse.json(
        { error: "Payment verification is currently unavailable. Please contact support." },
        { status: 503 },
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("[v0] Verifying session:", sessionId)

    try {
      // Retrieve session with expanded data
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "line_items.data.price.product", "customer", "payment_intent"],
      })

      console.log("[v0] Session retrieved:", {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
      })

      if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
        console.log("[v0] Payment not completed, status:", session.payment_status)
        return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
      }

      const cookieStore = cookies()
      const supabase = createServerClient(cookieStore)

      let userId = null
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (!authError && user) {
          userId = user.id
          console.log("[v0] User authenticated:", user.email)
        } else {
          console.log("[v0] No authenticated user, will save by email")
        }
      } catch (authError) {
        console.log("[v0] Auth check failed, continuing as guest")
      }

      const customerEmail = session.customer_details?.email
      const lineItems = session.line_items?.data || []

      console.log("[v0] Processing", lineItems.length, "line items for purchase recording")

      const purchaseResults = []
      for (const item of lineItems) {
        try {
          let productId = null

          // Primary method: Parse from session metadata
          if (session.metadata?.items) {
            try {
              const items = JSON.parse(session.metadata.items)
              if (Array.isArray(items)) {
                // Find matching item by price or use first item
                const matchingItem =
                  items.find((metaItem) => metaItem.price === (item.amount_total || 0) / 100 / (item.quantity || 1)) ||
                  items[0]
                productId = matchingItem?.product_id || matchingItem?.id
              }
            } catch (parseError) {
              console.error("[v0] Error parsing session metadata items:", parseError)
            }
          }

          // Fallback: Extract from Stripe product data
          if (!productId && item.price?.product && typeof item.price.product === "object") {
            productId = item.price.product.metadata?.product_id || item.price.product.id
          } else if (!productId && typeof item.price?.product === "string") {
            productId = item.price.product
          }

          if (!productId) {
            console.error("[v0] Could not determine product ID for line item:", item.id)
            continue
          }

          console.log("[v0] Saving purchase for product:", productId, "Amount:", item.amount_total || 0)

          const { data: existingPurchase } = await supabase
            .from("purchases")
            .select("id")
            .eq("product_id", productId)
            .eq("status", "completed")
            .or(
              userId ? `user_id.eq.${userId},customer_email.eq.${customerEmail}` : `customer_email.eq.${customerEmail}`,
            )
            .single()

          if (existingPurchase) {
            console.log("[v0] Purchase already exists for product:", productId)
            purchaseResults.push({ productId, status: "already_exists" })
            continue
          }

          const purchaseData = {
            user_id: userId,
            customer_email: customerEmail,
            product_id: productId,
            amount_paid: item.amount_total || 0, // Save 0 for free purchases with discount codes
            currency: session.currency || "usd",
            status: "completed", // Use "completed" for all successful purchases
            purchased_at: new Date().toISOString(),
            stripe_session_id: sessionId,
          }

          const { error: insertError } = await supabase.from("purchases").insert(purchaseData)

          if (insertError) {
            console.error("[v0] Error inserting purchase:", insertError)
            purchaseResults.push({ productId, status: "error", error: insertError.message })
          } else {
            console.log(
              "[v0] Purchase saved successfully for product:",
              productId,
              "Amount paid:",
              item.amount_total || 0,
            )
            purchaseResults.push({ productId, status: "saved", amountPaid: item.amount_total || 0 })
          }
        } catch (itemError) {
          console.error("[v0] Error processing line item:", itemError)
          purchaseResults.push({ productId: "unknown", status: "error", error: itemError.message })
        }
      }

      // Clear cart for authenticated users
      if (userId) {
        try {
          const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", userId)

          if (cartError) {
            console.error("[v0] Error clearing cart:", cartError)
          } else {
            console.log("[v0] Cart cleared for user:", userId)
          }
        } catch (cartError) {
          console.error("[v0] Error clearing cart:", cartError)
        }
      }

      let emailSent = false
      try {
        if (customerEmail && process.env.RESEND_API_KEY) {
          const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-confirmation-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: customerEmail,
              customerName: session.customer_details?.name,
              sessionId: sessionId,
              items: session.metadata?.items ? JSON.parse(session.metadata.items) : [],
              totalAmount: session.amount_total || 0, // Include 0 for free purchases
              currency: session.currency,
              isFree: (session.amount_total || 0) === 0, // Flag for free purchases
            }),
          })

          if (emailResponse.ok) {
            console.log("[v0] Confirmation email sent successfully")
            emailSent = true
          } else {
            console.error("[v0] Failed to send confirmation email:", await emailResponse.text())
          }
        }
      } catch (emailError) {
        console.error("[v0] Error sending confirmation email:", emailError)
      }

      return NextResponse.json({
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
          customer_name: session.customer_details?.name,
          amount_total: session.amount_total || 0, // Include 0 for free purchases
          currency: session.currency,
          created: session.created,
          metadata: session.metadata,
          line_items: session.line_items?.data || [],
        },
        purchasesSaved: purchaseResults.filter((p) => p.status === "saved" || p.status === "already_exists").length > 0,
        purchaseResults,
        cartCleared: !!userId,
        emailSent,
        isFree: (session.amount_total || 0) === 0, // Flag for free purchases
      })
    } catch (stripeError) {
      console.error("[v0] Stripe API error:", stripeError)
      if (stripeError instanceof Error && stripeError.message.includes("No such checkout session")) {
        return NextResponse.json({ error: "Invalid session ID" }, { status: 404 })
      }
      throw stripeError
    }
  } catch (error) {
    console.error("[v0] Error verifying session:", error)
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}

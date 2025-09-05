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

      let checkoutSession = null
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from("checkout_sessions")
          .select("*")
          .eq("session_id", sessionId)
          .single()

        if (sessionError) {
          console.error("[v0] Error fetching checkout session from database:", sessionError)
        } else {
          checkoutSession = sessionData
          console.log("[v0] Found checkout session in database:", checkoutSession.id)
        }
      } catch (dbError) {
        console.error("[v0] Database error fetching checkout session:", dbError)
      }

      if (!checkoutSession) {
        console.error("[v0] No checkout session found in database for session_id:", sessionId)
        return NextResponse.json({ error: "Checkout session not found in database" }, { status: 404 })
      }

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

      const customerEmail = session.customer_details?.email || checkoutSession.user_email
      const products = checkoutSession.products || []

      console.log("[v0] Processing", products.length, "products for purchase recording")

      const purchaseResults = []
      for (const product of products) {
        try {
          const productId = product.id

          if (!productId) {
            console.error("[v0] No product ID found for product:", product)
            continue
          }

          console.log("[v0] Saving purchase for product:", productId, "Amount:", product.price)

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
            amount_paid: product.price * (product.quantity || 1) * 100, // Convert to cents
            currency: session.currency || "usd",
            status: "completed",
            purchased_at: new Date().toISOString(),
            stripe_session_id: sessionId,
          }

          const { error: insertError } = await supabase.from("purchases").insert(purchaseData)

          if (insertError) {
            console.error("[v0] Error inserting purchase:", insertError)
            purchaseResults.push({ productId, status: "error", error: insertError.message })
          } else {
            console.log("[v0] Purchase saved successfully for product:", productId)
            purchaseResults.push({ productId, status: "saved", amountPaid: product.price })
          }
        } catch (itemError) {
          console.error("[v0] Error processing product:", itemError)
          purchaseResults.push({ productId: product.id || "unknown", status: "error", error: itemError.message })
        }
      }

      try {
        const { error: updateError } = await supabase
          .from("checkout_sessions")
          .update({ status: "completed" })
          .eq("session_id", sessionId)

        if (updateError) {
          console.error("[v0] Error updating checkout session status:", updateError)
        } else {
          console.log("[v0] Checkout session marked as completed")
        }
      } catch (updateError) {
        console.error("[v0] Error updating checkout session:", updateError)
      }

      // Clear cart for authenticated users
      if (userId) {
        try {
          const { error: cartError } = await supabase.from("cart").delete().eq("user_id", userId)

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
              items: products,
              totalAmount: checkoutSession.total_amount * 100, // Convert to cents for email
              currency: session.currency,
              isFree: checkoutSession.total_amount === 0,
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
          customer_email: customerEmail,
          customer_name: session.customer_details?.name,
          amount_total: checkoutSession.total_amount * 100, // Convert to cents
          currency: session.currency,
          created: session.created,
          products: products,
        },
        purchasesSaved: purchaseResults.filter((p) => p.status === "saved" || p.status === "already_exists").length > 0,
        purchaseResults,
        cartCleared: !!userId,
        emailSent,
        isFree: checkoutSession.total_amount === 0,
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

import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { db } from "@/lib/db"
import { randomUUID } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("[v0] Verifying session:", sessionId)
    console.log("[v0] Session_id length:", sessionId.length)
    console.log("[v0] Session_id starts with:", sessionId.substring(0, 8))

    if (!stripe) {
      console.error("[v0] Stripe is not configured")
      return NextResponse.json({ error: "Payment verification is currently unavailable" }, { status: 500 })
    }

    let checkoutSession
    try {
      console.log("[v0] Searching for session_id in database:", sessionId)

      // First, let's see what sessions exist in the database for debugging
      try {
        const allSessions = await db.checkout_sessions.findAll()
        console.log("[v0] Total checkout sessions in database:", allSessions.length)
        const storedSessionIds = allSessions.map((s) => s.session_id)
        console.log("[v0] Stored session_ids:", storedSessionIds.slice(0, 5)) // Show first 5 for debugging
        console.log("[v0] Looking for exact match:", sessionId)
        console.log("[v0] Exact match found:", storedSessionIds.includes(sessionId))
      } catch (debugError) {
        console.error("[v0] Error fetching all sessions for debugging:", debugError)
      }

      checkoutSession = await db.checkout_sessions.findOne("session_id", sessionId)

      if (!checkoutSession) {
        console.error("[v0] Checkout session not found in database!")
        console.error("[v0] Requested session_id:", sessionId)
        console.error("[v0] This means either:")
        console.error("[v0] 1. The session was never saved during checkout")
        console.error("[v0] 2. There's a mismatch between stored and requested session_id")
        console.error("[v0] 3. The checkout_sessions table doesn't exist")

        return NextResponse.json(
          {
            error: "Session not found in database",
            details: `No checkout session found with session_id: ${sessionId}`,
            debug: {
              requested_session_id: sessionId,
              session_id_length: sessionId.length,
              session_id_prefix: sessionId.substring(0, 8),
            },
          },
          { status: 404 },
        )
      }

      console.log("[v0] Found checkout session in database:", {
        id: checkoutSession.id,
        session_id: checkoutSession.session_id,
        user_email: checkoutSession.user_email,
        status: checkoutSession.status,
      })
    } catch (dbError) {
      console.error("[v0] Database error during session lookup:", dbError)
      console.error("[v0] Error details:", dbError instanceof Error ? dbError.message : "Unknown error")
      console.error("[v0] This might indicate the checkout_sessions table doesn't exist")

      return NextResponse.json(
        {
          error: "Database error during session verification",
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
          debug: {
            requested_session_id: sessionId,
            error_type: "database_lookup_failed",
          },
        },
        { status: 500 },
      )
    }

    let stripeSession
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "customer"],
      })

      console.log("[v0] Session retrieved from Stripe:", {
        id: stripeSession.id,
        payment_status: stripeSession.payment_status,
        customer_email: stripeSession.customer_details?.email,
        amount_total: stripeSession.amount_total,
      })
    } catch (stripeError) {
      console.error("[v0] Stripe API error:", stripeError)
      return NextResponse.json(
        {
          error: "Failed to retrieve session from Stripe",
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
        },
        { status: 500 },
      )
    }

    if (stripeSession.payment_status !== "paid" && stripeSession.payment_status !== "no_payment_required") {
      console.log("[v0] Payment not completed, status:", stripeSession.payment_status)
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const customerEmail = stripeSession.customer_details?.email || checkoutSession.user_email
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

        const existingPurchases = await db.purchases.findBy("product_id", productId)
        const existingPurchase = existingPurchases.find(
          (p) =>
            p.status === "completed" && (p.customer_email === customerEmail || p.user_id === checkoutSession.user_id),
        )

        if (existingPurchase) {
          console.log("[v0] Purchase already exists for product:", productId)
          purchaseResults.push({ productId, status: "already_exists" })
          continue
        }

        const purchaseData = {
          id: randomUUID(),
          user_id: checkoutSession.user_id || null, // Use user_id from checkout session
          product_id: productId,
          customer_email: customerEmail, // Add customer_email for guest fallback
          amount: product.price * (product.quantity || 1) * 100,
          currency: stripeSession.currency || "usd",
          status: "completed",
          purchased_at: new Date().toISOString(), // Add purchased_at timestamp
          stripe_session_id: sessionId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        try {
          await db.purchases.insert(purchaseData)
          console.log("[v0] Purchase saved successfully for product:", productId, "for user:", checkoutSession.user_id)
          purchaseResults.push({ productId, status: "saved", amountPaid: product.price })
        } catch (insertError) {
          // Check if it's a duplicate key error
          if (insertError instanceof Error && insertError.message.includes("duplicate")) {
            console.log("[v0] Purchase already exists (duplicate key) for product:", productId)
            purchaseResults.push({ productId, status: "already_exists" })
          } else {
            throw insertError // Re-throw if it's not a duplicate error
          }
        }
      } catch (itemError) {
        console.error("[v0] Error processing product:", itemError)
        purchaseResults.push({
          productId: product.id || "unknown",
          status: "error",
          error: itemError instanceof Error ? itemError.message : "Unknown error",
        })
      }
    }

    try {
      await db.checkout_sessions.update(checkoutSession.id, {
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      console.log("[v0] Checkout session marked as completed")
    } catch (updateError) {
      console.error("[v0] Error updating checkout session:", updateError)
    }

    if (checkoutSession.user_id) {
      try {
        const cartItems = await db.cart.findBy("user_id", checkoutSession.user_id)
        for (const item of cartItems) {
          await db.cart.delete(item.id)
        }
        console.log("[v0] Cart cleared for user:", checkoutSession.user_id)
      } catch (cartError) {
        console.error("[v0] Error clearing cart:", cartError)
      }
    }

    return NextResponse.json({
      session: {
        id: stripeSession.id,
        payment_status: stripeSession.payment_status,
        customer_email: customerEmail,
        customer_name: stripeSession.customer_details?.name,
        amount_total: checkoutSession.total_amount * 100,
        currency: stripeSession.currency,
        created: stripeSession.created,
        products: products,
      },
      purchasesSaved: purchaseResults.filter((p) => p.status === "saved" || p.status === "already_exists").length > 0,
      purchaseResults,
      cartCleared: !!checkoutSession.user_id,
      isFree: checkoutSession.total_amount === 0,
    })
  } catch (error) {
    console.error("[v0] Unexpected error in verify-session:", error)
    return NextResponse.json(
      {
        error: "Failed to verify session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

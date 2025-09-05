import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    if (!stripe) {
      console.error("[v0] Stripe is not configured. Missing STRIPE_SECRET_KEY environment variable.")
      return NextResponse.json(
        { error: "Payment verification is currently unavailable. Please contact support." },
        { status: 500 },
      )
    }

    console.log("[v0] Verifying session:", sessionId)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[v0] Supabase environment variables not configured")
      return NextResponse.json(
        {
          error: "Database connection failed. Please ensure Supabase is properly configured.",
          details: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables",
        },
        { status: 500 },
      )
    }

    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "line_items.data.price.product", "customer", "payment_intent"],
      })

      console.log("[v0] Session retrieved from Stripe:", {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
      })
    } catch (stripeError) {
      console.error("[v0] Stripe API error:", stripeError)
      if (stripeError instanceof Error && stripeError.message.includes("No such checkout session")) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }
      return NextResponse.json(
        {
          error: "Failed to retrieve session from Stripe",
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
        },
        { status: 500 },
      )
    }

    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
      console.log("[v0] Payment not completed, status:", session.payment_status)
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    let supabase
    try {
      const cookieStore = cookies()
      supabase = createServerClient(cookieStore)
    } catch (supabaseInitError) {
      console.error("[v0] Failed to initialize Supabase client:", supabaseInitError)
      return NextResponse.json(
        {
          error: "Database connection failed during initialization",
          details: supabaseInitError instanceof Error ? supabaseInitError.message : "Unknown database error",
        },
        { status: 500 },
      )
    }

    let checkoutSession = null
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from("checkout_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .single()

      if (sessionError) {
        console.error("[v0] Database error fetching checkout session:", sessionError)

        if (sessionError.code === "PGRST116") {
          return NextResponse.json(
            {
              error: "Checkout session not found in database",
              details: "Session was not saved during checkout creation",
            },
            { status: 404 },
          )
        }

        return NextResponse.json(
          {
            error: "Database error during session verification",
            details: sessionError.message,
          },
          { status: 500 },
        )
      }

      checkoutSession = sessionData
      console.log("[v0] Found checkout session in database:", checkoutSession.id)
    } catch (dbError) {
      console.error("[v0] Database error during session lookup:", dbError)
      return NextResponse.json(
        {
          error: "Database error during session verification",
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
        { status: 500 },
      )
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
          .or(userId ? `user_id.eq.${userId},customer_email.eq.${customerEmail}` : `customer_email.eq.${customerEmail}`)
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
          amount_paid: product.price * (product.quantity || 1) * 100,
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
            totalAmount: checkoutSession.total_amount * 100,
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
        amount_total: checkoutSession.total_amount * 100,
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

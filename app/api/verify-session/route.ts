import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"

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
        expand: ["line_items", "customer", "payment_intent"],
      })

      console.log("[v0] Session retrieved:", {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
      })

      if (session.payment_status !== "paid") {
        console.log("[v0] Payment not completed, status:", session.payment_status)
        return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
      }

      return NextResponse.json({
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
          customer_name: session.customer_details?.name,
          amount_total: session.amount_total,
          currency: session.currency,
          created: session.created,
          metadata: session.metadata,
          line_items: session.line_items?.data || [],
        },
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

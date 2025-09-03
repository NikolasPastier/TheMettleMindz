import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      console.error("Stripe is not configured")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
    }

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.error("Missing stripe-signature header")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing STRIPE_WEBHOOK_SECRET")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 })
    }

    // Verify the webhook event
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object
        console.log("Checkout session completed:", session.id)

        // Mark purchase in purchases table
        try {
          await sql`
            INSERT INTO purchases (
              user_id,
              product_id,
              amount,
              currency,
              status,
              stripe_session_id
            ) VALUES (
              ${session.customer || null},
              ${session.metadata?.product_id || "unknown"},
              ${session.amount_total ? session.amount_total / 100 : 0},
              ${session.currency || "usd"},
              'paid',
              ${session.id}
            )
          `
          console.log("Purchase recorded successfully")
        } catch (dbError) {
          console.error("Failed to record purchase:", dbError)
        }
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log("Payment succeeded:", paymentIntent.id)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log("Payment failed:", failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}

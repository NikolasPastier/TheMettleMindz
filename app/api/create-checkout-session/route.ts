import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      console.error("Stripe is not configured. Missing STRIPE_SECRET_KEY environment variable.")
      return NextResponse.json(
        {
          error: "Payment processing is currently unavailable. Please contact support.",
          details: "Stripe configuration missing",
        },
        { status: 503 },
      )
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Create line items for Stripe with enhanced metadata
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.category || "Digital Product",
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.id,
            category: item.category || "digital",
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }))

    // Create Stripe checkout session with enhanced configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      customer_creation: "always",
      payment_intent_data: {
        metadata: {
          order_type: "digital_products",
        },
      },
      metadata: {
        items: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity || 1,
            price: item.price,
          })),
        ),
        total_items: items.length.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

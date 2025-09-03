import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { ensureStripeConfigured } from "@/lib/stripe-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const stripe = ensureStripeConfigured()

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

    if (!session.customer_email) {
      return NextResponse.json({ error: "No customer email found" }, { status: 400 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Check if purchase already recorded
    const { data: existingPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .single()

    if (existingPurchase) {
      return NextResponse.json({ message: "Purchase already recorded" })
    }

    let items = []
    if (session.metadata?.items) {
      try {
        items = JSON.parse(session.metadata.items)
      } catch (parseError) {
        console.error("Error parsing items from session metadata:", parseError)
        // Fallback to single item from line_items
        const lineItem = session.line_items?.data[0]
        if (lineItem) {
          items = [
            {
              id: session.metadata?.product_ids?.split(",")[0] || "unknown",
              title: lineItem.description || "Unknown Product",
              quantity: lineItem.quantity || 1,
              price: (lineItem.amount_total || 0) / 100,
            },
          ]
        }
      }
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "No items found in session" }, { status: 400 })
    }

    const purchasePromises = items.map((item: any) => {
      return supabase.from("purchases").insert({
        user_id: user?.id || null, // Allow null for guest purchases
        product_id: item.id,
        amount: item.price * (item.quantity || 1),
        currency: session.currency || "usd",
        status: session.payment_status === "paid" ? "paid" : "pending",
        stripe_session_id: sessionId,
        purchased_at: new Date().toISOString(),
      })
    })

    const results = await Promise.all(purchasePromises)

    // Check for any errors
    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      console.error("Error recording purchases:", errors)
      return NextResponse.json({ error: "Failed to record some purchases" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Purchase recorded successfully",
      itemsRecorded: items.length,
    })
  } catch (error) {
    console.error("Error in record-purchase:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

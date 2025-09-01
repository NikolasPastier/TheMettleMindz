import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

    if (!session.customer_email) {
      return NextResponse.json({ error: "No customer email found" }, { status: 400 })
    }

    // Get user by email
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if purchase already recorded
    const { data: existingPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .single()

    if (existingPurchase) {
      return NextResponse.json({ message: "Purchase already recorded" })
    }

    // Record the purchase
    const lineItem = session.line_items?.data[0]
    const { error: insertError } = await supabase.from("purchases").insert({
      user_id: user.id,
      product_id: session.metadata?.productId || "unknown",
      product_name: lineItem?.description || "Unknown Product",
      amount: (session.amount_total || 0) / 100,
      stripe_session_id: sessionId,
      status: "completed",
    })

    if (insertError) {
      console.error("Error recording purchase:", insertError)
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 })
    }

    return NextResponse.json({ message: "Purchase recorded successfully" })
  } catch (error) {
    console.error("Error in record-purchase:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

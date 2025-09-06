import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { db } from "@/lib/db"
import { randomUUID } from "crypto"

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

    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000"

    // Ensure baseUrl has protocol
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`
    }

    // Ensure baseUrl doesn't end with slash
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

    // Validate URL format
    try {
      new URL(cleanBaseUrl)
    } catch (urlError) {
      console.error("[v0] Invalid base URL:", cleanBaseUrl)
      return NextResponse.json({ error: "Invalid application URL configuration" }, { status: 500 })
    }

    console.log("[v0] Base URL for checkout:", cleanBaseUrl)

    const { cartItems, userEmail, discount } = await request.json()

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required for checkout" }, { status: 400 })
    }

    let userId = null
    try {
      const { createServerClient } = await import("@/lib/supabase/server")
      const { cookies } = await import("next/headers")
      const supabase = createServerClient(cookies())

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (user && !authError) {
        userId = user.id
        console.log("[v0] Found authenticated user:", userId)
      } else {
        console.log("[v0] No authenticated user found, proceeding with email only")
      }
    } catch (authError) {
      console.error("[v0] Error getting user from auth:", authError)
    }

    console.log("[v0] Processing checkout for user:", userEmail)
    console.log("[v0] User ID:", userId)
    console.log("[v0] Cart items:", cartItems)

    const originalTotal = cartItems.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0)

    const lineItems = cartItems.map((item: any) => {
      let imageUrl = ""
      if (item.image) {
        if (item.image.startsWith("http://") || item.image.startsWith("https://")) {
          imageUrl = item.image
        } else if (item.image.startsWith("/")) {
          imageUrl = `${cleanBaseUrl}${item.image}`
        } else {
          imageUrl = `${cleanBaseUrl}/${item.image}`
        }
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.category || "Digital Product",
            images: imageUrl ? [imageUrl] : [],
            metadata: {
              product_id: item.id,
            },
          },
          unit_amount: Math.max(0, Math.round(item.price * 100)), // Allow $0.00 for free items
        },
        quantity: item.quantity || 1,
      }
    })

    let discountAmount = 0
    let validCouponId = null

    if (discount && discount.code) {
      const validDiscountCodes = {
        DISCOUNT100: { type: "percentage", value: 100 },
      }

      const discountCode = validDiscountCodes[discount.code as keyof typeof validDiscountCodes]
      if (discountCode) {
        if (discountCode.type === "percentage") {
          discountAmount = (originalTotal * discountCode.value) / 100
        }
        discountAmount = Math.min(discountAmount, originalTotal)
        console.log("[v0] Discount applied:", discount.code, "Amount:", discountAmount)
      }
    }

    const finalTotal = Math.max(0, originalTotal - discountAmount)

    const sessionConfig: any = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${cleanBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cleanBaseUrl}/cart`,
      customer_email: userEmail, // Set customer email as required
      metadata: {
        user_email: userEmail.substring(0, 490),
        item_count: cartItems.length.toString(),
      },
    }

    if (finalTotal === 0 && discountAmount > 0) {
      try {
        const coupon = await stripe.coupons.create({
          percent_off: 100,
          duration: "once",
          name: `${discount.code} - 100% Off`,
        })
        sessionConfig.discounts = [{ coupon: coupon.id }]
        validCouponId = coupon.id
        console.log("[v0] Created 100% discount coupon:", coupon.id)
      } catch (couponError) {
        console.error("[v0] Error creating discount coupon:", couponError)
        return NextResponse.json(
          {
            error: "Failed to apply discount code",
            details: couponError instanceof Error ? couponError.message : "Unknown coupon error",
          },
          { status: 400 },
        )
      }
    }

    let session
    try {
      session = await stripe.checkout.sessions.create(sessionConfig)
      console.log("[v0] Checkout session created successfully:", session.id)
      console.log("[v0] Session success URL will be:", session.success_url)
    } catch (stripeError) {
      console.error("[v0] Stripe session creation failed:", stripeError)

      let errorMessage = "Failed to create checkout session"
      let errorDetails = "Unknown Stripe error"

      if (stripeError instanceof Error) {
        errorDetails = stripeError.message

        if (stripeError.message.includes("metadata")) {
          errorMessage = "Checkout data too large"
        } else if (stripeError.message.includes("line_items")) {
          errorMessage = "Invalid product configuration"
        } else if (stripeError.message.includes("amount")) {
          errorMessage = "Invalid price amount"
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
        },
        { status: 400 },
      )
    }

    try {
      console.log("[v0] Testing v0 database connection...")

      const productsData = cartItems.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.category || "Digital Product",
        price: item.price,
        quantity: item.quantity || 1,
      }))

      console.log("[v0] Attempting to save checkout session to database...")
      console.log("[v0] Session ID:", session.id)
      console.log("[v0] User email:", userEmail)
      console.log("[v0] User ID:", userId)
      console.log("[v0] Products count:", productsData.length)

      const checkoutSessionData = {
        id: randomUUID(),
        session_id: session.id,
        user_email: userEmail,
        user_id: userId,
        products: productsData,
        total_amount: finalTotal,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Storing session_id in database:", session.id)
      console.log("[v0] Session_id length:", session.id.length)
      console.log("[v0] Session_id starts with:", session.id.substring(0, 8))

      const insertedSession = await db.checkout_sessions.insert(checkoutSessionData)

      if (insertedSession) {
        console.log("[v0] Checkout session saved successfully to database:", insertedSession.id)
        console.log("[v0] Stored session_id:", insertedSession.session_id)
        console.log("[v0] Cart saved to database with pending status for user:", userEmail)
      } else {
        console.error("[v0] Failed to save checkout session - no data returned")
      }
    } catch (dbError) {
      console.error("[v0] Database error saving checkout session:", dbError)
      console.error("[v0] This will prevent session verification from working!")
    }

    return NextResponse.json({
      sessionId: session.id,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)

    let errorMessage = "Failed to create checkout session"
    let errorDetails = "Unknown error"

    if (error instanceof Error) {
      errorDetails = error.message
      console.error("[v0] Error details:", error.message)

      // Handle specific Stripe errors
      if (error.message.includes("Invalid")) {
        errorMessage = "Invalid checkout configuration"
      } else if (error.message.includes("currency")) {
        errorMessage = "Currency configuration error"
      } else if (error.message.includes("amount")) {
        errorMessage = "Invalid amount specified"
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"

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

    const { items, discount } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    const originalTotal = items.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0)

    const lineItems = items.map((item: any) => {
      let imageUrl = ""
      if (item.image) {
        if (item.image.startsWith("http://") || item.image.startsWith("https://")) {
          // Already an absolute URL
          imageUrl = item.image
        } else if (item.image.startsWith("/")) {
          // Relative path, convert to absolute URL
          imageUrl = `${cleanBaseUrl}${item.image}`
        } else {
          // Relative path without leading slash
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
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }
    })

    let discountAmount = 0
    if (discount && discount.code && discount.amount) {
      // Server-side validation of discount code
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

    if (finalTotal === 0) {
      // For free products, create a session with $0.01 and then apply 100% discount
      lineItems.forEach((item) => {
        item.price_data.unit_amount = 1 // $0.01 minimum for Stripe
      })
    }

    const metadata = {
      items: JSON.stringify(
        items.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      ),
      ...(discount && {
        discount_code: discount.code,
        discount_amount: discountAmount.toString(),
        original_total: originalTotal.toString(),
        final_total: finalTotal.toString(),
      }),
    }

    const successUrl = `${cleanBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${cleanBaseUrl}/cart`

    console.log("[v0] Success URL:", successUrl)
    console.log("[v0] Cancel URL:", cancelUrl)

    const sessionConfig: any = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    }

    if (finalTotal === 0 && discountAmount > 0) {
      // Create a 100% discount coupon for free products
      try {
        const coupon = await stripe.coupons.create({
          percent_off: 100,
          duration: "once",
          name: `${discount.code} - 100% Off`,
        })
        sessionConfig.discounts = [{ coupon: coupon.id }]
      } catch (couponError) {
        console.error("Error creating discount coupon:", couponError)
        // Fallback: allow the session to proceed without the coupon
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
    }
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

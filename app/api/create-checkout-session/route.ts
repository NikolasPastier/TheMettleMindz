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
              product_id: item.id, // Include product_id in product metadata
            },
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: 1, // Always set to 1 for digital products
      }
    })

    let discountAmount = 0
    const validCouponId = null

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

    if (finalTotal === 0 && discountAmount > 0) {
      lineItems.forEach((item) => {
        item.price_data.unit_amount = 1 // $0.01 minimum for Stripe
      })
    }

    const metadata = {
      items: JSON.stringify(
        items.map((item: any) => ({
          id: item.id,
          title: item.title,
          product_id: item.id, // Explicitly include product_id for v0 compatibility
          price: item.price,
          quantity: item.quantity || 1,
        })),
      ),
      original_total: originalTotal.toString(),
      final_total: finalTotal.toString(),
      ...(discount &&
        discount.code && {
          discount_code: discount.code,
          discount_amount: discountAmount.toString(),
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
      try {
        const coupon = await stripe.coupons.create({
          percent_off: 100,
          duration: "once",
          name: `${discount.code} - 100% Off`,
        })
        sessionConfig.discounts = [{ coupon: coupon.id }]
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

    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log("[v0] Checkout session created:", session.id)
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
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

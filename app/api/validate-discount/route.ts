import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, total } = await request.json()

    const validDiscountCodes = {
      DISCOUNT100: {
        type: "percentage",
        value: 100, // 100% discount
        description: "100% Off Everything",
      },
    }

    const discountCode = validDiscountCodes[code as keyof typeof validDiscountCodes]

    if (!discountCode) {
      return NextResponse.json({ valid: false, message: "Invalid discount code" }, { status: 400 })
    }

    let discountAmount = 0
    if (discountCode.type === "percentage") {
      discountAmount = (total * discountCode.value) / 100
    }

    discountAmount = Math.min(discountAmount, total)

    return NextResponse.json({
      valid: true,
      code: code,
      discountAmount: discountAmount,
      description: discountCode.description,
    })
  } catch (error) {
    console.error("Discount validation error:", error)
    return NextResponse.json({ valid: false, message: "Failed to validate discount code" }, { status: 500 })
  }
}

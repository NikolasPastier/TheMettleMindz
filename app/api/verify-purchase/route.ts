import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] verify-purchase: No authenticated user")
      return NextResponse.json({
        hasPurchased: false,
        purchase: null,
      })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log("[v0] verify-purchase: Checking access for user:", user.id, "email:", user.email, "product:", productId)

    const { data: allUserPurchases, error: allPurchasesError } = await supabase
      .from("purchases")
      .select("*")
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)

    if (allPurchasesError) {
      console.error("[v0] Error fetching all user purchases:", allPurchasesError)
    } else {
      console.log("[v0] All user purchases:", allUserPurchases)
    }

    const { data: productPurchases, error: productError } = await supabase
      .from("purchases")
      .select("*")
      .eq("product_id", productId)

    if (productError) {
      console.error("[v0] Error fetching product purchases:", productError)
    } else {
      console.log("[v0] All purchases for product", productId + ":", productPurchases)
    }

    const { data: purchase, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("product_id", productId)
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
      .in("status", ["completed", "paid"])
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error checking purchase:", error)
      return NextResponse.json({ error: "Failed to verify purchase" }, { status: 500 })
    }

    console.log(
      "[v0] Purchase found:",
      !!purchase,
      purchase ? `Status: ${purchase.status}, Amount: ${purchase.amount}` : "No purchase",
    )

    return NextResponse.json({
      hasPurchased: !!purchase,
      purchase: purchase || null,
    })
  } catch (error) {
    console.error("[v0] Error in verify-purchase:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

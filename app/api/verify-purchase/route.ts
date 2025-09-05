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
      return NextResponse.json({
        hasPurchased: false,
        purchase: null,
      })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const { data: purchase, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("product_id", productId)
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
      .in("status", ["completed", "paid"])
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking purchase:", error)
      return NextResponse.json({ error: "Failed to verify purchase" }, { status: 500 })
    }

    return NextResponse.json({
      hasPurchased: !!purchase,
      purchase: purchase || null,
    })
  } catch (error) {
    console.error("Error in verify-purchase:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

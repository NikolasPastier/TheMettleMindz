import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { purchasedItems, sessionId } = await request.json()

    if (!purchasedItems || !Array.isArray(purchasedItems)) {
      return NextResponse.json({ error: "Purchased items required" }, { status: 400 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (user) {
      const productIds = purchasedItems.map((item: any) => item.id)

      const { error: deleteError } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .in("product_id", productIds)

      if (deleteError) {
        console.error("Error clearing cart:", deleteError)
        return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
      }

      console.log("[v0] Cart cleared for user:", user.id, "Items:", productIds.length)
    } else {
      // For guest users, we'll rely on frontend cart clearing
      console.log("[v0] Guest user cart will be cleared on frontend")
    }

    return NextResponse.json({
      message: "Cart cleared successfully",
      itemsCleared: purchasedItems.length,
    })
  } catch (error) {
    console.error("Error in clear-cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

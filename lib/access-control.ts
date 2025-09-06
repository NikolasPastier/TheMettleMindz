import { createBrowserClient } from "@/lib/supabase/client"

export interface AccessControlResult {
  hasAccess: boolean
  purchase?: any
  error?: string
}

export async function checkCourseAccess(productId: string): Promise<AccessControlResult> {
  try {
    const supabase = createBrowserClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { hasAccess: false, error: "Authentication required" }
    }

    // Check if user has purchased this product
    const { data: purchases, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "completed")
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)

    if (error && error.code !== "PGRST116") {
      console.error("Error checking purchase:", error)
      return { hasAccess: false, error: "Failed to verify access" }
    }

    const purchase = purchases && purchases.length > 0 ? purchases[0] : null

    if (purchase) {
      console.log(
        "[v0] Course access granted for product:",
        productId,
        "Purchase amount:",
        purchase.amount,
        "Type:",
        purchase.amount === 0 ? "FREE" : "PAID",
      )
    }

    return {
      hasAccess: !!purchase,
      purchase: purchase || null,
    }
  } catch (error) {
    console.error("Error in checkCourseAccess:", error)
    return { hasAccess: false, error: "Access verification failed" }
  }
}

export const COURSE_PRODUCTS = {
  THEME_PAGE_MASTERCLASS: "theme-page-masterclass",
  CHAMPIONS_MINDSET: "champions-mindset",
  VIRAL_CLIP_PACK: "viral-clip-pack-bundle",
  THEME_PAGE_EBOOK: "theme-page-masterclass-ebook",
} as const

export function getCourseUrl(productId: string): string {
  switch (productId) {
    case COURSE_PRODUCTS.THEME_PAGE_MASTERCLASS:
      return "/course/theme-page-masterclass"
    case COURSE_PRODUCTS.CHAMPIONS_MINDSET:
      return "/products/champions-mindset"
    case COURSE_PRODUCTS.VIRAL_CLIP_PACK:
      return "/products/viral-clip-pack-bundle"
    case COURSE_PRODUCTS.THEME_PAGE_EBOOK:
      return "/products/theme-page-masterclass-ebook"
    default:
      return "/account"
  }
}

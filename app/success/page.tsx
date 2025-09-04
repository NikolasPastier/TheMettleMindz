"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface PurchasedItem {
  id: string
  title: string
  quantity: number
  price?: number
}

interface SessionData {
  id: string
  payment_status: string
  customer_email: string
  customer_name?: string
  amount_total: number
  currency: string
  created: number
  metadata: {
    items: string
    total_items?: string
  }
  line_items?: any[]
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [purchaseRecorded, setPurchaseRecorded] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.log("[v0] Auth error (continuing without login):", authError.message)
        } else {
          console.log("[v0] User authenticated:", user?.email || "No email")
          setUser(user)
        }
      } catch (error) {
        console.log("[v0] User not logged in, continuing without account integration")
      }
    }

    checkUser()

    if (!sessionId) {
      setError("No session ID found. Please check your payment confirmation email.")
      setLoading(false)
      return
    }

    const verifySession = async () => {
      try {
        console.log("[v0] Starting session verification for:", sessionId)

        const response = await fetch(`/api/verify-session?session_id=${sessionId}`)

        console.log("[v0] Verify session response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("[v0] Session verification failed:", errorData)
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to verify payment`)
        }

        const data = await response.json()
        console.log("[v0] Session verification successful:", data.session?.id)

        if (!data.session) {
          throw new Error("Invalid session data received")
        }

        setSessionData(data.session)

        try {
          console.log("[v0] Recording purchase for session:", sessionId)

          const recordResponse = await fetch("/api/record-purchase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: sessionId,
            }),
          })

          if (recordResponse.ok) {
            const recordData = await recordResponse.json()
            console.log("[v0] Purchase recorded successfully")
            setPurchaseRecorded(true)

            if (typeof window !== "undefined") {
              // Clear localStorage cart for guest users
              localStorage.removeItem("cart")
              localStorage.removeItem("cartItems")
              console.log("[v0] Frontend cart cleared")
            }
          } else {
            const errorText = await recordResponse.text()
            console.error("[v0] Failed to record purchase:", errorText)
          }
        } catch (recordError) {
          console.error("[v0] Error recording purchase:", recordError)
        }

        if (data.session.metadata?.items) {
          try {
            const items = JSON.parse(data.session.metadata.items)
            if (Array.isArray(items)) {
              console.log("[v0] Parsed purchased items:", items.length)
              setPurchasedItems(items)
            } else {
              console.error("[v0] Items is not an array:", items)
            }
          } catch (parseError) {
            console.error("[v0] Error parsing purchased items:", parseError)
            // Continue without items if parsing fails
          }
        } else {
          console.log("[v0] No items metadata found in session")
        }
      } catch (err) {
        console.error("[v0] Session verification error:", err)
        setError(err instanceof Error ? err.message : "Unable to verify your purchase")
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [sessionId])

  const getDownloadLink = (itemId: string) => {
    const downloadLinks: Record<string, string> = {
      "champions-mindset": "https://drive.google.com/uc?export=download&id=1-hXEHZ26npEmE9TioMBZNAQdlPeGBNIE",
      "theme-page-masterclass": "/course/theme-page-masterclass", // Link to course page instead of download
      "theme-page-masterclass-ebook":
        "https://drive.google.com/uc?export=download&id=1UEEeyznbNAlU2ryw-nPVxL6FNrEeiUjO",
      "viral-clip-pack-bundle": "https://drive.google.com/uc?export=download&id=VIRAL_CLIP_PACK_FILE_ID",
    }
    return downloadLinks[itemId] || `/downloads/${itemId}.pdf`
  }

  const getItemDescription = (itemId: string) => {
    const descriptions: Record<string, string> = {
      "champions-mindset": "Complete e-book with bonus materials and 60-day roadmap",
      "theme-page-masterclass": "Video course with templates and resources - Access your course now!",
      "theme-page-masterclass-ebook":
        "E-book version with comprehensive guide and templates for viral content creation",
      "viral-clip-pack-bundle":
        "Complete collection of viral video clips, templates, and editing resources for engaging social media content",
    }
    return descriptions[itemId] || "Digital product with instant access"
  }

  const getActionText = (itemId: string) => {
    return itemId === "theme-page-masterclass" ? "Access Course" : "Download"
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black Marble Background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="pt-20 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
              <p className="text-white text-lg">Verifying your purchase...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black Marble Background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="pt-20 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <Alert className="bg-red-500/10 border-red-500/20 max-w-md mx-auto rounded-2xl">
                <AlertDescription className="text-red-400">
                  {error || "Unable to verify your purchase. Please contact support with your order details."}
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 justify-center mt-6">
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold">
                  <Link href="/">Return Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/cart">Back to Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/black-marble-background.jpg"
          alt="Black Marble Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="pt-20 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <svg
              className="w-20 h-20 text-green-400 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Thank you for your purchase. Your digital products are ready for instant access.
            </p>
            {sessionData?.customer_name && (
              <p className="text-gray-400 mt-2">Welcome to the champion mindset, {sessionData.customer_name}!</p>
            )}
            {purchaseRecorded && (
              <Alert className="bg-green-500/10 border-green-500/20 max-w-md mx-auto mt-4">
                <AlertDescription className="text-green-400">
                  {user
                    ? "Your purchase has been added to your account for future access."
                    : "Your purchase has been recorded. Create an account to access your products anytime!"}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Download Links */}
            <div className="lg:col-span-2">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Your Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {purchasedItems.length > 0 ? (
                    purchasedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{getItemDescription(item.id)}</p>
                          {item.quantity > 1 && <p className="text-red-400 text-sm">Quantity: {item.quantity}</p>}
                        </div>
                        <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold">
                          {item.id === "theme-page-masterclass" ? (
                            <Link href={getDownloadLink(item.id)}>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3h7m3-10l3 3m-3-3v8"
                                />
                              </svg>
                              {getActionText(item.id)}
                            </Link>
                          ) : (
                            <a
                              href={getDownloadLink(item.id)}
                              download={item.id === "champions-mindset" ? undefined : true}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              {getActionText(item.id)}
                            </a>
                          )}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No items found. Please contact support.</p>
                    </div>
                  )}

                  <Alert className="bg-blue-500/10 border-blue-500/20">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <AlertDescription className="text-blue-400">
                      A confirmation email with download links has been sent to {sessionData?.customer_email}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Start Learning</h4>
                      <p className="text-gray-400 text-sm">
                        Begin your transformation journey with your new digital products.
                      </p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Join Community</h4>
                      <p className="text-gray-400 text-sm">Connect with other champions and share your progress.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Order ID</span>
                    <span className="text-xs font-mono">{sessionData?.id.slice(-8).toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Email</span>
                    <span className="text-xs break-all">{sessionData?.customer_email}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Status</span>
                    <span className="text-green-400 capitalize font-semibold">{sessionData?.payment_status}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Date</span>
                    <span className="text-xs">{new Date(sessionData.created * 1000).toLocaleDateString()}</span>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total Paid</span>
                    <span>${sessionData ? (sessionData.amount_total / 100).toFixed(2) : "0.00"}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {user ? (
                  <Button asChild size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">
                    <Link href="/account">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      View My Account
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">
                    <Link href="/auth/register?returnTo=/account">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Create Account to Save Products
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Link href="/">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Return Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

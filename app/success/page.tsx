"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

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
  const { addPurchase } = useAuth()

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Please check your payment confirmation email.")
      setLoading(false)
      return
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to verify payment`)
        }

        const data = await response.json()

        if (!data.session) {
          throw new Error("Invalid session data received")
        }

        setSessionData(data.session)

        if (data.session.metadata?.items) {
          try {
            const items = JSON.parse(data.session.metadata.items)
            if (Array.isArray(items)) {
              setPurchasedItems(items)

              // Add purchases to user account
              items.forEach((item: PurchasedItem) => {
                if (item.id) {
                  addPurchase(item.id)
                }
              })
            }
          } catch (parseError) {
            console.error("Error parsing purchased items:", parseError)
            // Continue without items if parsing fails
          }
        }
      } catch (err) {
        console.error("Session verification error:", err)
        setError(err instanceof Error ? err.message : "Unable to verify your purchase")
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [sessionId, addPurchase])

  const getDownloadLink = (itemId: string) => {
    const downloadLinks: Record<string, string> = {
      "champions-mindset": "/downloads/champions-mindset.pdf",
      "theme-page-masterclass": "/downloads/theme-page-masterclass.zip",
      "viral-clip-pack-bundle": "/downloads/viral-clip-pack-bundle.zip",
    }
    return downloadLinks[itemId] || `/downloads/${itemId}.pdf`
  }

  const getItemDescription = (itemId: string) => {
    const descriptions: Record<string, string> = {
      "champions-mindset": "Complete e-book with bonus materials and 60-day roadmap",
      "theme-page-masterclass": "Video course with templates and resources",
      "viral-clip-pack-bundle": "100+ viral clips with editing templates",
    }
    return descriptions[itemId] || "Digital product with instant access"
  }

  if (loading) {
    return (
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
            <p className="text-white text-lg">Verifying your purchase...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div className="pt-20 pb-16">
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
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Link href="/cart">Back to Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <svg className="w-20 h-20 text-green-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thank you for your purchase. Your digital products are ready for instant download.
          </p>
          {sessionData.customer_name && (
            <p className="text-gray-400 mt-2">Welcome to the champion mindset, {sessionData.customer_name}!</p>
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
                  Your Downloads
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
                        <a href={getDownloadLink(item.id)} download>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No download items found. Please contact support.</p>
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
                    Download links have also been sent to {sessionData?.customer_email}
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
              <Button asChild size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">
                <Link href="/account">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  View My Account
                </Link>
              </Button>

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
  )
}

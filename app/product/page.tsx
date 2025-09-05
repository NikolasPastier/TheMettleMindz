"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { createBrowserClient } from "@/lib/supabase/client"

interface Purchase {
  id: string
  product_id: string
  status: string
  purchased_at: string
}

export default function ProductPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) {
        setError("Please log in to access your purchased products.")
        setLoading(false)
        return
      }

      try {
        const supabase = createBrowserClient()

        const { data: purchasesData, error: purchasesError } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "paid")

        if (purchasesError) {
          throw new Error(purchasesError.message)
        }

        setPurchases(purchasesData || [])
      } catch (err) {
        console.error("Error fetching purchases:", err)
        setError(err instanceof Error ? err.message : "Failed to load your purchases")
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [user])

  const hasChampionsMindsetAccess = purchases.some(
    (purchase) => purchase.product_id === "champions-mindset" && purchase.status === "paid",
  )

  const hasThemePageEbookAccess = purchases.some(
    (purchase) => purchase.product_id === "theme-page-masterclass-ebook" && purchase.status === "paid",
  )

  const hasViralClipPackAccess = purchases.some(
    (purchase) => purchase.product_id === "viral-clip-pack-bundle" && purchase.status === "paid",
  )

  const handleDownload = () => {
    const downloadUrl = "https://drive.google.com/uc?export=download&id=1-hXEHZ26npEmE9TioMBZNAQdlPeGBNIE"
    window.open(downloadUrl, "_blank")
  }

  const handleThemePageEbookDownload = () => {
    const downloadUrl = "https://drive.google.com/uc?export=download&id=1UEEeyznbNAlU2ryw-nPVxL6FNrEeiUjO"
    window.open(downloadUrl, "_blank")
  }

  const handleViralClipPackDownload = () => {
    const downloadUrl = "https://drive.google.com/uc?export=download&id=1yqyU1kv5-jZv5XNDWZ5e1yEok0KTjMP0"
    window.open(downloadUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/black-marble-background.jpg" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
              <p className="text-white text-lg">Loading your products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/black-marble-background.jpg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Products</h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              Access your purchased digital products and start your transformation journey.
            </p>
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 max-w-md mx-auto mb-8 rounded-2xl">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {!user ? (
            <Card className="bg-black/60 border-white/20 backdrop-blur-sm rounded-2xl max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="text-white text-xl font-semibold mb-2">Login Required</h3>
                <p className="text-white/60 mb-6">Please log in to access your purchased products.</p>
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold">
                  <Link href="/auth/login">Login to Continue</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Champions Mindset Product */}
              <Card className="bg-black/60 border-white/20 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Champions Mindset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white/80 mb-2">
                        Complete e-book with bonus materials and 60-day roadmap for developing an unbreakable champion
                        mindset.
                      </p>
                      {hasChampionsMindsetAccess ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Access Granted
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          Purchase Required
                        </div>
                      )}
                    </div>

                    {hasChampionsMindsetAccess ? (
                      <Button
                        onClick={handleDownload}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Champions Mindset
                      </Button>
                    ) : (
                      <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl">
                        <Link href="/products/champions-mindset">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          Purchase Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Theme Page Masterclass E-book Version product card */}
              <Card className="bg-black/60 border-white/20 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Theme Page Masterclass E-book Version
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white/80 mb-2">
                        Complete digital e-book version of the Theme Page Masterclass with step-by-step guides and
                        templates for creating viral social media content.
                      </p>
                      {hasThemePageEbookAccess ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Access Granted
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          Purchase Required
                        </div>
                      )}
                    </div>

                    {hasThemePageEbookAccess ? (
                      <Button
                        onClick={handleThemePageEbookDownload}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Theme Page Masterclass E-book
                      </Button>
                    ) : (
                      <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl">
                        <Link href="/products/theme-page-masterclass-ebook">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          Purchase Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Viral Clip Pack Bundle Product */}
              <Card className="bg-black/60 border-white/20 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 00-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Viral Clip Pack Bundle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white/80 mb-2">
                        Complete collection of viral video clips, templates, and editing resources to create engaging
                        social media content that drives massive engagement.
                      </p>
                      {hasViralClipPackAccess ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Access Granted
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          Purchase Required
                        </div>
                      )}
                    </div>

                    {hasViralClipPackAccess ? (
                      <Button
                        onClick={handleViralClipPackDownload}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Viral Clip Pack Bundle
                      </Button>
                    ) : (
                      <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl">
                        <Link href="/products/viral-clip-pack-bundle">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          Purchase Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Other Products Info */}
              {purchases.length > 0 && (
                <Card className="bg-black/60 border-white/20 backdrop-blur-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">All Your Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {purchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10"
                        >
                          <div>
                            <p className="text-white font-medium capitalize">{purchase.product_id.replace("-", " ")}</p>
                            <p className="text-white/60 text-sm">
                              Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-green-400 text-sm font-medium">{purchase.status.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">
                        <Link href="/account">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          View My Account
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {purchases.length === 0 && (
                <Card className="bg-black/60 border-white/20 backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <svg
                      className="w-16 h-16 text-white/40 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.707.293h-4.172a1 1 0 00-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="text-white text-xl font-semibold mb-2">No Products Yet</h3>
                    <p className="text-white/60 mb-6">
                      You haven't purchased any products yet. Start your transformation journey today!
                    </p>
                    <Button asChild className="bg-red-500 hover:bg-red-600 text-white font-bold">
                      <Link href="/#featured-products">Browse Products</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

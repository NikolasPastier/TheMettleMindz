"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Download, ShoppingBag, User, BookOpen, Play, Calendar } from "lucide-react"
import { AnimatedElement } from "@/components/animated-element"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"

interface Purchase {
  id: string
  product_id: string
  product_name: string
  amount: number
  purchased_at: string
  status: string
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error || !user) {
          router.push("/auth/login")
          return
        }
        setUser(user)
        await fetchPurchases(user.id)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchPurchases = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["paid", "completed"])
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching purchases:", error)
      } else {
        setPurchases(data || [])
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setLoadingPurchases(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
    }
  }

  const getProductDetails = (productId: string) => {
    switch (productId) {
      case "champions-mindset":
        return {
          name: "Champion's Mindset",
          type: "E-Book",
          hasAccess: true,
          accessUrl: "/products/champions-mindset",
          downloadUrl: "https://drive.google.com/uc?export=download&id=1-hXEHZ26npEmE9TioMBZNAQdlPeGBNIE",
          isDownloadable: true,
        }
      case "theme-page-masterclass":
        return {
          name: "Theme Page Masterclass",
          type: "Video Course",
          hasAccess: true,
          accessUrl: "/course/theme-page-masterclass",
          downloadUrl: "/course/theme-page-masterclass",
          isDownloadable: false,
        }
      case "theme-page-masterclass-ebook":
        return {
          name: "Theme Page Masterclass E-Book",
          type: "E-Book",
          hasAccess: true,
          accessUrl: "/products/theme-page-masterclass-ebook",
          downloadUrl: "https://drive.google.com/uc?export=download&id=1UEEeyznbNAlU2ryw-nPVxL6FNrEeiUjO",
          isDownloadable: true,
        }
      case "viral-clip-pack-bundle":
        return {
          name: "Viral Clip Pack Bundle",
          type: "Digital Assets",
          hasAccess: true,
          accessUrl: "/products/viral-clip-pack-bundle",
          downloadUrl: "https://drive.google.com/uc?export=download&id=1yqyU1kv5-jZv5XNDWZ5e1yEok0KTjMP0",
          isDownloadable: true,
        }
      default:
        return {
          name: productId,
          type: "Digital Product",
          hasAccess: false,
          accessUrl: "#",
          downloadUrl: "#",
          isDownloadable: false,
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black Marble Background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const courseAccess = purchases.filter((p) => p.product_id === "theme-page-masterclass")

  return (
    <div className="min-h-screen relative pt-20 pb-12">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/black-marble-background.jpg"
          alt="Black Marble Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedElement animationClass="animate-slide-up-1">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 text-balance">My Account</h1>
            <p className="text-base sm:text-lg text-white/80">Manage your account and access your digital products</p>
          </div>
        </AnimatedElement>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <AnimatedElement animationClass="animate-slide-left-1">
            <Card className="bg-black/60 backdrop-blur-sm border-red-500/40 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                  <User className="h-5 w-5 text-red-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/60">Email</label>
                  <p className="text-white font-medium text-base sm:text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Member Since</label>
                  <p className="text-white font-medium text-base sm:text-lg">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-500/40 text-white hover:bg-red-600/20 hover:border-red-500/60 hover:text-white bg-transparent transition-all duration-300 text-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </AnimatedElement>

          <AnimatedElement animationClass="animate-slide-up-1">
            <Card className="bg-black/60 backdrop-blur-sm border-red-500/40 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="h-5 w-5 text-red-500" />
                  My Courses
                </CardTitle>
                <CardDescription className="text-white/70">Access your purchased courses</CardDescription>
              </CardHeader>
              <CardContent>
                {courseAccess.length > 0 ? (
                  <div className="space-y-4">
                    {courseAccess.map((purchase) => {
                      const details = getProductDetails(purchase.product_id)
                      return (
                        <div
                          key={purchase.id}
                          className="p-4 bg-black/40 rounded-lg border border-red-500/20 hover:bg-black/60 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-medium text-base">{details.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-red-600/20 text-red-400 border-red-500/40">{details.type}</Badge>
                                <span className="text-xs text-white/60">
                                  Purchased{" "}
                                  {new Date(purchase.purchased_at || purchase.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            className="w-full bg-red-600 hover:bg-red-700 text-white hover:text-white transition-all duration-300 text-center"
                          >
                            <Link href={details.accessUrl}>
                              <Play className="h-4 w-4 mr-2" />
                              Access Course
                            </Link>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="h-10 w-10 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 mb-4 text-sm">No courses purchased yet</p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white hover:text-white transition-all duration-300 text-center"
                    >
                      <Link href="/products/theme-page-masterclass">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedElement>

          {/* Purchase History Card */}
          <AnimatedElement animationClass="animate-slide-right-1">
            <Card className="bg-black/60 backdrop-blur-sm border-red-500/40 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                  <ShoppingBag className="h-5 w-5 text-red-500" />
                  Purchase History
                </CardTitle>
                <CardDescription className="text-white/70">Your digital products and downloads</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPurchases ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                  </div>
                ) : purchases.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {purchases.map((purchase) => {
                      const details = getProductDetails(purchase.product_id)
                      return (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-red-500/20 hover:bg-black/60 transition-all duration-300"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{details.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                                {details.type}
                              </Badge>
                              <span className="text-xs text-white/60">${purchase.amount}</span>
                            </div>
                            <p className="text-xs text-white/50 mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(purchase.purchased_at || purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {details.isDownloadable ? (
                            <Button
                              asChild
                              size="sm"
                              className="ml-2 bg-red-600 hover:bg-red-700 text-white hover:text-white transition-all duration-300 text-center"
                            >
                              <a href={details.downloadUrl} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          ) : (
                            <Button
                              asChild
                              size="sm"
                              className="ml-2 bg-red-600 hover:bg-red-700 text-white hover:text-white transition-all duration-300 text-center"
                            >
                              <Link href={details.downloadUrl}>View</Link>
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">No purchases yet</p>
                    <Button
                      onClick={() => router.push("/#featured-products")}
                      className="bg-red-600 hover:bg-red-700 text-white hover:text-white transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>

        {/* Quick Actions */}
        <AnimatedElement animationClass="animate-slide-up-2">
          <div className="mt-8">
            <Card className="bg-black/60 backdrop-blur-sm border-red-500/40 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <Button
                    onClick={() => router.push("/#featured-products")}
                    variant="outline"
                    className="border-red-500/40 text-white hover:bg-red-600/20 hover:border-red-500/60 hover:text-white bg-transparent transition-all duration-300 text-center"
                  >
                    Browse Products
                  </Button>
                  <Button
                    onClick={() => router.push("/cart")}
                    variant="outline"
                    className="border-red-500/40 text-white hover:bg-red-600/20 hover:border-red-500/60 hover:text-white bg-transparent transition-all duration-300 text-center"
                  >
                    View Cart
                  </Button>
                  {courseAccess.length > 0 && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-red-500/40 text-white hover:bg-red-600/20 hover:border-red-500/60 hover:text-white bg-transparent transition-all duration-300 text-center"
                    >
                      <Link href="/course/theme-page-masterclass">My Courses</Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="border-red-500/40 text-white hover:bg-red-600/20 hover:border-red-500/60 hover:text-white bg-transparent transition-all duration-300 text-center"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedElement>
      </div>
    </div>
  )
}

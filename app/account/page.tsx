"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, Download, ShoppingBag, User } from "lucide-react"

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen marble-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen marble-bg pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
          <p className="text-gray-300">Manage your account and access your digital products</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="bg-black/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <p className="text-white font-medium">{new Date(Number.parseInt(user.id)).toLocaleDateString()}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Purchase History Card */}
          <Card className="bg-black/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Purchase History
              </CardTitle>
              <CardDescription className="text-gray-300">Your digital products and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              {user.purchases && user.purchases.length > 0 ? (
                <div className="space-y-3">
                  {user.purchases.map((productId, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <h4 className="text-white font-medium">
                          {productId === "champions-mindset"
                            ? "Champion's Mindset"
                            : productId === "theme-page-masterclass"
                              ? "Theme Page Masterclass"
                              : productId === "viral-clip-pack-bundle"
                                ? "Viral Clip Pack Bundle"
                                : productId}
                        </h4>
                        <p className="text-sm text-gray-400">Digital Download</p>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No purchases yet</p>
                  <Button
                    onClick={() => router.push("/products")}
                    className="bg-primary hover:bg-primary/90 text-black"
                  >
                    Browse Products
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-black/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  onClick={() => router.push("/products")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Browse Products
                </Button>
                <Button
                  onClick={() => router.push("/cart")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  View Cart
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

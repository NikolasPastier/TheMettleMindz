"use client"

import { useCart } from "@/contexts/cart-context"
import { useCheckout } from "@/hooks/use-checkout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AnimatedElement } from "@/components/animated-element"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart()
  const { redirectToCheckout, isLoading, error, clearError } = useCheckout()
  const router = useRouter()

  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  useEffect(() => {
    clearError()
  }, [items, clearError])

  const handleCheckout = async () => {
    await redirectToCheckout(items)
  }

  if (items.length === 0) {
    return null // Will redirect via useEffect
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

      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedElement animationClass="animate-slide-up-1">
            <div className="flex items-center gap-4 mb-8">
              <Button asChild variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                <Link href="/cart">
                  <span className="mr-2">←</span>
                  Back to Cart
                </Link>
              </Button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Secure Checkout</h1>
            </div>
          </AnimatedElement>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <AnimatedElement animationClass="animate-slide-up-2">
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl mb-6">
                  <CardHeader>
                    <CardTitle className="text-white text-lg md:text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 md:p-4 bg-black/20 rounded-lg border border-white/10"
                      >
                        <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm md:text-base">{item.title}</h3>
                          <p className="text-gray-400 text-xs md:text-sm">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm md:text-base">Qty: {item.quantity}</p>
                          <p className="text-red-400 font-bold text-sm md:text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AnimatedElement>

              {/* Security Features */}
              <AnimatedElement animationClass="animate-slide-up-3">
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <p className="text-white font-medium text-sm md:text-base">Secure Payment</p>
                        <p className="text-gray-400 text-xs md:text-sm">256-bit SSL encryption</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <p className="text-white font-medium text-sm md:text-base">Instant Access</p>
                        <p className="text-gray-400 text-xs md:text-sm">Download immediately</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <p className="text-white font-medium text-sm md:text-base">Money Back</p>
                        <p className="text-gray-400 text-xs md:text-sm">14-day guarantee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElement>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <AnimatedElement animationClass="animate-slide-up-4">
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-white text-lg md:text-xl">Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-gray-300 text-sm md:text-base">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-300 text-sm md:text-base">
                      <span>Processing Fee</span>
                      <span className="text-green-400">FREE</span>
                    </div>

                    <div className="flex justify-between text-gray-300 text-sm md:text-base">
                      <span>Instant Delivery</span>
                      <span className="text-green-400">FREE</span>
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="flex justify-between text-white font-bold text-lg md:text-xl">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    {error && (
                      <Alert className="bg-red-500/10 border-red-500/20">
                        <AlertDescription className="text-red-400 flex flex-col gap-2 text-sm">
                          <div className="flex justify-between items-start">
                            <span>{error}</span>
                            <button
                              onClick={clearError}
                              className="text-red-300 hover:text-red-100 ml-2"
                              aria-label="Dismiss error"
                            >
                              ×
                            </button>
                          </div>
                          {error.includes("Payment processing is currently unavailable") && (
                            <div className="text-xs text-gray-400 mt-2 p-2 bg-black/20 rounded border border-white/10">
                              <p className="font-medium text-gray-300 mb-1">To resolve this issue:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Check that Stripe environment variables are configured in Project Settings</li>
                                <li>Ensure STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are set</li>
                                <li>Try refreshing the page after configuration</li>
                              </ul>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-6 rounded-xl transition-all duration-300 transform hover:scale-105 min-h-[48px] sm:min-h-[56px] md:min-h-[64px]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2 px-2">
                          <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white flex-shrink-0" />
                          <span className="truncate">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 px-2">
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <span className="truncate">
                            <span className="hidden sm:inline">Complete Purchase - </span>
                            <span className="sm:hidden">Buy Now - </span>${total.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </Button>

                    <p className="text-gray-400 text-xs text-center">
                      Powered by Stripe. Your payment information is secure and encrypted.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

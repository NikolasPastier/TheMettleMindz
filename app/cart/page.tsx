"use client"

import { useCart } from "@/contexts/cart-context"
import { useCheckout } from "@/hooks/use-checkout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AnimatedElement } from "@/components/animated-element"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()
  const { redirectToCheckout, isLoading } = useCheckout()

  const handleQuickCheckout = async () => {
    await redirectToCheckout(items)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black marble background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedElement animation="slide-up" delay={0}>
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 sm:w-24 sm:h-24 text-red-400 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
                <p className="text-gray-300 mb-8 max-w-md mx-auto text-sm sm:text-base">
                  Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                </p>
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  <Link href="/#featured-products">Browse Products</Link>
                </Button>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/black-marble-background.jpg"
          alt="Black marble background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedElement animation="slide-up" delay={0}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Shopping Cart</h1>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white bg-transparent backdrop-blur-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear Cart
              </Button>
            </div>
          </AnimatedElement>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <AnimatedElement key={item.id} animation="slide-left" delay={index * 0.1}>
                  <Card className="bg-black/60 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-base sm:text-lg truncate">{item.title}</h3>
                          <p className="text-gray-400 text-xs sm:text-sm">{item.category}</p>
                          <p className="text-red-400 font-bold text-base sm:text-lg">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0 bg-black/40 border-white/20 hover:bg-red-600"
                            >
                              <span className="text-lg text-white">−</span>
                            </Button>

                            <span className="text-white font-medium w-8 text-center">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0 bg-black/40 border-white/20 hover:bg-red-600"
                            >
                              <span className="text-lg text-white">+</span>
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedElement>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedElement animation="slide-right" delay={0.2}>
                <Card className="bg-black/60 border-white/20 backdrop-blur-sm sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-white text-lg sm:text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                      <span>Items ({itemCount})</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                      <span>Shipping</span>
                      <span className="text-green-400">FREE</span>
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="flex justify-between text-white font-bold text-base sm:text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleQuickCheckout}
                        disabled={isLoading}
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            Quick Checkout
                          </>
                        )}
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                      >
                        <Link href="/checkout">Review Order</Link>
                      </Button>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      size="lg"
                      className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <Link href="/#featured-products">Continue Shopping</Link>
                    </Button>
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

"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { X, ShoppingBag, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

export function CartPopup() {
  const { items, total, itemCount, isPopupOpen, hidePopup, updateQuantity, removeItem } = useCart()

  // Auto-hide popup after 5 seconds
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        hidePopup()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isPopupOpen, hidePopup])

  if (!isPopupOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={hidePopup} />

      {/* Popup */}
      <div className="fixed right-4 top-20 w-96 max-w-[calc(100vw-2rem)] bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 animate-slide-left-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-white">Added to Cart!</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={hidePopup}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="max-h-64 overflow-y-auto p-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                <p className="text-xs text-gray-400">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Minus className="w-3 h-3" />
                </Button>

                <span className="text-sm text-white w-6 text-center">{item.quantity}</span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Total ({itemCount} items)</span>
            <span className="text-xl font-bold text-red-500">${total.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
              <Link href="/checkout" onClick={hidePopup}>
                Checkout Now
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10">
              <Link href="/cart" onClick={hidePopup}>
                View Full Cart
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

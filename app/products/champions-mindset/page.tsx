"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ChampionsMindsetPage() {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const product = {
    id: "champions-mindset",
    name: "Champion's Mindset",
    price: 9.99,
    originalPrice: 19.99,
    image: "/images/champion-mindset-product.png",
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      category: "E-book",
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      category: "E-book",
    })
    router.push("/checkout")
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
      <div className="pt-24 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 slide-in-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Champion's Mindset</h1>
              <p className="text-lg text-white leading-relaxed">
                Build unshakeable discipline. Kill distractions. Think like a champion. A concise guide to mental
                toughness, dopamine control, and habits that compound in the gym, school, and business.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Kill distraction loops and get your focus back</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Reset your dopamine so long-term rewards feel good again</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Daily non-negotiables that make showing up effortless</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Reframe your thoughts; act with responsibility and confidence</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>60-day results roadmap + printable checklists</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-red-500">${product.price}</span>
                  <span className="text-xl text-white/60 line-through">${product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</span>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 rounded-lg font-bold text-lg bg-transparent"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                <span className="text-white">(4.9/5 from 2,847 reviews)</span>
              </div>
            </div>

            <div className="slide-in-right">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt="Champion's Mindset E-book"
                  width={500}
                  height={500}
                  className="w-full h-auto pop-in"
                />
              </div>
            </div>
          </div>

          {/* What's Inside Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What's Inside</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <h3 className="text-xl font-bold text-red-500 mb-4">Mental Foundations</h3>
                <ul className="space-y-2 text-white">
                  <li>• Cutting the dead weight (habits to drop + what to build)</li>
                  <li>• Long-term &gt; short-term pleasure (discipline over dopamine hits)</li>
                  <li>• Purpose, stoicism, responsibility, confidence</li>
                  <li>• Mental health foundations: gratitude, meditation, consistency</li>
                </ul>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <h3 className="text-xl font-bold text-red-500 mb-4">Daily Systems</h3>
                <ul className="space-y-2 text-white">
                  <li>• Micro-tasks, momentum, and daily systems</li>
                  <li>• Routines for sleep, training, clean eating, journaling</li>
                  <li>• The action → progress → motivation loop to ship more</li>
                  <li>• 60-day roadmap with printable checklists</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What You'll Achieve</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">Unshakeable Discipline</h3>
                <p className="text-white">Build habits that stick and eliminate distractions</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">Mental Toughness</h3>
                <p className="text-white">Develop resilience and champion mindset</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">Lasting Results</h3>
                <p className="text-white">60-day roadmap for sustainable transformation</p>
              </div>
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Our Promise</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">14-Day</div>
                <p className="text-white">Money-back guarantee</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">Instant</div>
                <p className="text-white">PDF download access</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">Compatible</div>
                <p className="text-white">All devices supported</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-red-500/40">
            <h2 className="text-2xl font-bold text-white mb-4">Transform Your Mindset, Transform Your Life</h2>
            <p className="text-white mb-6">If you're not getting value in 14 days, full refund — no questions asked.</p>
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              Get Instant Access - $9.99
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

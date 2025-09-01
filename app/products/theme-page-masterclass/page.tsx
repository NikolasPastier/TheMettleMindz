"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

export default function ThemePageMasterclassPage() {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const product = {
    id: "theme-page-masterclass",
    name: "Theme Page Masterclass",
    price: 97.0,
    originalPrice: 197.0,
    image: "/images/theme-page-masterclass.png",
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem({
      id: product.id,
      title: product.name, // Convert name to title for CartItem interface
      price: product.price,
      image: product.image,
      category: "Course", // Add required category field
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <div className="min-h-screen marble-bg">
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 slide-in-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Theme Page Masterclass</h1>
              <p className="text-lg text-white leading-relaxed">
                Build Your Own Profitable Faceless Instagram Page. Want to grow fast on Instagram, reach 100K+
                followers, and turn motivation into money — without ever showing your face?
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Private Discord Community with personal advice & feedback</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Full Video Course (30+ Lessons) from creation to monetization</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Viral Clip Pack Bundle - 1,300+ motivational clips</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>3,500+ luxury 4K clips + sound effects & songs</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>15GB+ of editing resources & lifetime updates</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-red-500">${product.price}</span>
                  <span className="text-xl text-white/60 line-through">${product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">51% OFF</span>
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
                <span className="text-white">(4.8/5 from 1,247 creators)</span>
              </div>
            </div>

            <div className="slide-in-right">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt="Theme Page Masterclass"
                  width={500}
                  height={500}
                  className="w-full h-auto pop-in"
                />
              </div>
            </div>
          </div>

          {/* Course Breakdown Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Course Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <h3 className="text-xl font-bold text-red-500 mb-4">Foundation & Growth</h3>
                <ul className="space-y-2 text-white">
                  <li>• Mindset of a Successful Creator</li>
                  <li>• Designing Your Profile for Growth</li>
                  <li>• Growth Hacking Strategies</li>
                  <li>• Understanding the Algorithm</li>
                </ul>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <h3 className="text-xl font-bold text-red-500 mb-4">Content & Monetization</h3>
                <ul className="space-y-2 text-white">
                  <li>• Viral Content Strategies</li>
                  <li>• Editing Mastery Techniques</li>
                  <li>• Monetization Blueprint</li>
                  <li>• Building Your Brand & Services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Viral Clip Pack Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Viral Clip Pack Bundle</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">1,300+ Motivational Clips</h3>
                <p className="text-white">Rocky, Creed, Batman, Anime, Kobe Bryant & more</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">3,500+ Luxury 4K Clips</h3>
                <p className="text-white">Cars, Jets, Yachts, Mansions, Watches & Lifestyle</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">15GB+ Resources</h3>
                <p className="text-white">Sound effects, popular songs & editing resources</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">The Results</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">0 → 100K</div>
                <p className="text-white">Followers with proven system</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">Viral</div>
                <p className="text-white">Content that blows up in views</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">Income</div>
                <p className="text-white">Generate real revenue streams</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-red-500/40">
            <h2 className="text-2xl font-bold text-white mb-4">
              Don't wait any longer to start your journey as a Faceless Content Creator
            </h2>
            <p className="text-white mb-6">
              Your faceless Instagram empire starts today. Get the complete system that built our 100K+ following.
            </p>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              {isAdding ? "Adding to Cart..." : "Get Creator Blueprint - $97"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

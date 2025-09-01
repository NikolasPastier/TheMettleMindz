"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export default function ThemePageMasterclassEbookPage() {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const product = {
    id: "theme-page-masterclass-ebook",
    title: "Theme Page Masterclass E-Book Version",
    price: 29.0,
    originalPrice: 49.0,
    image: "/images/theme-page-ebook.png",
    category: "E-Book",
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <div className="min-h-screen marble-bg">
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 slide-in-left">
              <h1 className="text-4xl md:text-5xl font-bold text-red-500 leading-tight">
                TheMettleMindz E-Book: From Zero to 100K Followers
              </h1>
              <p className="text-lg text-white leading-relaxed">
                Want to learn how we grew TheMettleMindz from 0 to 100K+ followers in under 6 months, generated 20M+
                views, and built a profitable online business — all from simple motivational edits?
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Beginner-Friendly: No prior experience needed</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Proven Success: Based on real results</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Actionable Steps: Follow and watch your page grow</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>10 Comprehensive Chapters</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Instant PDF Download</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-red-500">${product.price}</span>
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">41% OFF</span>
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
                <span className="text-white">(4.9/5 from 892 readers)</span>
              </div>
            </div>

            <div className="slide-in-right">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt="Theme Page Masterclass E-Book"
                  width={500}
                  height={500}
                  className="w-full h-auto pop-in"
                />
              </div>
            </div>
          </div>

          {/* What's Inside Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">Inside the E-Book You'll Discover</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-xl font-bold text-red-400 mb-4">Chapters 1-5: Foundation</h3>
                <ul className="space-y-2 text-white">
                  <li>• Introduction to Social Media Theme Pages</li>
                  <li>• Choosing Your Perfect Niche</li>
                  <li>• Designing Your Profile for Trust</li>
                  <li>• Essentials for Entertaining Content</li>
                  <li>• Fostering Audience Engagement</li>
                </ul>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-xl font-bold text-red-400 mb-4">Chapters 6-10: Growth & Monetization</h3>
                <ul className="space-y-2 text-white">
                  <li>• Monetizing Your Theme Page ($50K+ methods)</li>
                  <li>• Networking and Collaboration</li>
                  <li>• Scaling Your Social Media Empire</li>
                  <li>• Next Steps and Resources</li>
                  <li>• Your Action Plan to Start Winning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">Why This E-Book?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 text-center">
                <h3 className="text-lg font-bold text-red-400 mb-3">Beginner-Friendly</h3>
                <p className="text-white">No prior experience needed to start</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 text-center">
                <h3 className="text-lg font-bold text-red-400 mb-3">Proven Success</h3>
                <p className="text-white">Based on real results and millions of views</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 text-center">
                <h3 className="text-lg font-bold text-red-400 mb-3">Actionable Steps</h3>
                <p className="text-white">Follow the guide and watch your page grow</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-red-400 mb-8">Our Proven Track Record</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <div className="text-3xl font-bold text-red-500 mb-2">0 → 100K+</div>
                <p className="text-white">Followers in under 6 months</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <div className="text-3xl font-bold text-red-500 mb-2">20M+</div>
                <p className="text-white">Views generated</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <div className="text-3xl font-bold text-red-500 mb-2">$50K+</div>
                <p className="text-white">Revenue generated</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Don't wait any longer to start your journey as a Faceless Content Creator
            </h2>
            <p className="text-white mb-6">
              Download the TheMettleMindz E-Book today and start building your own profitable theme page. If you follow
              every step inside, success isn't just possible — it's guaranteed.
            </p>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              {isAdding ? "Adding to Cart..." : "Get Instant Access - $29"}
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Instant PDF download • Compatible with all devices • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

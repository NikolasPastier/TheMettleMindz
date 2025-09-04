"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export default function ViralClipPackBundlePage() {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const product = {
    id: "viral-clip-pack-bundle",
    title: "Viral Clip Pack Bundle",
    price: 14.99,
    originalPrice: 19.99,
    image: "/images/viral-clip-pack.png",
    category: "Digital Product",
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleBuyNow = () => {
    addItem(product)
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
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Viral Clip Pack Bundle</h1>
              <p className="text-lg text-white leading-relaxed">
                The complete bundle I used to grow from 0 to 100k followers on IG in under 6 months and get millions of
                views on my videos.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>1,300+ High Quality Motivational Clips</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>3,500+ 4K Luxury Clips</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>Bonus: Sound Effects & Popular Songs</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>10,000+ Additional Luxury Clips</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-red-500">✓</span>
                  <span>15 GB of Editing Resources</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-red-500">${product.price}</span>
                  <span className="text-xl text-white/60 line-through">${product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">25% OFF</span>
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
                <span className="text-white">(4.8/5 from 1,247 creators)</span>
              </div>
            </div>

            <div className="slide-in-right">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt="Viral Clip Pack Bundle"
                  width={500}
                  height={500}
                  className="w-full h-auto pop-in"
                />
              </div>
            </div>
          </div>

          {/* What's Included Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <h3 className="text-xl font-bold text-red-500 mb-4">1,300+ Motivational Clips</h3>
                <ul className="space-y-2 text-white">
                  <li>• Creed & Rocky scenes</li>
                  <li>• Without Remorse action clips</li>
                  <li>• Kung Fu Panda wisdom moments</li>
                  <li>• Hajime no Ippo & Anime psychology</li>
                  <li>• Batman motivational scenes</li>
                  <li>• American Psycho mindset clips</li>
                  <li>• Andrew Tate, Iman Gadzhi content</li>
                  <li>• Connor McGregor & Kobe Bryant</li>
                </ul>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <h3 className="text-xl font-bold text-red-500 mb-4">3,500+ 4K Luxury Clips</h3>
                <ul className="space-y-2 text-white">
                  <li>• Luxury cars & supercars</li>
                  <li>• High-end motorcycles</li>
                  <li>• Luxury houses & views</li>
                  <li>• Private jets & yachts</li>
                  <li>• Premium watches</li>
                  <li>• Money flexing content</li>
                  <li>• Lifestyle clips</li>
                  <li>• & Much more</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bonus Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Exclusive Bonuses</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">Sound Effects Pack</h3>
                <p className="text-white">Professional sound effects for editing</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">Popular Songs</h3>
                <p className="text-white">Trending songs perfect for reels</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-3">15 GB Resources</h3>
                <p className="text-white">Additional editing resources & clips</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Proven Results</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">0 → 100K</div>
                <p className="text-white">Followers in under 6 months</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">Millions</div>
                <p className="text-white">of views generated</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/40">
                <div className="text-3xl font-bold text-red-500 mb-2">Monetized</div>
                <p className="text-white">Instagram page success</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-red-500/40">
            <h2 className="text-2xl font-bold text-white mb-4">
              Don't wait any longer to start your journey as a Faceless Content Creator
            </h2>
            <p className="text-white mb-6">
              Save tens of hours gathering clips and resources. Get everything you need in one complete bundle.
            </p>
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              Get Instant Access - $14.99
            </Button>
            <p className="text-sm text-white/60 mt-4">
              *themettleminds does not own any of the material included in the offer
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

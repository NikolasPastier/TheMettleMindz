"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedElement } from "@/components/animated-element"
import { useState } from "react"

export default function ChampionMindsetLanding() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        setMessage(data.message)
        setEmail("")
      } else {
        setMessage(data.error || "Something went wrong")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadWallpaper = () => {
    window.open(
      process.env.NEXT_PUBLIC_WALLPAPER_PACK_URL ||
        "https://drive.google.com/drive/folders/16eDnU8h_yHI6lzxwNGHJvaZ7OjxLc0pb?usp=drive_link",
      "_blank",
    )
  }

  const products = [
    {
      id: "champions-mindset",
      title: "Champion's Mindset",
      type: "E-book",
      description: "Build unshakeable discipline. Kill distractions. Think like a champion.",
      href: "/products/champions-mindset",
      price: "$9.99",
      image: "/images/champion-mindset-product.png",
    },
    {
      id: "theme-page-masterclass",
      title: "Theme Page Masterclass",
      type: "Video Course",
      description: "Learn how to build profitable faceless Instagram pages from 0 to 100K followers.",
      href: "/products/theme-page-masterclass",
      price: "$19.99",
      image: "/images/theme-page-masterclass.png",
    },
    {
      id: "viral-clip-pack-bundle",
      title: "Viral Clip Pack Bundle",
      type: "Content Bundle",
      description: "4,800+ premium motivational and luxury clips that helped us grow from 0 to 100K followers.",
      href: "/products/viral-clip-pack-bundle",
      price: "$14.99",
      image: "/images/viral-clip-pack.png",
    },
    {
      id: "theme-page-masterclass-ebook",
      title: "Theme Page Masterclass E-Book Version",
      type: "E-book",
      description:
        "Complete written guide covering 10 comprehensive chapters on building successful faceless theme pages.",
      href: "/products/theme-page-masterclass-ebook",
      price: "$4.99",
      image: "/images/theme-page-ebook.png",
    },
  ]

  return (
    <div>
      {/* Home Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center px-4 py-8 md:py-16 lg:py-24 pt-20 md:pt-24 lg:pt-32 overflow-hidden marble-bg"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/web-background.png"
            alt="Champion Fighters Background"
            fill
            className="object-cover object-center sm:object-cover md:object-cover lg:object-cover object-top sm:object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedElement animationClass="animate-slide-up-1">
            <Image
              src="/images/large-phoenix-logo.png"
              alt="TheMettleMinds Phoenix Logo"
              width={400}
              height={400}
              className="mx-auto opacity-95 drop-shadow-2xl w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
            />
          </AnimatedElement>

          <AnimatedElement
            animationClass="animate-slide-up-2"
            className="mt-6 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
          >
            <Link
              href="/products/champions-mindset"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl border-2 border-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm text-sm sm:text-base md:text-lg"
            >
              Become the Champion of Your Life
            </Link>

            <Link
              href="/products/theme-page-masterclass"
              className="bg-transparent hover:bg-red-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl border-2 border-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm text-sm sm:text-base md:text-lg"
            >
              Create Viral Motivational Content
            </Link>
          </AnimatedElement>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="relative py-12 md:py-16 lg:py-20 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black Marble Background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <AnimatedElement animationClass="animate-slide-up-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
                Featured Products
              </h2>
            </AnimatedElement>
            <AnimatedElement animationClass="animate-slide-up-2">
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Transform your mindset and build your empire with our premium collection
              </p>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {products.slice(0, 4).map((product, index) => (
              <AnimatedElement
                key={product.id}
                animationClass={`animate-slide-up-${index + 3}`}
                className="bg-black/40 border border-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-black/60 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 relative mb-3 md:mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>

                  <div className="mb-2">
                    <span className="text-xs sm:text-sm text-red-400 font-medium uppercase tracking-wide">
                      {product.type}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{product.title}</h3>

                  <p className="text-white/80 text-sm sm:text-base mb-3 md:mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500">{product.price}</div>

                    <Button
                      asChild
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Link href={product.href}>Get Now</Link>
                    </Button>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-12 md:py-16 lg:py-20 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black Marble Background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedElement animationClass="animate-slide-left-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 text-balance">
              What Does It Mean To Be Mettle?
            </h2>
          </AnimatedElement>

          <div className="space-y-6 md:space-y-8 text-base sm:text-lg md:text-xl leading-relaxed">
            <AnimatedElement animationClass="animate-slide-right-1">
              <p className="text-white">
                To be mettle is to embody inner strength, resilience, and mental toughness. It's about standing tall in
                the face of adversity and pushing forward when others stop.
              </p>
            </AnimatedElement>

            <AnimatedElement animationClass="animate-slide-left-2">
              <p className="text-white">
                <span className="text-red-400 font-semibold">TheMettleMindz</span> is more than a brand — it's a
                movement. A call to every individual to harness their inner power, overcome fear, and thrive with
                unshakable determination.
              </p>
            </AnimatedElement>

            <AnimatedElement animationClass="animate-slide-right-2">
              <p className="text-white">
                At <span className="text-red-400 font-semibold">TheMettleMindz</span>, we believe true power lies not in
                avoiding challenges, but in facing them with courage, resilience, and unwavering determination.
              </p>
            </AnimatedElement>

            <div className="mt-12 md:mt-16 space-y-6 md:space-y-8">
              <AnimatedElement animationClass="animate-slide-left-3">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-400">
                  What We've Achieved
                </h3>
              </AnimatedElement>

              <div className="space-y-4 md:space-y-6 text-sm sm:text-base md:text-lg">
                <AnimatedElement animationClass="animate-slide-right-3">
                  <p className="text-white">
                    <span className="text-red-300 font-semibold">Inspired Millions:</span> Our content has reached over
                    5M+ people worldwide, sparking daily discipline and growth.
                  </p>
                </AnimatedElement>

                <AnimatedElement animationClass="animate-slide-left-4">
                  <p className="text-white">
                    <span className="text-red-300 font-semibold">Built a Community:</span> Grew to 100K+ loyal followers
                    on Instagram, generating over 20M+ views across reels and posts.
                  </p>
                </AnimatedElement>

                <AnimatedElement animationClass="animate-slide-right-4">
                  <p className="text-white">
                    <span className="text-red-300 font-semibold">Created Real Impact:</span> Thousands have used our
                    products to change their mindset, habits, and lifestyle.
                  </p>
                </AnimatedElement>

                <AnimatedElement animationClass="animate-slide-left-5">
                  <p className="text-white">
                    <span className="text-red-300 font-semibold">Monetized Motivation:</span> Turned inspiration into a
                    business, generating $50K+ in revenue directly from our content.
                  </p>
                </AnimatedElement>

                <AnimatedElement animationClass="animate-slide-right-5">
                  <p className="text-white">
                    <span className="text-red-300 font-semibold">Shared the Blueprint:</span> Through our course, we've
                    taught creators how to build and monetize their own motivational pages — some now running pages with
                    10K–50K followers of their own.
                  </p>
                </AnimatedElement>
              </div>

              <div className="mt-8 md:mt-12 space-y-4 md:space-y-6">
                <AnimatedElement animationClass="animate-slide-left-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-400">Our Mission</h3>
                </AnimatedElement>

                <AnimatedElement animationClass="animate-slide-right-3">
                  <p className="text-white">
                    To inspire, educate, and empower the next generation of creators and go-getters — proving that
                    motivation isn't just a feeling, it's a tool for success.
                  </p>
                </AnimatedElement>

                <AnimatedElement animationClass="animate-slide-left-4">
                  <p className="text-white">
                    👉 Join the movement today. Get inspired, learn the blueprint, and start building your own success
                    story with us.
                  </p>
                </AnimatedElement>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section id="newsletter" className="relative py-12 md:py-16 lg:py-20 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/black-marble-background.jpg"
            alt="Black Marble Background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-black/60 border border-red-500/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12">
            <AnimatedElement animationClass="animate-slide-up-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                Join the <span className="text-red-500">TheMettleMindz</span> Newsletter
              </h2>
            </AnimatedElement>

            <AnimatedElement animationClass="animate-slide-up-2">
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
                Get exclusive content, motivation tips, and be the first to know about new products and special offers.
                <br />
                <span className="text-red-300 font-semibold">
                  Sign up now and get 2 FREE gifts: A habit tracker and motivational wallpaper pack!
                </span>
              </p>
            </AnimatedElement>

            <AnimatedElement animationClass="animate-slide-up-3">
              {!isSuccess ? (
                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-black/50 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-sm sm:text-base"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap text-sm sm:text-base disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>

                  <p className="text-white/60 text-xs sm:text-sm mt-3 md:mt-4">
                    No spam, unsubscribe at any time. Your email is safe with us.
                  </p>
                </form>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="text-green-400 font-semibold text-lg mb-4">{message}</div>
                  <button
                    onClick={handleDownloadWallpaper}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Download Free Gifts
                  </button>
                  <p className="text-white/60 text-sm mt-3">
                    Check your email for the habit tracker and more exclusive content!
                  </p>
                </div>
              )}

              {message && !isSuccess && <p className="text-red-400 text-sm mt-3">{message}</p>}
            </AnimatedElement>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items, isAnimating } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Products", href: "/#featured-products" },
    { name: "About", href: "/#about" },
    { name: "Newsletter", href: "/#newsletter" },
  ]

  return (
    <header className="fixed top-4 left-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl mx-4">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between h-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/images/phoenix-logo.png"
                alt="themettlemindz logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-red-400 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/account" className="text-white hover:text-red-400 p-2" title="Account">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <Link
              href="/cart"
              className="relative text-white hover:text-red-400 p-2 transition-all duration-300 hover:scale-110"
              title="Cart"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isAnimating ? "animate-bounce" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            <button className="md:hidden text-white hover:text-red-400 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col gap-3 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-red-400 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

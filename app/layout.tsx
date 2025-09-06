import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Poppins } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import AnimatedGradientBackground from "@/components/animated-gradient-background"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "themettlemindz - Champion's Mindset",
  description: "Transform your mindset and achieve champion-level success",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <AnimatedGradientBackground
              speed={0.8}
              intensity={0.6}
              colors={["#FF2D2D", "#BA1F1F", "#D9D9D9", "#6B7280", "#0A0A0A", "#FFFFFF"]}
              seed={42}
            />
            <div className="min-h-screen relative">
              <Suspense fallback={<div>Loading...</div>}>
                <Header />
                <main>{children}</main>
                <Footer />
              </Suspense>
            </div>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

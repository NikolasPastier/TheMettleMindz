"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedElement } from "@/components/animated-element"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/black-marble-background.jpg"
          alt="Black Marble Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatedElement animationClass="animate-slide-up-1">
          <div className="text-center mb-8">
            <Image
              src="/images/large-phoenix-logo.png"
              alt="TheMettleMinds Phoenix Logo"
              width={120}
              height={120}
              className="mx-auto opacity-95 drop-shadow-2xl"
            />
          </div>
        </AnimatedElement>

        <AnimatedElement animationClass="animate-slide-up-2">
          <Card className="bg-black/40 border-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl md:text-2xl text-white">Create Account</CardTitle>
              <CardDescription className="text-white/80">Sign up to get started with your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white text-sm md:text-base">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-black/50 border-white/20 text-white placeholder-white/60 focus:border-red-500 focus:ring-red-500/20 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm md:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border-white/20 text-white placeholder-white/60 focus:border-red-500 focus:ring-red-500/20 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm md:text-base">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-white/20 text-white placeholder-white/60 focus:border-red-500 focus:ring-red-500/20 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white text-sm md:text-base">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-black/50 border-white/20 text-white placeholder-white/60 focus:border-red-500 focus:ring-red-500/20 rounded-lg"
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-white/80">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-red-400 hover:text-red-300 underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>
    </div>
  )
}

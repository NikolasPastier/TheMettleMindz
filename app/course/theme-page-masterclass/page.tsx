"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { AnimatedElement } from "@/components/animated-element"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Play, Download, CheckCircle, Lock, BookOpen, Video, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CourseModule {
  id: string
  title: string
  description: string
  duration: string
  videoUrl?: string
  resources?: string[]
  completed?: boolean
}

const courseModules: CourseModule[] = [
  {
    id: "1",
    title: "Introduction to Faceless Theme Pages",
    description: "Learn the fundamentals of creating engaging faceless content that resonates with your audience.",
    duration: "15 min",
    videoUrl: "/placeholder-video.mp4",
    resources: ["Theme Page Strategy Guide.pdf", "Content Calendar Template.xlsx"],
  },
  {
    id: "2",
    title: "Niche Selection & Market Research",
    description: "Discover how to identify profitable niches and understand your target audience.",
    duration: "25 min",
    videoUrl: "/placeholder-video.mp4",
    resources: ["Niche Research Worksheet.pdf", "Market Analysis Template.xlsx"],
  },
  {
    id: "3",
    title: "Profile Setup & Optimization",
    description: "Create a compelling Instagram profile that converts visitors into followers.",
    duration: "20 min",
    videoUrl: "/placeholder-video.mp4",
    resources: ["Profile Optimization Checklist.pdf", "Bio Templates.txt"],
  },
  {
    id: "4",
    title: "Content Creation Strategies",
    description: "Master the art of creating viral-worthy content that drives engagement.",
    duration: "35 min",
    videoUrl: "/placeholder-video.mp4",
    resources: ["Content Creation Guide.pdf", "Viral Content Examples.zip"],
  },
  {
    id: "5",
    title: "Growth & Engagement Tactics",
    description: "Learn proven strategies to grow your following and increase engagement rates.",
    duration: "30 min",
    videoUrl: "/placeholder-video.mp4",
    resources: ["Growth Strategy Playbook.pdf", "Engagement Templates.txt"],
  },
  {
    id: "6",
    title: "Monetization & Scaling",
    description: "Turn your theme page into a profitable business with multiple revenue streams.",
    duration: "40 min",
    videoUrl: "/placeholder-video.mp4",
    resources: ["Monetization Guide.pdf", "Revenue Tracking Sheet.xlsx"],
  },
]

export default function ThemePageMasterclassCoursePage() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setHasAccess(false)
        setIsLoading(false)
        return
      }

      setUser(user)

      // Check if user has purchased the Theme Page Masterclass
      const response = await fetch("/api/verify-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: "theme-page-masterclass",
        }),
      })

      const data = await response.json()
      setHasAccess(data.hasPurchased)
    } catch (error) {
      console.error("Error checking access:", error)
      setHasAccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModuleCompletion = (moduleId: string) => {
    setCompletedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId],
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        <Image src="/images/black-marble-background.jpg" alt="Background" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black relative">
        <Image src="/images/black-marble-background.jpg" alt="Background" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
          <AnimatedElement animation="slide-up" delay={0}>
            <Alert className="bg-red-500/20 border-red-500/40 backdrop-blur-sm">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-white">
                You need to be logged in to access this course.{" "}
                <Link href="/auth/login" className="text-red-400 hover:text-red-300 underline">
                  Sign in here
                </Link>
              </AlertDescription>
            </Alert>
          </AnimatedElement>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black relative">
        <Image src="/images/black-marble-background.jpg" alt="Background" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
          <AnimatedElement animation="slide-up" delay={0}>
            <div className="text-center mb-8">
              <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">Course Access Required</h1>
              <p className="text-white/80 text-lg mb-8">
                You need to purchase the Theme Page Masterclass to access this course content.
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/products/theme-page-masterclass">Purchase Course</Link>
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </div>
    )
  }

  const progressPercentage = Math.round((completedModules.length / courseModules.length) * 100)

  return (
    <div className="min-h-screen bg-black relative">
      <Image src="/images/black-marble-background.jpg" alt="Background" fill className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Course Header */}
        <AnimatedElement animation="slide-up" delay={0}>
          <div className="text-center mb-12">
            <Badge className="bg-red-600 text-white mb-4">Premium Course</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Theme Page Masterclass</h1>
            <p className="text-white/80 text-lg mb-6">Master the art of building profitable faceless Instagram pages</p>
            <div className="flex items-center justify-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <span>6 Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>2.5 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Resources Included</span>
              </div>
            </div>
          </div>
        </AnimatedElement>

        {/* Progress Bar */}
        <AnimatedElement animation="slide-up" delay={0.1}>
          <Card className="bg-black/60 border-red-500/40 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Course Progress</h3>
                <span className="text-red-400 font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-white/60 text-sm mt-2">
                {completedModules.length} of {courseModules.length} modules completed
              </p>
            </CardContent>
          </Card>
        </AnimatedElement>

        {/* Course Modules */}
        <div className="space-y-6">
          {courseModules.map((module, index) => (
            <AnimatedElement key={module.id} animation="slide-up" delay={0.1 * (index + 2)}>
              <Card className="bg-black/60 border-red-500/40 backdrop-blur-sm hover:bg-black/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="border-red-500/40 text-red-400">
                          Module {module.id}
                        </Badge>
                        <span className="text-white/60 text-sm">{module.duration}</span>
                        {completedModules.includes(module.id) && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                      <CardTitle className="text-white text-xl mb-2">{module.title}</CardTitle>
                      <p className="text-white/80">{module.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => toggleModuleCompletion(module.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {completedModules.includes(module.id) ? "Rewatch" : "Watch Now"}
                    </Button>
                    {module.resources && module.resources.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/40 text-red-400 hover:bg-red-500/20 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Resources ({module.resources.length})
                      </Button>
                    )}
                    {!completedModules.includes(module.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => toggleModuleCompletion(module.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>

                  {module.resources && module.resources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <h4 className="text-white/80 text-sm font-medium mb-2">Course Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {module.resources.map((resource, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-white/10 text-white/70">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedElement>
          ))}
        </div>

        {/* Course Completion */}
        {completedModules.length === courseModules.length && (
          <AnimatedElement animation="slide-up" delay={0.8}>
            <Card className="bg-green-500/20 border-green-500/40 backdrop-blur-sm mt-8">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">Congratulations!</h3>
                <p className="text-white/80">
                  You've completed the Theme Page Masterclass. You're now ready to build your own profitable Instagram
                  theme page!
                </p>
              </CardContent>
            </Card>
          </AnimatedElement>
        )}
      </div>
    </div>
  )
}

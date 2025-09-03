"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AnimatedElement } from "@/components/animated-element"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Loader2, Download, CheckCircle, Lock, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface SubChapter {
  id: string
  title: string
  vimeoUrl: string
  description: string
}

interface Chapter {
  id: string
  title: string
  subChapters: SubChapter[]
}

const courseStructure: Chapter[] = [
  {
    id: "mindset",
    title: "Chapter 1: Mindset",
    subChapters: [
      {
        id: "consistency",
        title: "Consistency",
        vimeoUrl: "https://vimeo.com/1003134208",
        description:
          "Consistency is key to success on social media. Social media is unpredictable, like gambling—you don't know which post will go viral. Don't give up too soon; it may take months for good content to gain traction. Persistence is essential, even if your page seems inactive. If needed, start a new page and keep trying.",
      },
      {
        id: "loyalty",
        title: "Loyalty",
        vimeoUrl: "https://vimeo.com/1003134518",
        description:
          "Consistency is key to success on social media. Social media is unpredictable, like gambling—you don't know which post will go viral. Don't give up too soon; it may take months for good content to gain traction. Persistence is essential, even if your page seems inactive. If needed, start a new page and keep trying.",
      },
      {
        id: "continuous-learning",
        title: "Continuous Learning",
        vimeoUrl: "https://vimeo.com/1003134439",
        description:
          "Continuous learning and adaptation are crucial to staying relevant on social media. Keep up with trending audios, editing styles, and changes in your niche. Observe what works for others and apply it to your content. Failing to adapt can lead to loss of audience interest in outdated content. Stay alert for new ideas and trends, as preferences and attention shift quickly.",
      },
    ],
  },
  {
    id: "profile-branding",
    title: "Chapter 2: Profile Branding",
    subChapters: [
      {
        id: "niche",
        title: "Niche",
        vimeoUrl: "https://vimeo.com/1003134863",
        description:
          "Choose the right niche to avoid creating content with little interest. Pick a niche that is consistently in demand and has opportunities for monetization (ads, sponsorships, product sales). Reliable niches include Motivation, Fitness, Finance, and Health, with many sub-niches. Focus on a niche you find interesting and have knowledge in, and stand out with quality content despite competition. Use the Ikigai concept to identify your niche by aligning your passions, skills, what the world needs, and what you can get paid for.",
      },
      {
        id: "name-username",
        title: "Name and Username",
        vimeoUrl: "https://vimeo.com/1003134745",
        description:
          "Choose a simple, memorable, and niche-relevant username. Avoid complex names, numbers, symbols, or long words that are hard to spell. Pick a name that reflects your brand and appeals to your target audience. Use tools like ChatGPT to generate unique username ideas for your niche. Incorporate niche-related keywords in your Instagram name to boost discoverability and searchability.",
      },
      {
        id: "branding",
        title: "Branding",
        vimeoUrl: "https://vimeo.com/1003134614",
        description:
          "Don't overthink your profile setup early on; focus on creating quality content instead. Use a simple, consistent color scheme that evokes specific emotions (e.g., green for growth, blue for trust). Write a clear and concise bio that describes who you are or what you do without unnecessary details. Avoid promoting random affiliate products or focusing on money early, as it can turn off potential followers. Provide value through inspiration or education to build a following before gradually monetizing your content.",
      },
      {
        id: "stories",
        title: "Stories",
        vimeoUrl: "https://vimeo.com/1003135023",
        description:
          "Posting Stories isn't crucial at the start, but if you do, ensure they add value to your page. Share niche-relevant content in Stories, such as quotes, helpful images, or videos. Save valuable Stories to your Highlights to enhance your page's appearance. Use simple graphics for Highlight covers that align with your profile's color scheme. Design Highlight covers easily using tools like Canva or AI generators.",
      },
    ],
  },
  {
    id: "growth-hacking",
    title: "Chapter 3: Growth Hacking",
    subChapters: [
      {
        id: "why-videos-go-viral",
        title: "Why videos go viral",
        vimeoUrl: "https://vimeo.com/1003197156",
        description:
          "Understand the algorithm and human psychology to achieve virality. Create fast-paced content with engaging visuals or narratives. Ensure content is intriguing and evokes an emotional or intellectual response. Posts that connect on a deeper level with audiences are more likely to be saved and shared. Emotional or intellectual engagement increases the likelihood of content going viral.",
      },
      {
        id: "why-people-follow",
        title: "Why people follow",
        vimeoUrl: "https://vimeo.com/1003196941",
        description:
          "Entertainment: People follow accounts for engaging content that entertains, such as memes or funny videos. Learning: Accounts that offer valuable knowledge on topics like fitness, cooking, or personal development attract followers. Inspiration: Motivational content, meaningful quotes, and positive messages draw followers seeking encouragement. Staying Updated: Accounts providing news, sports highlights, or niche-specific trends help followers stay informed. Combine Reasons: For maximum engagement, tap into at least one of these reasons and ideally combine a few.",
      },
      {
        id: "curating-feed",
        title: "Curating your feed",
        vimeoUrl: "https://vimeo.com/1003196424",
        description:
          "Engage with similar posts, Reels, and accounts to boost your content's visibility. This interaction helps the algorithm recommend your content to users interested in similar topics. Avoid interacting with unrelated content, such as memes, to stay relevant. Gain inspiration from the Explore page, Reels, or related profiles you follow. Engaging with similar accounts can enhance your content strategy and relevance.",
      },
      {
        id: "data-insights",
        title: "Data insights",
        vimeoUrl: "https://vimeo.com/1003196555",
        description:
          "Analyze Instagram Insights to determine what's effective and what needs improvement. Use strategic keywords in captions to enhance post discoverability. Share posts to Stories to increase views by 10-20%, especially within the first 24 hours. Post 1-2 hours before peak activity to boost your chances of going viral, based on when your followers are most active. Address common content issues by enhancing the hook, selecting relevant topics, driving engagement, making content relatable, and adding more value.",
      },
      {
        id: "quality-over-quantity",
        title: "Quality over quantity",
        vimeoUrl: "https://vimeo.com/1003196748",
        description:
          "Prioritize quality over quantity in content creation for Instagram, focusing on high-quality reels. Avoid flooding your feed with frequent posts; instead, create well-crafted reels that resonate deeply with your audience. Produce visually appealing, informative, or entertaining content that stands out. Invest in refining production values, including good lighting, clear audio, and engaging storytelling. Ensure each reel offers valuable content, such as fresh perspectives, useful tips, or compelling entertainment.",
      },
    ],
  },
  {
    id: "viral-content-strategies",
    title: "Chapter 4: Viral Content Strategies",
    subChapters: [
      {
        id: "beating-algorithm",
        title: "Beating the algorithm",
        vimeoUrl: "https://vimeo.com/1003199638",
        description:
          "Initial visibility: Instagram first shows your post to a small group of followers to gauge engagement metrics. Key metrics: Focus on watch time, saves, shares, and comments, as they are more influential than likes. Algorithm evaluation: Based on initial engagement, Instagram decides to either promote your post widely or limit its visibility. Explore Page: A successful post may appear on the Explore Page, significantly boosting views and followers. Optimize content: Enhance your content to encourage the algorithm to continue promoting it.",
      },
      {
        id: "steal-like-artist",
        title: "Steal like an artist",
        vimeoUrl: "https://vimeo.com/1003200098",
        description:
          '"Steal like an artist" means drawing inspiration from successful content, not literal theft or plagiarism. Analyze top-performing content in your niche to understand what resonates with audiences. Innovate by adding your own spin to successful ideas, incorporating personal insights or expertise. Enhance content with better graphics, engaging visuals, or improved design elements, using tools like Canva. Present content in a fresh format or perspective to differentiate your version from existing content.',
      },
      {
        id: "viral-checklist",
        title: "The Viral Checklist",
        vimeoUrl: "https://vimeo.com/1003200277",
        description:
          "A comprehensive checklist to maximize your content's viral potential. Cover all essential elements that contribute to viral success including timing, hashtags, engagement tactics, and content optimization strategies.",
      },
      {
        id: "thumbnails",
        title: "Thumbnails",
        vimeoUrl: "https://vimeo.com/1003200748",
        description:
          "Eye-catching elements: Ensure your content includes compelling visuals, headlines, or a unique style to make users stop scrolling and engage. Encourage time spent: Create content that keeps users interested for longer, such as engaging videos, carousels, or detailed infographics. Provide long-term value: Offer content that users may want to save for future reference, like tips, guides, or useful information. Encourage sharing: Make your content relatable, humorous, or thought-provoking, so users feel compelled to share it with others. Promote interaction: Craft posts that spark discussions, ask questions, or present controversial topics to encourage comments and engagement.",
      },
      {
        id: "negative-hook",
        title: "Negative Hook",
        vimeoUrl: "https://vimeo.com/1003199963",
        description:
          "Negative hook strategy: Use a provocative or seemingly negative statement to capture attention and spark curiosity. Leverage controversy or dissatisfaction to draw viewers in, rather than relying on positive or neutral content. Create a strong emotional reaction to compel users to engage with the content through comments, likes, or shares. Ensure content offers value: Despite the negative hook, provide valuable information or solutions to avoid purely sensationalism. Balance with constructive advice: Keep the overall content useful and engaging by including positive outcomes or practical advice.",
      },
      {
        id: "hashtags",
        title: "Hashtags",
        vimeoUrl: "https://vimeo.com/1003199735",
        description:
          "Ensure your videos appear in searches by including relevant hashtags. Copy successful hashtags: Utilize hashtags from popular videos in your niche or adapt them to fit your brand. Enhance discoverability: Hashtags help users find your content, particularly when they are searching for inspiration. Increase viral potential: Proper use of hashtags boosts the chances of your video reaching a wider audience. Incorporate keywords: Along with hashtags, use relevant keywords to further enhance your content's visibility in searches.",
      },
    ],
  },
  {
    id: "editing-tutorial",
    title: "Chapter 5: Editing Tutorial",
    subChapters: [
      {
        id: "background-clips",
        title: "Background clips",
        vimeoUrl: "https://vimeo.com/1002027094",
        description:
          'Start with relevant material: Focus on short, dynamic "masculine/motivation" clips, such as scenes from "Creed" or "Rocky." Download and trim clips: Obtain training montages from YouTube and trim them using CapCut, though this can be time-consuming. Use the provided clip pack: Access a pre-cut clip pack designed for motivational edits, including Creed-related content, available in the "resources" section of the module.',
      },
      {
        id: "background-sounds",
        title: "Background sounds",
        vimeoUrl: "https://vimeo.com/1002027232",
        description:
          "Look for videos with over 500k views on pages with similar edits to find trending sounds. Download trending sounds from popular videos to incorporate them into your edits. Explore Reels: Scroll through Reels to find frequently used songs by creators with high views and likes.",
      },
      {
        id: "finding-quotes",
        title: "Finding quotes",
        vimeoUrl: "https://vimeo.com/1002027308",
        description:
          "Collect quotes from popular sources: Visit high-view motivational videos or browse X/Threads for motivational quotes. Use ChatGPT for original quotes: Recreate quotes in a similar style and length, keeping the language simple for viral potential. Create or ask ChatGPT to generate quotes: Be cautious with ChatGPT-generated quotes as they can become overused and less engaging.",
      },
      {
        id: "editing-audios",
        title: "Editing audios",
        vimeoUrl: "https://vimeo.com/1002027420",
        description:
          'Sync clips with audio beats: This creates a dynamic and engaging video, which is essential for viral content. Manual editing: Listen to the audio and trim the clips to match the beats for precise synchronization. CapCut AI feature: Use the "Mark Beats" feature to automatically add beat markers, but review them to ensure accuracy, as the AI may not always be precise.',
      },
      {
        id: "editing-clips",
        title: "Editing clips",
        vimeoUrl: "https://vimeo.com/1002027510",
        description:
          "Use fast-paced clips: Incorporate short, dynamic clips like sparring, punching, or sprinting, each around 0-2 seconds, to create an engaging reel. Match quotes with audio: For audio without a drop, use a single quote. For audio with a drop, split the quote into two parts—before and at the drop. Align clips with music mood: Match energetic tracks with intense scenes and somber music with struggle or exhaustion, switching to uplifting clips as the music becomes more positive.",
      },
      {
        id: "exporting-uploading",
        title: "Exporting and uploading",
        vimeoUrl: "https://vimeo.com/1002027666",
        description:
          "Establish a consistent style: Use the same text font and a subtle watermark for all your videos to protect your content and maintain a cohesive aesthetic. Export efficiently: Use recommended settings for a balance between quality and file size, export directly to Google Drive to save PC storage, and ensure seamless uploading from your phone. Optimize your upload: Include a brief description of the quote's value and add a few relevant hashtags, keeping the description clean and straightforward.",
      },
      {
        id: "copy-paste-secrets",
        title: "Copy and paste secrets",
        vimeoUrl: "https://vimeo.com/1002027829",
        description:
          "Create and reuse 21 edits: Initially make 21 motivational edits, then update and re-upload them weekly with different quotes, simplifying content management. Focus on Instagram: This strategy works well on Instagram but may cause issues like shadowbanning on platforms like YouTube or TikTok, which require unique, high-quality content. Stay proactive and patient: Regularly seek new trending audios and create fresh content at least once a month to maintain engagement and avoid content saturation. Be patient and consistent, as gaining traction can take time.",
      },
    ],
  },
  {
    id: "monetization",
    title: "Chapter 6: Monetization",
    subChapters: [
      {
        id: "prerequisites",
        title: "Prerequisites",
        vimeoUrl: "https://vimeo.com/1003247063",
        description:
          "Build a strong following first: Aim for at least 10k followers or develop a loyal audience by offering valuable content before monetizing your page. Premature monetization can harm growth: Trying to sell too early can damage your reputation, slow growth, and limit future monetization opportunities. Focus on views and followers: High attention and engagement, even with many views, will attract people interested in your products when you're ready to monetize.",
      },
      {
        id: "two-ways-making-money",
        title: "Two ways of making money",
        vimeoUrl: "https://vimeo.com/1003247159",
        description:
          "Two primary income streams: You can earn online by promoting either other people's services/businesses or your own. Different purposes and benefits: Each method has its own advantages and drawbacks, depending on your goals. Upcoming modules will cover both: Detailed insights into both methods will be provided in future lessons.",
      },
      {
        id: "other-peoples-services",
        title: "Other People's Services/Businesses",
        vimeoUrl: "https://vimeo.com/1003246936",
        description:
          "Affiliate marketing offers easy income: It's a simple way for both beginners and experienced users to earn money by promoting brands through custom links or codes and earning commissions from sales. Brand alignment is crucial: For success, choose a brand that fits well with your page and audience to increase engagement and conversions. Limited profit potential: You only earn a percentage of sales, so if you want full control and profit, consider creating your own business instead.",
      },
      {
        id: "your-own-business",
        title: "Your Own Business/Service",
        vimeoUrl: "https://vimeo.com/1003247217",
        description:
          "Create and sell your own products/services: This method involves offering items like merchandise, e-books, courses, or services like coaching or social media management. Digital products offer high profitability: Once developed, digital products can be sold repeatedly with minimal effort, making them a lucrative option. Time-intensive for beginners: Developing valuable products may take weeks or months, making affiliate marketing a potentially easier starting point for those without initial investment.",
      },
      {
        id: "affiliate-marketing",
        title: "Affiliate Marketing",
        vimeoUrl: "https://vimeo.com/1003246300",
        description:
          'Use a referral link effectively: Add your unique affiliate referral link to your Instagram bio with a clear call to action, like "Learn how to grow your IG page like I did." Keep the link clean and professional using tools like Bit.ly or Beacons.ai. Leverage Instagram Stories and posts: Create highlight stories explaining the product benefits, post about the product 2-3 times a week, and offer valuable content on alternate days. In posts, include valuable tips before mentioning the product. Advanced promotion with ManyChat: For higher conversions, prompt users to comment a keyword on posts, and use ManyChat to automatically send them the product link via direct message.',
      },
      {
        id: "email-marketing",
        title: "Email marketing",
        vimeoUrl: "https://vimeo.com/1003246637",
        description:
          "Promote a value-driven newsletter: Use engaging Instagram content like reels, posts, and stories to encourage users to subscribe, offering exclusive weekly tips or insights related to your niche. Monetize your email list: Once you have around 500 subscribers, pitch brands for collaborations or promote affiliate products like subscription-based software for recurring income. Use Beehiiv Boosts to grow revenue: Earn $2 to $5 per sign-up by recommending other newsletters, and reinvest earnings into Instagram ads to scale your email list and increase monthly revenue.",
      },
    ],
  },
]

export default function ThemePageMasterclassCoursePage() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [openChapters, setOpenChapters] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAccess()
  }, [])

  const loadProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_progress")
        .select("lesson_id")
        .eq("user_id", userId)
        .eq("course_id", "theme-page-masterclass")
        .eq("completed", true)

      if (error) throw error

      const completed = data?.map((item) => item.lesson_id) || []
      setCompletedLessons(completed)
    } catch (error) {
      console.error("Error loading progress:", error)
    }
  }

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
      await loadProgress(user.id)

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

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return

    const isCompleted = completedLessons.includes(lessonId)

    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from("course_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("course_id", "theme-page-masterclass")
          .eq("lesson_id", lessonId)

        if (error) throw error
        setCompletedLessons((prev) => prev.filter((id) => id !== lessonId))
      } else {
        // Add completion
        const { error } = await supabase.from("course_progress").upsert({
          user_id: user.id,
          course_id: "theme-page-masterclass",
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        })

        if (error) throw error
        setCompletedLessons((prev) => [...prev, lessonId])
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => (prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]))
  }

  const totalLessons = courseStructure.reduce((total, chapter) => total + chapter.subChapters.length, 0)
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100)

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

  return (
    <div className="min-h-screen bg-black relative">
      <Image src="/images/black-marble-background.jpg" alt="Background" fill className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <AnimatedElement animation="slide-up" delay={0}>
          <div className="text-center mb-12">
            <Badge className="bg-red-600 text-white mb-4">Faceless IG Masterclass</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Welcome to the Faceless IG Masterclass</h1>
            <div className="bg-black/60 border-red-500/40 backdrop-blur-sm rounded-xl p-6 mb-8">
              <p className="text-white text-lg leading-relaxed mb-4">
                Watch all the videos in order and apply what you'll learn to your page and videos.
              </p>
              <p className="text-white/80">
                You can download the links to the clip pack & other resources in the description of the first video of
                the editing tutorial 'Background clips'.
              </p>
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
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-white/60 text-sm mt-2">
                {completedLessons.length} of {totalLessons} lessons completed
              </p>
            </CardContent>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slide-up" delay={0.2}>
          <Card className="bg-black/60 border-red-500/40 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Download className="h-5 w-5 text-red-500" />
                Bonus Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">Access exclusive bonus materials to accelerate your success.</p>
              <Button asChild className="bg-red-600 hover:bg-red-700" size="lg">
                <a
                  href="https://drive.google.com/uc?export=download&id=1example"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Viral Clip Pack Bundle
                </a>
              </Button>
            </CardContent>
          </Card>
        </AnimatedElement>

        <div className="space-y-4">
          {courseStructure.map((chapter, chapterIndex) => (
            <AnimatedElement key={chapter.id} animation="slide-up" delay={0.1 * (chapterIndex + 3)}>
              <Card className="bg-black/60 border-red-500/40 backdrop-blur-sm">
                <Collapsible open={openChapters.includes(chapter.id)} onOpenChange={() => toggleChapter(chapter.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-black/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{chapter.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-red-500/40 text-red-400">
                            {chapter.subChapters.length} lessons
                          </Badge>
                          {openChapters.includes(chapter.id) ? (
                            <ChevronDown className="h-5 w-5 text-white/60" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-white/60" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {chapter.subChapters.map((lesson) => (
                          <div key={lesson.id} className="border border-white/10 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-white font-medium">{lesson.title}</h4>
                                  {completedLessons.includes(lesson.id) && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                                <p className="text-white/70 text-sm mb-3">{lesson.description}</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="aspect-video bg-black/40 rounded-lg overflow-hidden">
                                <iframe
                                  src={`https://player.vimeo.com/video/${lesson.vimeoUrl.split("/").pop()}`}
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full"
                                />
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={completedLessons.includes(lesson.id) ? "outline" : "default"}
                                className={
                                  completedLessons.includes(lesson.id)
                                    ? "border-green-500/40 text-green-400 hover:bg-green-500/20 bg-transparent"
                                    : "bg-red-600 hover:bg-red-700"
                                }
                                onClick={() => toggleLessonCompletion(lesson.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {completedLessons.includes(lesson.id) ? "Completed" : "Mark Complete"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </AnimatedElement>
          ))}
        </div>

        {/* Course Completion */}
        {completedLessons.length === totalLessons && (
          <AnimatedElement animation="slide-up" delay={0.8}>
            <Card className="bg-green-500/20 border-green-500/40 backdrop-blur-sm mt-8">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">Congratulations!</h3>
                <p className="text-white/80">
                  You've completed the Faceless IG Masterclass. You're now ready to build your own profitable Instagram
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

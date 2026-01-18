"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialPost {
  id: string
  platform: "facebook" | "instagram" | "twitter"
  content: string
  author: {
    name: string
    avatar?: string
    handle: string
  }
  media?: {
    type: "image" | "video"
    url: string
    thumbnail?: string
  }
  metrics: {
    likes: number
    comments: number
    shares: number
    views?: number
  }
  timestamp: string
  url: string
  hashtags?: string[]
}

const socialAccounts = {
  facebook: {
    name: "Facebook",
    handle: "Tax Code",
    url: "https://www.facebook.com/share/1FgjXAU1tV/?mibextid=wwXIfr",
    color: "#1877F2",
    icon: "📘",
  },
  instagram: {
    name: "Instagram",
    handle: "@taxcodeng",
    url: "https://www.instagram.com/taxcodeng/?igsh=MWx1dGc0Y2xzaGxw",
    color: "#E4405F",
    icon: "📷",
  },
  twitter: {
    name: "Twitter/X",
    handle: "@taxcodeng",
    url: "https://twitter.com/taxcodeng",
    color: "#000000",
    icon: "🐦",
  },
}

const mockPosts: SocialPost[] = [
  {
    id: "1",
    platform: "facebook",
    content: "📢 NEW TAX UPDATE: The Federal Inland Revenue Service has just announced changes to VAT filing deadlines. Starting from next month, all VAT returns must be filed within 21 days after the end of the tax period. Stay compliant and avoid penalties! #TaxNigeria #FIRS #VAT",
    author: {
      name: "Tax Code",
      handle: "Tax Code",
    },
    metrics: {
      likes: 245,
      comments: 32,
      shares: 18,
    },
    timestamp: "2 hours ago",
    url: "https://facebook.com/taxcode/posts/123456",
    hashtags: ["TaxNigeria", "FIRS", "VAT"],
  },
  {
    id: "2",
    platform: "instagram",
    content: "💡 Did you know? Proper tax planning can save your business up to 30% in legitimate tax deductions! Swipe to learn the top 5 tax-saving strategies for Nigerian businesses. #TaxTips #BusinessNigeria #TaxPlanning",
    author: {
      name: "Tax Code",
      handle: "@taxcodeng",
    },
    media: {
      type: "image",
      url: "https://via.placeholder.com/600x400/1e40af/ffffff?text=Tax+Saving+Tips",
      thumbnail: "https://via.placeholder.com/300x200/1e40af/ffffff?text=Tax+Tips",
    },
    metrics: {
      likes: 892,
      comments: 67,
      shares: 45,
    },
    timestamp: "5 hours ago",
    url: "https://instagram.com/p/ABC123",
    hashtags: ["TaxTips", "BusinessNigeria", "TaxPlanning"],
  },
  {
    id: "3",
    platform: "twitter",
    content: "🚨 TAX DEADLINE REMINDER: Company Income Tax returns for 2023 tax year must be filed by March 31, 2024! Don't wait until the last minute. File early to avoid penalties and ensure smooth processing. #TaxNigeria #CIT #Deadline",
    author: {
      name: "Tax Code",
      handle: "@taxcodeng",
    },
    metrics: {
      likes: 89,
      comments: 15,
      shares: 34,
    },
    timestamp: "6 hours ago",
    url: "https://twitter.com/taxcodeng/status/123456",
    hashtags: ["TaxNigeria", "CIT", "Deadline"],
  },
  {
    id: "4",
    platform: "facebook",
    content: "📊 TAX POLL: What's your biggest tax challenge as a business owner in Nigeria?\n\nA) Understanding complex regulations\nB) Meeting filing deadlines  \nC) Calculating correct amounts\nD) Dealing with tax authorities\n\nVote in the comments! 👇 #TaxPoll #NigeriaBusiness",
    author: {
      name: "Tax Code",
      handle: "Tax Code",
    },
    metrics: {
      likes: 156,
      comments: 78,
      shares: 23,
    },
    timestamp: "1 day ago",
    url: "https://www.facebook.com/share/1FgjXAU1tV/?mibextid=wwXIfr",
    hashtags: ["TaxPoll", "NigeriaBusiness"],
  },
]

interface SocialFeedProps {
  platform?: "all" | "facebook" | "instagram" | "twitter"
  limit?: number
  showHeader?: boolean
  className?: string
}

export function SocialFeed({
  platform = "all",
  limit = 5,
  showHeader = true,
  className,
}: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(platform)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredPosts = mockPosts
      if (activeTab !== "all") {
        filteredPosts = mockPosts.filter(post => post.platform === activeTab)
      }
      
      setPosts(filteredPosts.slice(0, limit))
      setLoading(false)
    }

    loadPosts()
  }, [activeTab, limit])

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  const getAccountInfo = (platform: string) => socialAccounts[platform as keyof typeof socialAccounts]

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading social media content...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            Tax Code Social Media
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All Posts
            </Button>
            {Object.entries(socialAccounts).map(([key, account]) => (
              <Button
                key={key}
                variant={activeTab === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(key as "facebook" | "instagram" | "twitter" | "all")}
                className="flex items-center gap-1"
              >
                <span>{account.icon}</span>
                {account.name}
              </Button>
            ))}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {posts.map((post) => {
          const account = getAccountInfo(post.platform)
          return (
            <div key={post.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={account.url} />
                    <AvatarFallback style={{ backgroundColor: account.color }}>
                      {account.icon}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{account.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {account.handle}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(post.url, "_blank")}
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm leading-relaxed">{post.content}</p>
                {post.media && (
                  <div className="relative rounded-md overflow-hidden">
                    {post.media.type === "image" ? (
                      <img
                        src={post.media.url}
                        alt="Post media"
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={post.media.thumbnail || post.media.url}
                          alt="Video thumbnail"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <ExternalLink className="h-6 w-6 text-gray-900" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {post.hashtags && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {formatNumber(post.metrics.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {formatNumber(post.metrics.comments)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {formatNumber(post.metrics.shares)}
                  </span>
                  {post.metrics.views && (
                    <span className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      {formatNumber(post.metrics.views)} views
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(post.url, "_blank")}
                >
                  View Post
                </Button>
              </div>
            </div>
          )
        })}

        {posts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No posts found for the selected platform.</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(socialAccounts).map(([key, account]) => (
              <Button
                key={key}
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => window.open(account.url, "_blank")}
              >
                <span style={{ color: account.color }}>{account.icon}</span>
                <span className="text-sm">Follow on {account.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
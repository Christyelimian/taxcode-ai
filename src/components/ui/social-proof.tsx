"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Share2, 
  Award,
  Star,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialProofProps {
  className?: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  avatar?: string
  content: string
  rating: number
  platform: "facebook" | "linkedin" | "twitter" | "google"
  date: string
  verified: boolean
}

interface SocialMetric {
  label: string
  value: string
  change: string
  icon: React.ElementType
  color: string
}

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Tax Consultant",
    company: "Deloitte Nigeria",
    avatar: "https://via.placeholder.com/100x100/4f46e5/ffffff?text=SJ",
    content: "Tax Code has revolutionized how I stay updated with Nigerian tax regulations. The insights are comprehensive and easy to understand.",
    rating: 5,
    platform: "linkedin",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "CFO",
    company: "TechCorp Africa",
    avatar: "https://via.placeholder.com/100x100/059669/ffffff?text=MC",
    content: "The platform's tax planning resources helped our company save over ₦5M in legitimate tax deductions. Highly recommended for businesses!",
    rating: 5,
    platform: "facebook",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "3",
    name: "Amina Bello",
    role: "Accountant",
    company: "Federal Ministry of Finance",
    avatar: "https://via.placeholder.com/100x100/dc2626/ffffff?text=AB",
    content: "As a government accountant, I find Tax Code's explanations of tax policies invaluable. It bridges the gap between law and practice.",
    rating: 5,
    platform: "twitter",
    date: "3 days ago",
    verified: true,
  },
]

const socialMetrics: SocialMetric[] = [
  {
    label: "Total Community Members",
    value: "29.4K",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Monthly Active Users",
    value: "8.7K",
    change: "+23.1%",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    label: "Social Shares",
    value: "45.2K",
    change: "+18.7%",
    icon: Share2,
    color: "text-purple-600",
  },
  {
    label: "User Satisfaction",
    value: "4.9/5",
    change: "+2.3%",
    icon: Star,
    color: "text-yellow-600",
  },
]

const platformStats = [
  { platform: "Facebook", followers: "15.2K", growth: "+8.3%", color: "bg-blue-600" },
  { platform: "Instagram", followers: "8.7K", growth: "+15.2%", color: "bg-pink-600" },
  { platform: "Twitter/X", followers: "2.1K", growth: "+31.4%", color: "bg-black" },
]

export function SocialProof({ className }: SocialProofProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [animatedMetrics, setAnimatedMetrics] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedMetrics(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % mockTestimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "📘"
      case "linkedin":
        return "💼"
      case "twitter":
        return "🐦"
      case "google":
        return "🔍"
      default:
        return "📱"
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="text-center space-y-2">
                  <div className={cn("h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto", metric.color)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={cn("text-2xl font-bold transition-all duration-1000", animatedMetrics ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="text-xs text-green-600 font-medium">{metric.change}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformStats.map((stat) => (
              <div key={stat.platform} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stat.platform}</span>
                  <div className={cn("w-3 h-3 rounded-full", stat.color)} />
                </div>
                <div className="text-2xl font-bold">{stat.followers}</div>
                <div className="text-sm text-green-600">{stat.growth}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Carousel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            What Our Community Says
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {mockTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-1">
                    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{testimonial.name}</span>
                            {testimonial.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                            {testimonial.company && ` • ${testimonial.company}`}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg">{getPlatformIcon(testimonial.platform)}</span>
                            <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{testimonial.content}</p>
                      <div className="flex items-center gap-2">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm text-muted-foreground ml-2">{testimonial.rating}.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex justify-center gap-2 mt-4">
              {mockTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === activeTestimonial ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <CardContent className="text-center p-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Join Our Growing Community!</h3>
            <p className="max-w-2xl mx-auto">
              Be part of Nigeria's most trusted tax awareness platform. Connect with professionals, 
              stay updated with the latest tax news, and contribute to the conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Users className="h-4 w-4 mr-2" />
                Join Community
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="h-4 w-4 mr-2" />
                Follow on Social Media
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Community Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New member joined", user: "John Doe", time: "5 minutes ago", icon: Users },
              { action: "Shared insight on", content: "VAT Updates 2024", user: "Sarah Johnson", time: "12 minutes ago", icon: Share2 },
              { action: "Commented on", content: "Tax Planning Guide", user: "Michael Chen", time: "28 minutes ago", icon: MessageCircle },
              { action: "Liked", content: "Company Income Tax Explained", user: "Amina Bello", time: "1 hour ago", icon: Heart },
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                    {activity.content && (
                      <span className="font-medium"> {activity.content}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { SocialShare, FloatingShare } from "@/components/ui/social-share"
import { SocialFeed } from "@/components/ui/social-feed"
import { SocialProof } from "@/components/ui/social-proof"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Share2, Heart, MessageCircle, Users, TrendingUp, Award } from "lucide-react"

export default function SocialMediaDemo() {
  const currentUrl = "https://taxcode.ng/social-demo"
  const currentTitle = "Tax Code - Social Media Integration Demo"
  const currentDescription = "Check out our innovative social media integration features for Tax Code Nigeria!"

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Social Media Integration Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience our innovative social media features designed to enhance engagement and reach for Tax Code Nigeria
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">Facebook</Badge>
          <Badge variant="secondary">Instagram</Badge>
          <Badge variant="secondary">LinkedIn</Badge>
          <Badge variant="secondary">YouTube</Badge>
        </div>
      </div>

      {/* Social Proof Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Proof & Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15.2K</div>
              <div className="text-sm text-muted-foreground">Facebook Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">8.7K</div>
              <div className="text-sm text-muted-foreground">Instagram Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">3.4K</div>
              <div className="text-sm text-muted-foreground">LinkedIn Connections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2.1K</div>
              <div className="text-sm text-muted-foreground">YouTube Subscribers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Components Demo */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Share Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Default Share Button</h4>
              <SocialShare
                url={currentUrl}
                title={currentTitle}
                description={currentDescription}
                hashtags={["TaxCode", "Nigeria", "Tax"]}
              />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Outline Variant</h4>
              <SocialShare
                url={currentUrl}
                title={currentTitle}
                description={currentDescription}
                variant="outline"
                hashtags={["TaxCode", "Nigeria", "Tax"]}
              />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Ghost Variant (Small)</h4>
              <SocialShare
                url={currentUrl}
                title={currentTitle}
                description={currentDescription}
                variant="ghost"
                size="sm"
                hashtags={["TaxCode", "Nigeria", "Tax"]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">Like this content</span>
              </div>
              <Button variant="ghost" size="sm">1,234 Likes</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Join discussion</span>
              </div>
              <Button variant="ghost" size="sm">89 Comments</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Share achievement</span>
              </div>
              <Button variant="ghost" size="sm">Share Badge</Button>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Viral Content Alert</div>
              <div className="text-xs text-muted-foreground">
                This post is trending with 5.2K shares in the last 24 hours!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Feed Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Live Social Media Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <SocialFeed
            platform="all"
            limit={3}
            showHeader={true}
            className="border-0 shadow-none p-0"
          />
        </CardContent>
      </Card>

      {/* Platform-Specific Feeds */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Facebook & Instagram Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialFeed
              platform="facebook"
              limit={2}
              showHeader={false}
              className="border-0 shadow-none p-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LinkedIn & YouTube Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialFeed
              platform="linkedin"
              limit={2}
              showHeader={false}
              className="border-0 shadow-none p-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* Social Proof Section */}
      <SocialProof />

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <CardContent className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Social Community!</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Follow us on all platforms to stay updated with the latest tax news, insights, and educational content. 
            Be part of Nigeria's growing tax awareness movement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" size="lg">
              <Share2 className="h-4 w-4 mr-2" />
              Share This Page
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 hover:bg-white/20">
              Follow All Platforms
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Share (will appear on scroll) */}
      <FloatingShare
        url={currentUrl}
        title={currentTitle}
        description={currentDescription}
        hashtags={["TaxCode", "Nigeria", "Tax"]}
        position="right"
      />
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2, Facebook, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  image?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const socialPlatforms = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    getShareUrl: (data: SocialShareProps) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.title)}`,
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: MessageCircle,
    color: "#000000",
    getShareUrl: (data: SocialShareProps) => {
      const text = `${data.title}${data.description ? `\n\n${data.description}` : ""}`
      const hashtags = data.hashtags?.join(",") || "TaxCode,Nigeria,Tax"
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}&hashtags=${encodeURIComponent(hashtags)}`
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    getShareUrl: (data: SocialShareProps) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}&summary=${encodeURIComponent(data.description || "")}`,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    getShareUrl: () => "#",
    action: "copy",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "#FF0000",
    getShareUrl: () => "#",
    action: "copy",
  },
]

export function SocialShare({
  url,
  title,
  description,
  hashtags,
  image,
  variant = "outline",
  size = "default",
}: SocialShareProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async (platform: typeof socialPlatforms[0]) => {
    if (platform.action === "copy") {
      try {
        await navigator.clipboard.writeText(`${title}\n${url}${description ? `\n\n${description}` : ""}`)
        toast.success(`Content copied! Share it on ${platform.name}`)
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share content")
      }
    }
      return
    }

    const shareUrl = platform.getShareUrl({ url, title, description, hashtags, image })
    
    if (shareUrl === "#") {
      toast.info(`Direct sharing to ${platform.name} not available. Content copied to clipboard!`)
      try {
        await navigator.clipboard.writeText(`${title}\n${url}`)
      } catch (error) {
        toast.error("Failed to copy content")
      }
      return
    }

    setIsSharing(true)
    try {
      window.open(shareUrl, "_blank", "width=550,height=420,popup=yes")
      toast.success(`Opening ${platform.name} share dialog...`)
    } catch (error) {
      toast.error(`Failed to open ${platform.name} share dialog`)
      console.error('Share error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      toast.error("Native sharing not supported on this device")
      return
    }

    try {
      await navigator.share({
        title,
        text: description,
        url,
      })
      toast.success("Content shared successfully!")
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share content")
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      {typeof navigator !== "undefined" && navigator.share && (
        <Button
          variant={variant}
          size={size}
          onClick={handleNativeShare}
          className="shrink-0"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} disabled={isSharing}>
            <Share2 className="h-4 w-4 mr-2" />
            {navigator.share ? "More" : "Share"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            return (
              <DropdownMenuItem
                key={platform.id}
                onClick={() => handleShare(platform)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Icon className="h-4 w-4" style={{ color: platform.color }} />
                <span>{platform.name}</span>
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuItem
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url)
                toast.success("Link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
        console.error('Copy link error:', error)
      }
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Copy Link</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface FloatingShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  image?: string
  position?: "left" | "right"
}

export function FloatingShare({
  url,
  title,
  description,
  hashtags,
  image,
  position = "left",
}: FloatingShareProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${position === "left" ? "left-4" : "right-4"} hidden lg:block`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="relative">
        <div className={`transition-all duration-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
          <div className="bg-background border rounded-lg shadow-lg p-2">
            {socialPlatforms.slice(0, 4).map((platform) => {
              const Icon = platform.icon
              return (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform)}
                  className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                  style={{ color: platform.color }}
                  title={platform.name}
                >
                  <Icon className="h-5 w-5" />
                </button>
              )
            })}
          </div>
        </div>
        {!isVisible && (
          <div className="absolute inset-y-0 flex items-center">
            <div className="bg-primary text-primary-foreground rounded-r-md px-1 py-2 text-xs font-medium writing-mode-vertical">
              SHARE
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function handleShare(platform: typeof socialPlatforms[0]) {
  const url = window.location.href
  const title = document.title
  const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || ""

  if (platform.action === "copy") {
    navigator.clipboard.writeText(`${title}\n${url}`)
    return
  }

  const shareUrl = platform.getShareUrl({ url, title, description })
  if (shareUrl !== "#") {
    window.open(shareUrl, "_blank", "width=550,height=420,popup=yes")
  }
}
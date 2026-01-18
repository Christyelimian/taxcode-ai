"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Save, 
  ExternalLink, 
  Plus, 
  Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface SocialMediaAccount {
  id: string
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube"
  name: string
  url: string
  handle: string
  isActive: boolean
  description?: string
  followers?: string
  lastUpdated?: string
}

const platformConfig = {
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    placeholder: "https://www.facebook.com/your-page",
    handlePlaceholder: "@your-page"
  },
  instagram: {
    name: "Instagram", 
    icon: Instagram,
    color: "bg-pink-600",
    placeholder: "https://www.instagram.com/your-profile",
    handlePlaceholder: "@your-profile"
  },
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "bg-black",
    placeholder: "https://twitter.com/your-handle",
    handlePlaceholder: "@your-handle"
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    placeholder: "https://linkedin.com/company/your-company",
    handlePlaceholder: "your-company"
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    placeholder: "https://youtube.com/@your-channel",
    handlePlaceholder: "@your-channel"
  }
}

export default function SocialMediaSettings() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Initialize with current accounts
  useEffect(() => {
    const initialAccounts: SocialMediaAccount[] = [
      {
        id: "1",
        platform: "facebook",
        name: "Tax Code",
        url: "https://www.facebook.com/share/1FgjXAU1tV/?mibextid=wwXIfr",
        handle: "Tax Code",
        isActive: true,
        followers: "15.2K",
        lastUpdated: new Date().toISOString()
      },
      {
        id: "2", 
        platform: "instagram",
        name: "Tax Code Nigeria",
        url: "https://www.instagram.com/taxcodeng/?igsh=MWx1dGc0Y2xzaGxw",
        handle: "@taxcodeng",
        isActive: true,
        followers: "8.7K",
        lastUpdated: new Date().toISOString()
      },
      {
        id: "3",
        platform: "twitter", 
        name: "Tax Code",
        url: "https://twitter.com/taxcodeng",
        handle: "@taxcodeng",
        isActive: false,
        followers: "2.1K",
        lastUpdated: new Date().toISOString()
      }
    ]
    setAccounts(initialAccounts)
  }, [])

  const handleAccountUpdate = (accountId: string, field: keyof SocialMediaAccount, value: any) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, [field]: value, lastUpdated: new Date().toISOString() }
        : account
    ))
  }

  const handleAddAccount = (platform: keyof typeof platformConfig) => {
    const newAccount: SocialMediaAccount = {
      id: Date.now().toString(),
      platform,
      name: `Tax Code ${platformConfig[platform].name}`,
      url: "",
      handle: "",
      isActive: false,
      lastUpdated: new Date().toISOString()
    }
    setAccounts(prev => [...prev, newAccount])
  }

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId))
    toast({
      title: "Account Removed",
      description: "Social media account has been removed."
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update footer social links dynamically
      const activeAccounts = accounts.filter(acc => acc.isActive)
      
      toast({
        title: "Settings Saved",
        description: `Updated ${activeAccounts.length} social media accounts.`
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save social media settings.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
  }

  const getActiveAccounts = () => accounts.filter(account => account.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Settings</h2>
          <p className="text-muted-foreground">Manage your social media accounts and links</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Preview Footer */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Footer Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-white p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">Follow us:</span>
                {getActiveAccounts().map((account) => {
                  const config = platformConfig[account.platform]
                  const Icon = config.icon
                  return (
                    <a
                      key={account.id}
                      href={account.url}
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label={config.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
                {getActiveAccounts().length === 0 && (
                  <span className="text-slate-500 text-sm">No active social media accounts</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Account */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(platformConfig).map(([platform, config]) => {
              const Icon = config.icon
              const hasAccount = accounts.some(acc => acc.platform === platform)
              
              return (
                <Button
                  key={platform}
                  variant={hasAccount ? "outline" : "default"}
                  onClick={() => !hasAccount && handleAddAccount(platform as keyof typeof platformConfig)}
                  disabled={hasAccount || previewMode}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {config.name}
                  {hasAccount && <Badge variant="secondary">Added</Badge>}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manage Accounts */}
      <div className="space-y-4">
        {accounts.map((account) => {
          const config = platformConfig[account.platform]
          const Icon = config.icon
          
          return (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", config.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {account.followers && `${account.followers} followers`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${account.id}`} className="text-sm">Active</Label>
                      <Switch
                        id={`active-${account.id}`}
                        checked={account.isActive}
                        onCheckedChange={(checked) => handleAccountUpdate(account.id, 'isActive', checked)}
                        disabled={previewMode}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      disabled={previewMode}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${account.id}`}>Display Name</Label>
                    <Input
                      id={`name-${account.id}`}
                      value={account.name}
                      onChange={(e) => handleAccountUpdate(account.id, 'name', e.target.value)}
                      placeholder={`Tax Code ${config.name}`}
                      disabled={previewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`handle-${account.id}`}>Handle</Label>
                    <Input
                      id={`handle-${account.id}`}
                      value={account.handle}
                      onChange={(e) => handleAccountUpdate(account.id, 'handle', e.target.value)}
                      placeholder={config.handlePlaceholder}
                      disabled={previewMode}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`url-${account.id}`}>Profile URL</Label>
                  <Input
                    id={`url-${account.id}`}
                    value={account.url}
                    onChange={(e) => handleAccountUpdate(account.id, 'url', e.target.value)}
                    placeholder={config.placeholder}
                    disabled={previewMode}
                  />
                </div>

                <div>
                  <Label htmlFor={`description-${account.id}`}>Description (Optional)</Label>
                  <Textarea
                    id={`description-${account.id}`}
                    value={account.description || ""}
                    onChange={(e) => handleAccountUpdate(account.id, 'description', e.target.value)}
                    placeholder={`Brief description of your ${config.name} account...`}
                    rows={2}
                    disabled={previewMode}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(account.url, '_blank')}
                    disabled={!account.url || previewMode}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Profile
                  </Button>
                  {account.lastUpdated && (
                    <span className="text-sm text-muted-foreground">
                      Last updated: {new Date(account.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No social media accounts configured yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Add your first account using the buttons above.</p>
          </CardContent>
        </Card>
      )}

      {/* Save Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Save Changes</h3>
              <p className="text-sm text-muted-foreground">
                Update your social media links across the website
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving || previewMode}>
              {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save All Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
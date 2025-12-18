'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { submitContactForm } from '@/app/actions'
import { useToast } from '@/hooks/use-toast'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await submitContactForm(formData)
      if (result.success) {
        toast({ title: 'Message sent!', description: 'We\'ll get back to you soon.' })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  return (
    <div className="bg-background">
      <section className="relative">
        <div className="container mx-auto px-4 pt-20 pb-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <Badge variant="secondary" className="mb-4">Contact Us</Badge>
              <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tight mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Have questions about tax law, need assistance with compliance, or want to partner with us? We're here to help.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/10 to-primary/10 rounded-2xl blur-xl" aria-hidden />
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-primary">Reach Out</CardTitle>
                  <CardDescription>Connect with our team for support and collaboration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>contact@taxcode.ng</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>+234 123 456 7890</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Lagos, Nigeria</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll respond promptly</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a href="mailto:contact@taxcode.ng" className="text-muted-foreground hover:text-primary">contact@taxcode.ng</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href="tel:+2341234567890" className="text-muted-foreground hover:text-primary">+234 123 456 7890</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Address</div>
                      <p className="text-muted-foreground">123 Tax Street, Lagos, Nigeria</p>
                      <a href="https://maps.google.com/?q=123+Tax+Street+Lagos+Nigeria" target="_blank" rel="noopener" className="text-primary hover:underline">View on Map</a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM WAT</p>
                  <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM WAT</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Bot, MessageSquare, Send, X, LoaderCircle, User, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { streamChatWithPuter } from '@/lib/puter-ai'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  documentation?: string
}

export default function HomepageChatbot() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [puterAvailable, setPuterAvailable] = useState<boolean | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: "Hello! I'm TaxCode. Ask me anything about the new Nigerian Tax Reform Act.",
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, quickQuestion?: string) => {
    e?.preventDefault()
    const currentInput = quickQuestion || input
    if (!currentInput.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: currentInput }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      // Try Puter first, but only if we haven't checked availability yet or it's available
      if (puterAvailable !== false && typeof window !== 'undefined') {
        try {
          const assistantMessageId = (Date.now() + 1).toString()
          setMessages((prev) => [
            ...prev,
            {
              id: assistantMessageId,
              role: 'assistant',
              content: '',
            },
          ])

          let fullResponse = ''
          const generator = streamChatWithPuter(currentInput, 'anthropic/claude-3.5-sonnet')

          for await (const chunk of generator) {
            if (!chunk.done) {
              fullResponse += chunk.text
              setMessages((prev) =>
                prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg))
              )
            }
          }
          setPuterAvailable(true); // Mark as available
          return; // Success with Puter
        } catch (puterError) {
          console.warn('Puter AI failed, falling back to server API:', puterError);
          setPuterAvailable(false); // Mark as unavailable
          // Continue to server API fallback
        }
      }

      // Fallback to server-side API
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
        },
      ]);

      const apiResponse = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: currentInput }),
      });

      const response = await apiResponse.json();

      if (apiResponse.ok && response.success && response.data) {
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: response.data.answer,
          documentation: response.data.documentation,
        };
        setMessages((prev) => prev.map(m => m.id === assistantMessageId ? assistantMessage : m));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "An unknown error occurred.",
        });
        setMessages((prev) => prev.slice(0, prev.length - 1)); // Remove the assistant message
      }
    } catch (error) {
      console.error('Error in chat:', error)
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to get response. Please try again.' })
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed bottom-0 right-0 m-6 z-50 transition-transform duration-300',
          isOpen ? 'translate-x-[500px]' : 'translate-x-0'
        )}
      >
        <Button size="icon" className="w-16 h-16 rounded-full shadow-lg" onClick={() => setIsOpen(true)}>
          <MessageSquare className="w-8 h-8" />
        </Button>
      </div>

      <div
        className={cn(
          'fixed bottom-0 right-0 m-6 z-[60] w-[calc(100vw-2rem)] max-w-sm transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        )}
      >
        <Card className="h-[70vh] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">AI Tax Assistant</CardTitle>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {puterAvailable ? 'OpenRouter (Puter)' : 'API'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn('flex items-start gap-3', message.role === 'user' && 'justify-end')}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-xs rounded-lg p-3 text-sm shadow',
                        message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.documentation && (
                        <Accordion type="single" collapsible className="w-full mt-2">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xs hover:no-underline py-1">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>View Source</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-xs font-code bg-background/50 p-2 rounded-md mt-1">
                              {message.documentation}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs w-full rounded-lg p-3 bg-muted rounded-bl-none shadow space-y-2">
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-grow resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

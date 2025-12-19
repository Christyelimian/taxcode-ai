
'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, User, Send, BookOpen, LoaderCircle, Languages, Volume2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { textToSpeech } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { streamChatWithPuter } from '@/lib/puter-ai';

type Language = 'en' | 'ha' | 'yo' | 'ig';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    documentation?: string;
}

const quickQuestions = [
    "What is the current VAT rate in Nigeria?",
    "Explain Capital Gains Tax.",
    "What are the tax implications of cryptocurrency?",
    "How do I file my personal income tax return?",
];

export default function TaxAssistant() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState<Language>('en');
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [usePuter, setUsePuter] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: "Welcome to TaxCode! I'm your dedicated assistant for Nigerian tax law. How can I help you today? Select a language and I can speak the response.",
                },
            ]);
        }
        // Check if Puter is available
        if (typeof window !== 'undefined' && (window as any).puter) {
            setUsePuter(true);
        }
    }, [messages.length]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, audioDataUri]);

    const handleSpeak = async (message: Message) => {
        if (speakingMessageId === message.id) {
            // If it's already speaking this message, stop it
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            if(audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setSpeakingMessageId(null);
            setAudioDataUri(null);
            return;
        }

        setSpeakingMessageId(message.id);
        setAudioDataUri(null);

        // Prefer browser-native TTS (Gemini TTS removed; project uses OpenRouter/Puter).
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                const utter = new SpeechSynthesisUtterance(message.content);
                const langMap: Record<string, string> = {
                    en: 'en-NG',
                    ha: 'ha',
                    yo: 'yo',
                    ig: 'ig',
                };
                utter.lang = langMap[language] || 'en-NG';
                utter.onend = () => handleAudioEnded();
                utter.onerror = () => handleAudioEnded();
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utter);
                return;
            } catch (e) {
                // Fall through to server action (may be unavailable)
                console.warn('SpeechSynthesis failed, falling back to server TTS:', e);
            }
        }

        const response = await textToSpeech({ text: message.content, language });

        if (response.success && response.data) {
            setAudioDataUri(response.data.audioDataUri);
        } else {
            toast({
                variant: "destructive",
                title: "Speech Failed",
                description: response.error || "Could not generate audio for this message.",
            });
            setSpeakingMessageId(null);
        }
    };

    const handleAudioEnded = () => {
        setSpeakingMessageId(null);
        setAudioDataUri(null);
    };

    const handleQuickQuestion = async (question: string) => {
        setIsLoading(true);
        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: question };
        setMessages(prev => [...prev, userMessage]);

        try {
            if (usePuter && typeof window !== 'undefined') {
                // Use Puter with OpenRouter
                const assistantMessageId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: '',
                }]);

                let fullResponse = '';
                const generator = streamChatWithPuter(question, 'anthropic/claude-3.5-sonnet');

                for await (const chunk of generator) {
                    if (!chunk.done) {
                        fullResponse += chunk.text;
                        setMessages(prev => 
                            prev.map(msg => 
                                msg.id === assistantMessageId 
                                    ? { ...msg, content: fullResponse }
                                    : msg
                            )
                        );
                    }
                }
            } else {
                // Fallback to server-side API
                const apiResponse = await fetch('/api/assistant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question }),
                });

                const response = await apiResponse.json();

                if (apiResponse.ok && response.success && response.data) {
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: response.data.answer,
                        documentation: response.data.documentation,
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: response.error || "An unknown error occurred.",
                    })
                    setMessages(prev => prev.slice(0, prev.length -1));
                }
            }
        } catch (error) {
            console.error('Error in quick question:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to get response. Please try again.",
            });
            setMessages(prev => prev.slice(0, prev.length -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const question = input;
        setInput('');

        try {
            if (usePuter && typeof window !== 'undefined') {
                // Use Puter with OpenRouter
                const assistantMessageId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: '',
                }]);

                let fullResponse = '';
                const generator = streamChatWithPuter(question, 'anthropic/claude-3.5-sonnet');

                for await (const chunk of generator) {
                    if (!chunk.done) {
                        fullResponse += chunk.text;
                        setMessages(prev => 
                            prev.map(msg => 
                                msg.id === assistantMessageId 
                                    ? { ...msg, content: fullResponse }
                                    : msg
                            )
                        );
                    }
                }
            } else {
                // Fallback to server-side API
                const apiResponse = await fetch('/api/assistant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question }),
                });
        
                const response = await apiResponse.json();
        
                if (apiResponse.ok && response.success && response.data) {
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: response.data.answer,
                        documentation: response.data.documentation,
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: response.error || "An unknown error occurred.",
                    })
                    setMessages(prev => prev.slice(0, prev.length -1));
                }
            }
        } catch (error) {
            console.error('Error in chat:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to get response. Please try again.",
            });
            setMessages(prev => prev.slice(0, prev.length -1));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card">
          <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 md:p-6 space-y-6">
                    {messages.map((message) => (
                        <div key={message.id} className={cn('flex items-start gap-4', message.role === 'user' && 'justify-end')}>
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn('max-w-xl rounded-lg p-4 text-sm shadow-md', message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background rounded-bl-none')}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                {message.documentation && (
                                     <Accordion type="single" collapsible className="w-full mt-4">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="text-xs hover:no-underline">
                                                <div className="flex items-center gap-2">
                                                   <BookOpen className="h-4 w-4" />
                                                   <span>View Documentation</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-xs font-code bg-muted p-3 rounded-md mt-2">
                                                {message.documentation}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                                {message.role === 'assistant' && (
                                    <div className="mt-2 flex justify-end">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSpeak(message)}>
                                            {speakingMessageId === message.id ? <XCircle className="h-4 w-4 text-destructive" /> : <Volume2 className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                )}
                                {speakingMessageId === message.id && audioDataUri && (
                                    <div className="mt-2">
                                        <audio
                                            ref={audioRef}
                                            src={audioDataUri}
                                            autoPlay
                                            onEnded={handleAudioEnded}
                                            onPlay={() => setSpeakingMessageId(message.id)}
                                            onPause={handleAudioEnded}
                                            onError={handleAudioEnded}
                                        />
                                    </div>
                                )}
                                 {speakingMessageId === message.id && !audioDataUri && (
                                    <div className="flex items-center gap-2 text-muted-foreground mt-2 text-xs">
                                        <LoaderCircle className="h-3 w-3 animate-spin"/>
                                        <span>Generating speech...</span>
                                    </div>
                                )}
                            </div>
                             {message.role === 'user' && (
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xl w-full rounded-lg p-4 bg-background rounded-bl-none shadow-md space-y-2">
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
          </div>
            <div className="p-4 md:p-6 bg-card border-t shrink-0">
                 <div className="mb-4 flex flex-wrap gap-2 items-center">
                    {quickQuestions.map((q, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => handleQuickQuestion(q)} disabled={isLoading}>
                            {q}
                        </Button>
                    ))}
                    <div className="ml-auto">
                         <Select onValueChange={(value: Language) => setLanguage(value)} defaultValue={language}>
                            <SelectTrigger className="w-[180px]">
                                <Languages className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ha">Hausa</SelectItem>
                                <SelectItem value="yo">Yoruba</SelectItem>
                                <SelectItem value="ig">Igbo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about Nigerian tax law..."
                        className="flex-grow resize-none"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e as any);
                            }
                        }}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}

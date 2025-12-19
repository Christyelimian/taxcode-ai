'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  Bot,
  BookOpen,
  CirclePlus,
  LoaderCircle,
  Mic,
  Paperclip,
  Search,
  Send,
  Settings,
  Sparkles,
  Trash2,
  Languages,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type Language = 'en' | 'ha' | 'yo' | 'ig';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  documentation?: string;
  ts: number;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  language: Language;
  pinned?: boolean;
};

const STORAGE_KEY = 'taxcode_worldclass_assistant_v1';
const USAGE_KEY_PREFIX = 'taxcode_worldclass_usage_';

const QUICK_TEMPLATES: Array<{ title: string; prompt: string }> = [
  { title: '🧾 File my PIT', prompt: 'Guide me step-by-step to file my Personal Income Tax (PIT) in Nigeria for 2026.' },
  { title: '🧮 Calculate VAT', prompt: 'Help me calculate VAT for a service invoice and explain input vs output VAT.' },
  { title: '📘 Understand 2026 reforms', prompt: 'Explain the 2026 tax reforms in plain language and what changed for individuals and SMEs.' },
  { title: '🏢 Small company tax', prompt: 'Am I a small company in Nigeria? Explain the criteria and likely CIT obligations.' },
];

const INITIAL_CHIPS = [
  'What is VAT in Nigeria?',
  'How does PAYE work?',
  'Explain the 2026 reforms',
  'Small business taxes in Nigeria',
];

function newConversation(language: Language): Conversation {
  const now = Date.now();
  return {
    id: `c_${now}`,
    title: 'New chat',
    createdAt: now,
    updatedAt: now,
    language,
    messages: [
      {
        id: `m_${now}`,
        role: 'assistant',
        ts: now,
        content:
          "Hi there! I’m your AI Tax Assistant for Nigerian tax law. Ask any tax question—I'll answer clearly and cite the Knowledge Base when available.",
      },
    ],
  };
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function usageKeyForToday() {
  return `${USAGE_KEY_PREFIX}${dayKey()}`;
}

function getUsageRemaining(maxPerDay: number) {
  try {
    const raw = localStorage.getItem(usageKeyForToday());
    const used = raw ? Number(raw) : 0;
    const safeUsed = Number.isFinite(used) ? Math.max(0, used) : 0;
    return { used: safeUsed, remaining: Math.max(0, maxPerDay - safeUsed) };
  } catch {
    return { used: 0, remaining: maxPerDay };
  }
}

function incrementUsage() {
  try {
    const key = usageKeyForToday();
    const raw = localStorage.getItem(key);
    const used = raw ? Number(raw) : 0;
    const next = (Number.isFinite(used) ? used : 0) + 1;
    localStorage.setItem(key, String(next));
  } catch {
    // ignore
  }
}

export default function WorldclassAssistant() {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState<Language>('en');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState('Analyzing your question...');
  const [recording, setRecording] = useState(false);
  const [usage, setUsage] = useState<{ used: number; remaining: number }>({ used: 0, remaining: 5 });

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [activeId, conversations]
  );

  // Load persisted conversations
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { conversations?: Conversation[]; activeId?: string; language?: Language };
        const loaded = Array.isArray(parsed?.conversations) ? parsed.conversations : [];
        const nextLanguage = (parsed?.language as Language | undefined) ?? 'en';
        setLanguage(nextLanguage);
        setConversations(loaded.length ? loaded : [newConversation(nextLanguage)]);
        setActiveId(parsed?.activeId && loaded.some((c) => c.id === parsed.activeId) ? parsed.activeId : (loaded[0]?.id || `c_${Date.now()}`));
      } else {
        const c = newConversation('en');
        setConversations([c]);
        setActiveId(c.id);
      }
    } catch {
      const c = newConversation('en');
      setConversations([c]);
      setActiveId(c.id);
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          conversations,
          activeId,
          language,
        })
      );
    } catch {
      // ignore
    }
  }, [activeId, conversations, language]);

  // Usage meter (simple local daily cap)
  useEffect(() => {
    setUsage(getUsageRemaining(5));
  }, [activeId, conversations.length]);

  // Auto-scroll on message change
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeConversation?.messages?.length, isLoading]);

  // Thinking indicator states
  useEffect(() => {
    if (!isLoading) return;
    const states = [
      'Analyzing your question...',
      'Searching tax law database...',
      'Preparing your answer...',
    ];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % states.length;
      setThinkingText(states[i]);
    }, 1200);
    return () => clearInterval(t);
  }, [isLoading]);

  function setActiveConversationMessage(updater: (c: Conversation) => Conversation) {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? updater(c) : c)));
  }

  function handleNewChat(nextLang?: Language) {
    const lang = nextLang ?? language;
    const c = newConversation(lang);
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
  }

  function titleFromFirstUserMessage(messages: ChatMessage[]) {
    const firstUser = messages.find((m) => m.role === 'user');
    if (!firstUser) return 'New chat';
    const t = firstUser.content.trim().replace(/\s+/g, ' ');
    return t.length > 40 ? `${t.slice(0, 40)}…` : t;
  }

  async function send(question: string) {
    if (!activeConversation) return;
    if (!question.trim()) return;
    if (isLoading) return;

    const { remaining } = getUsageRemaining(5);
    if (remaining <= 0) {
      toast({
        variant: 'destructive',
        title: 'Daily limit reached',
        description: 'Free users: 5 questions per day. Please try again tomorrow.',
      });
      return;
    }

    setIsLoading(true);

    const now = Date.now();
    const userMsg: ChatMessage = { id: `m_${now}`, role: 'user', content: question, ts: now };
    const assistantId = `m_${now + 1}`;
    const assistantPlaceholder: ChatMessage = { id: assistantId, role: 'assistant', content: '', ts: now + 1 };

    setActiveConversationMessage((c) => {
      const nextMessages: ChatMessage[] = [...c.messages, userMsg, assistantPlaceholder];
      return {
        ...c,
        updatedAt: now,
        title: c.title === 'New chat' ? titleFromFirstUserMessage(nextMessages) : c.title,
        language,
        messages: nextMessages,
      };
    });

    incrementUsage();
    setUsage(getUsageRemaining(5));

    try {
      const history = (activeConversation.messages || []).slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant-worldclass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          language,
          history,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to get response');
      }

      const answer = String(json?.data?.answer || '').trim();
      const documentation = String(json?.data?.documentation || '').trim();
      const suggestedQuestions: string[] = Array.isArray(json?.data?.suggestedQuestions)
        ? json.data.suggestedQuestions.map((s: any) => String(s)).filter(Boolean)
        : [];

      setActiveConversationMessage((c) => ({
        ...c,
        updatedAt: Date.now(),
        messages: c.messages.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: answer || 'Sorry — I could not generate an answer.',
                documentation: documentation || undefined,
              }
            : m
        ),
      }));

      // Update chips (stored as a synthetic assistant metadata message? keep in state only)
      if (suggestedQuestions.length) {
        // no-op: we render suggestions from latest response dynamically
      }
    } catch (e: any) {
      setActiveConversationMessage((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Sorry — something went wrong. Please retry.' }
            : m
        ),
      }));

      toast({
        variant: 'destructive',
        title: 'Assistant error',
        description: e?.message || 'Failed to get response. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input;
    setInput('');
    void send(q);
  }

  function handleMic() {
    // Lightweight v1: use Web Speech API (where supported) to fill input (voice-to-text).
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Voice not supported',
        description: 'Your browser does not support voice input on this device.',
      });
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.lang = language === 'en' ? 'en-NG' : language; // best-effort

      setRecording(true);
      let finalText = '';

      rec.onresult = (ev: any) => {
        let interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const transcript = ev.results[i][0]?.transcript || '';
          if (ev.results[i].isFinal) finalText += transcript;
          else interim += transcript;
        }
        setInput((finalText + ' ' + interim).trim());
      };
      rec.onerror = () => setRecording(false);
      rec.onend = () => setRecording(false);
      rec.start();
    } catch {
      setRecording(false);
    }
  }

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      if (c.title.toLowerCase().includes(q)) return true;
      return c.messages.some((m) => m.content.toLowerCase().includes(q));
    });
  }, [conversations, search]);

  const latestAssistant = useMemo(() => {
    if (!activeConversation) return null;
    const msgs = activeConversation.messages;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i]?.role === 'assistant') return msgs[i];
    }
    return null;
  }, [activeConversation]);

  const suggestedChips = useMemo(() => {
    // If the latest assistant message has no documentation (e.g. initial welcome), show initial chips.
    if (!latestAssistant || latestAssistant.content.includes('Hi there!')) return INITIAL_CHIPS;
    // We don’t persist suggestedQuestions yet; instead show generic ones until the next endpoint enhancement.
    return [
      'Give a simple summary',
      'Show the step-by-step process',
      'What documents do I need?',
      'Common mistakes to avoid',
    ];
  }, [latestAssistant]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-foreground">AI Tax Assistant</div>
              <div className="text-xs text-muted-foreground">Nigeria’s tax co-pilot • Powered by OpenRouter</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(v: Language) => setLanguage(v)}>
              <SelectTrigger className="w-[160px]">
                <Languages className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ha">Hausa</SelectItem>
                <SelectItem value="yo">Yoruba</SelectItem>
                <SelectItem value="ig">Igbo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleNewChat()}>
              <CirclePlus className="mr-2 h-4 w-4" />
              New chat
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 md:grid-cols-[320px_1fr]">
        {/* Left panel */}
        <aside className="hidden border-r bg-muted/30 md:block">
          <div className="p-4">
            <Button className="w-full" onClick={() => handleNewChat()}>
              <CirclePlus className="mr-2 h-4 w-4" />
              New Chat
            </Button>

            <div className="mt-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-80px-180px)] px-2">
            <div className="space-y-2 p-2">
              {filteredConversations.map((c) => {
                const active = c.id === activeId;
                const msgCount = c.messages.length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      'w-full rounded-xl border bg-background p-3 text-left shadow-sm transition',
                      active ? 'border-primary ring-1 ring-primary/20' : 'hover:border-primary/30'
                    )}
                  >
                    <div className="line-clamp-2 text-sm font-semibold text-foreground">{c.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(c.updatedAt).toLocaleDateString()} • {msgCount} messages
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="mb-3 text-xs font-semibold text-muted-foreground">QUICK START</div>
            <div className="space-y-2">
              {QUICK_TEMPLATES.map((t) => (
                <button
                  key={t.title}
                  className="w-full rounded-xl border bg-background p-3 text-left text-sm shadow-sm transition hover:border-primary/30"
                  onClick={() => void send(t.prompt)}
                >
                  <div className="font-medium text-foreground">{t.title}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{t.prompt}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Coming soon', description: 'Settings panel will be added next.' })}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <main className="min-h-[calc(100vh-80px)]">
          {/* Hero */}
          <div className="relative overflow-hidden border-b bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.45),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(245,158,11,0.25),transparent_40%)]" />
            <div className="relative mx-auto max-w-[1440px] px-4 py-10 md:px-6 md:py-12">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/15">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    TAXPAL
                  </Badge>
                </div>
                <div className="max-w-2xl">
                  <div className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                    Your TaxPal: Nigeria's Tax Companion
                  </div>
                  <div className="mt-3 text-base text-white/80 md:text-lg">
                    Ask anything about Nigerian taxes in your language. Get instant expert answers grounded in our Knowledge Base.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className={cn('h-12 rounded-xl', language === 'en' && 'bg-emerald-600 text-white hover:bg-emerald-700')}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                  <Button
                    variant="secondary"
                    className={cn('h-12 rounded-xl', language === 'ha' && 'bg-emerald-600 text-white hover:bg-emerald-700')}
                    onClick={() => setLanguage('ha')}
                  >
                    Hausa
                  </Button>
                  <Button
                    variant="secondary"
                    className={cn('h-12 rounded-xl', language === 'yo' && 'bg-emerald-600 text-white hover:bg-emerald-700')}
                    onClick={() => setLanguage('yo')}
                  >
                    Yoruba
                  </Button>
                  <Button
                    variant="secondary"
                    className={cn('h-12 rounded-xl', language === 'ig' && 'bg-emerald-600 text-white hover:bg-emerald-700')}
                    onClick={() => setLanguage('ig')}
                  >
                    Igbo
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <div>💬 98% Accuracy</div>
                  <div>⚡ &lt;2s Response</div>
                  <div>🔒 Secure &amp; Private</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat window */}
          <div className="mx-auto max-w-[1440px] px-4 md:px-6">
            <div className="py-6">
              {/* Suggested chips */}
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                {suggestedChips.map((chip) => (
                  <Button
                    key={chip}
                    variant="outline"
                    className="h-10 whitespace-nowrap rounded-full"
                    disabled={isLoading}
                    onClick={() => void send(chip)}
                  >
                    {chip}
                  </Button>
                ))}
              </div>

              <Card className="overflow-hidden">
                <ScrollArea className="h-[calc(100vh-80px-400px)] md:h-[calc(100vh-80px-420px)]">
                  <div ref={scrollRef} className="space-y-4 p-4 md:p-6">
                    {(activeConversation?.messages || []).map((m, idx) => {
                      const isUser = m.role === 'user';
                      const showTime =
                        idx === 0 ||
                        Math.abs((activeConversation?.messages?.[idx - 1]?.ts ?? 0) - m.ts) > 5 * 60 * 1000;

                      return (
                        <div key={m.id} className={cn('flex items-start gap-3', isUser ? 'justify-end' : 'justify-start')}>
                          {!isUser && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                              <Bot className="h-5 w-5" />
                            </div>
                          )}

                          <div className={cn('max-w-[75%]', isUser && 'text-right')}>
                            {showTime && (
                              <div className={cn('mb-1 text-xs text-muted-foreground', isUser ? 'text-right' : 'text-left')}>
                                {formatTime(m.ts)}
                              </div>
                            )}

                            <div
                              className={cn(
                                'rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm',
                                isUser
                                  ? 'rounded-tr-sm bg-gradient-to-br from-emerald-700 to-emerald-500 text-white'
                                  : 'rounded-tl-sm bg-muted/60 text-foreground'
                              )}
                            >
                              <div className="whitespace-pre-wrap">{m.content}</div>

                              {!isUser && m.documentation && (
                                <div className="mt-3 rounded-xl border bg-background p-3 text-xs text-muted-foreground">
                                  <div className="mb-2 flex items-center gap-2 text-foreground">
                                    <BookOpen className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Documentation</span>
                                  </div>
                                  <div className="whitespace-pre-wrap">{m.documentation}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {isUser && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                              <span className="text-sm font-semibold">U</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="max-w-[75%]">
                          <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-5 py-4 text-sm shadow-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
                              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
                              <span className="ml-2">{thinkingText}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>

          {/* Input area */}
          <div className="sticky bottom-0 z-10 border-t bg-background">
            <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-xl"
                      onClick={() => fileRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,image/*,.doc,.docx"
                      onChange={() => {
                        toast({
                          title: 'Upload received',
                          description: 'Document analysis workflow will be wired up next.',
                        });
                      }}
                    />

                    <Button
                      type="button"
                      variant={recording ? 'destructive' : 'outline'}
                      className="h-12 rounded-xl"
                      onClick={handleMic}
                      disabled={isLoading}
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      {recording ? 'Recording…' : 'Voice'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-xl"
                      onClick={() => setInput('')}
                      disabled={isLoading || !input}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="h-12 rounded-xl" disabled={isLoading}>
                          💡 Examples
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Example questions</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-2">
                          {[
                            'Explain VAT registration and filing deadlines in Nigeria.',
                            'How do I calculate PAYE from my monthly salary?',
                            'What are WHT rates for consulting services?',
                            'What is the tax treatment of dividends and interest?',
                            'I run a small business—what taxes apply and when do I file?',
                          ].map((ex) => (
                            <Button key={ex} variant="outline" className="justify-start" onClick={() => { setInput(ex); }}>
                              {ex}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about Nigerian taxes… (Shift + Enter for new line)"
                    className="min-h-[56px] resize-none rounded-xl border-2 p-4 text-base focus-visible:ring-0"
                    rows={2}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isLoading) onSubmit(e as any);
                      }
                      if (e.key === 'Escape') setInput('');
                    }}
                  />
                  <Button
                    type="submit"
                    className="h-[56px] w-[120px] rounded-xl"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send
                  </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  💬 Free users: <span className={cn(usage.remaining <= 2 && 'text-amber-600 font-semibold')}>{usage.remaining}</span> questions remaining today
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


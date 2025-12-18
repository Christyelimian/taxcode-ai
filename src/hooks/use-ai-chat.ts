import { useState, useCallback, useEffect } from 'react';
import { streamChatWithPuter } from '@/lib/puter-ai';
import { useToast } from '@/hooks/use-toast';

interface UseAIChatOptions {
  model?: string;
  onError?: (error: Error) => void;
  autoDetectPuter?: boolean;
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Hook for using AI with OpenRouter through Puter
 * Provides streaming chat capabilities with automatic Puter detection
 */
export function useAIChat(options: UseAIChatOptions = {}) {
  const {
    model = 'openrouter:anthropic/claude-3-5-sonnet',
    onError,
    autoDetectPuter = true,
  } = options;

  const { toast } = useToast();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usePuter, setUsePuter] = useState(false);

  // Detect Puter availability on mount
  useEffect(() => {
    if (autoDetectPuter && typeof window !== 'undefined') {
      const hasPuter = !!(window as any).puter;
      setUsePuter(hasPuter);
    }
  }, [autoDetectPuter]);

  /**
   * Send a message and stream the response
   */
  const sendMessage = useCallback(
    async (userMessage: string, useServerFallback: boolean = true) => {
      if (!userMessage.trim() || isLoading) return;

      setIsLoading(true);
      const messageId = Date.now().toString();

      try {
        // Add user message
        setMessages((prev) => [
          ...prev,
          {
            id: messageId,
            role: 'user',
            content: userMessage,
          },
        ]);

        if (usePuter && typeof window !== 'undefined') {
          // Use Puter streaming
          const assistantId = (Date.now() + 1).toString();
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: 'assistant',
              content: '',
            },
          ]);

          let fullResponse = '';
          const generator = streamChatWithPuter(userMessage, model);

          for await (const chunk of generator) {
            if (!chunk.done) {
              fullResponse += chunk.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId ? { ...msg, content: fullResponse } : msg
                )
              );
            }
          }
        } else if (useServerFallback) {
          // Fallback to server (requires implementing server-side streaming)
          throw new Error('Server fallback not implemented in this hook');
        } else {
          throw new Error('Puter not available and fallback disabled');
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        console.error('Error in AI chat:', err);

        if (onError) {
          onError(err);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: err.message || 'Failed to get response. Please try again.',
          });
        }

        // Remove the user message if chat failed
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, model, onError, toast, usePuter]
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Remove a specific message
   */
  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  return {
    messages,
    isLoading,
    usePuter,
    sendMessage,
    clearMessages,
    removeMessage,
  };
}

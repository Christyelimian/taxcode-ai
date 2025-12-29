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
  const [puterAvailable, setPuterAvailable] = useState<boolean | null>(null);

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

        // Try Puter first if not checked or available
        if (puterAvailable !== false && typeof window !== 'undefined') {
          try {
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
            setPuterAvailable(true); // Mark as available
          } catch (puterError) {
            console.warn('Puter AI failed:', puterError);
            setPuterAvailable(false); // Mark as unavailable
            if (!useServerFallback) {
              throw new Error('Puter not available and fallback disabled');
            }
            // Continue to server fallback
            throw new Error('Use server fallback');
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
    puterAvailable,
    sendMessage,
    clearMessages,
    removeMessage,
  };
}

/**
 * Puter AI Integration Module
 * Provides utilities for using Puter with OpenRouter as the default API provider
 */

export interface PuterAIResponse {
  text: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface PuterAIStreamResponse {
  text: string;
  done: boolean;
}

/**
 * Check if Puter is available
 */
export function isPuterAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).puter?.ai;
}

/**
 * Wait for Puter to be available (up to timeout ms)
 */
export async function waitForPuter(timeoutMs: number = 5000): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if ((window as any).puter?.ai) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  return false;
}

/**
 * Initialize Puter AI client
 * Must be called on the client side after Puter script is loaded
 */
export async function initPuterAI() {
  if (typeof window === 'undefined') {
    throw new Error('Puter AI can only be initialized on the client side');
  }

  const available = await waitForPuter();
  if (!available) {
    throw new Error('Puter SDK not loaded. Make sure the Puter script is included in your HTML.');
  }

  return (window as any).puter.ai;
}

/**
 * Chat with OpenRouter using Puter (non-streaming)
 */
export async function chatWithPuter(
  message: string,
  model: string = 'anthropic/claude-3.5-sonnet'
): Promise<PuterAIResponse> {
  if (typeof window === 'undefined') {
    throw new Error('This function must be called on the client side');
  }

  const puter = (window as any).puter;
  if (!puter) {
    throw new Error('Puter SDK not loaded');
  }

  try {
    const response = await puter.ai.chat(message, { model });
    return {
      text: response,
      model,
    };
  } catch (error) {
    console.error('Error calling Puter AI:', error);
    throw error;
  }
}

/**
 * Stream chat response from OpenRouter using Puter
 */
export async function* streamChatWithPuter(
  message: string,
  model: string = 'anthropic/claude-3.5-sonnet'
): AsyncGenerator<PuterAIStreamResponse, void, unknown> {
  if (typeof window === 'undefined') {
    throw new Error('This function must be called on the client side');
  }

  const puter = (window as any).puter;
  if (!puter || !puter.ai) {
    console.warn('Puter SDK not fully loaded. Waiting for initialization...');
    // Wait up to 5 seconds for Puter to load
    for (let i = 0; i < 50; i++) {
      if ((window as any).puter?.ai) break;
      await new Promise(r => setTimeout(r, 100));
    }
    
    if (!(window as any).puter?.ai) {
      throw new Error(
        'Puter SDK not available. Please ensure the Puter script is loaded and you have internet connectivity.'
      );
    }
  }

  try {
    console.log('Calling Puter AI with model:', model);
    const puterAI = (window as any).puter.ai;
    
    // Ensure message is a string
    if (typeof message !== 'string') {
      throw new Error('Message must be a string');
    }

    // Call Puter AI with proper error handling
    let response;
    try {
      response = await puterAI.chat(message, { model, stream: true });
    } catch (chatError: any) {
      console.error('Puter chat error details:', {
        error: chatError,
        message: chatError?.message || 'Unknown error',
        toString: chatError?.toString?.(),
      });
      throw new Error(
        `Puter AI failed: ${chatError?.message || JSON.stringify(chatError) || 'Unknown error'}`
      );
    }

    if (!response) {
      throw new Error('Puter AI returned empty response');
    }

    // Handle streaming response
    let receivedChunks = false;
    try {
      for await (const chunk of response) {
        receivedChunks = true;
        if (chunk?.text) {
          yield {
            text: chunk.text,
            done: false,
          };
        } else if (typeof chunk === 'string') {
          // Handle case where chunk is directly a string
          yield {
            text: chunk,
            done: false,
          };
        }
      }
    } catch (streamError: any) {
      console.error('Error reading stream:', streamError);
      if (receivedChunks) {
        // If we got some chunks before error, complete gracefully
        yield {
          text: '',
          done: true,
        };
        return;
      }
      throw streamError;
    }

    yield {
      text: '',
      done: true,
    };
  } catch (error: any) {
    console.error('Error streaming with Puter AI:', {
      error,
      message: error?.message || JSON.stringify(error),
      stack: error?.stack,
    });
    // Re-throw with more context
    throw new Error(
      `Failed to stream from Puter AI: ${error?.message || JSON.stringify(error) || 'Unknown error'}`
    );
  }
}

/**
 * Get available OpenRouter models through Puter
 */
export async function getAvailableModels(): Promise<string[]> {
  if (typeof window === 'undefined') {
    throw new Error('This function must be called on the client side');
  }

  const puter = (window as any).puter;
  if (!puter) {
    throw new Error('Puter SDK not loaded');
  }

  // Available Puter models (via OpenRouter)
  return [
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3.5-haiku-20241022',
    'openai/gpt-4o',
    'openai/gpt-4-turbo',
    'meta-llama/llama-3.1-405b-instruct',
    'deepseek-chat',
  ];
}

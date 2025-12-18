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
 * Initialize Puter AI client
 * Must be called on the client side after Puter script is loaded
 */
export async function initPuterAI() {
  if (typeof window === 'undefined') {
    throw new Error('Puter AI can only be initialized on the client side');
  }

  if (!(window as any).puter) {
    throw new Error('Puter SDK not loaded. Make sure the Puter script is included in your HTML.');
  }

  return (window as any).puter.ai;
}

/**
 * Chat with OpenRouter using Puter (non-streaming)
 */
export async function chatWithPuter(
  message: string,
  model: string = 'openrouter:anthropic/claude-3-5-sonnet'
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
  model: string = 'openrouter:anthropic/claude-3-5-sonnet'
): AsyncGenerator<PuterAIStreamResponse, void, unknown> {
  if (typeof window === 'undefined') {
    throw new Error('This function must be called on the client side');
  }

  const puter = (window as any).puter;
  if (!puter) {
    throw new Error('Puter SDK not loaded');
  }

  try {
    const response = await puter.ai.chat(message, { model, stream: true });

    for await (const chunk of response) {
      if (chunk?.text) {
        yield {
          text: chunk.text,
          done: false,
        };
      }
    }

    yield {
      text: '',
      done: true,
    };
  } catch (error) {
    console.error('Error streaming with Puter AI:', error);
    throw error;
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

  // Default OpenRouter models
  return [
    'openrouter:anthropic/claude-3-5-sonnet',
    'openrouter:anthropic/claude-3-5-haiku',
    'openrouter:openai/gpt-4-turbo',
    'openrouter:openai/gpt-4o',
    'openrouter:meta-llama/llama-3.1-405b',
    'openrouter:deepseek/deepseek-chat',
  ];
}

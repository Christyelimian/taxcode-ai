/**
 * OpenRouter Client for embeddings and AI operations
 * Uses OpenRouter API with support for multiple models
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

interface EmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Get OpenRouter API key from environment
 */
function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!key) {
    throw new Error(
      'Missing OpenRouter API key. Set OPENROUTER_API_KEY or NEXT_PUBLIC_OPENROUTER_API_KEY environment variable.'
    );
  }
  return key;
}

type OpenRouterRole = 'system' | 'user' | 'assistant';

export interface OpenRouterChatMessage {
  role: OpenRouterRole;
  content: string;
}

interface OpenRouterChatCompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    message?: { role: OpenRouterRole; content: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call OpenRouter Chat Completions API and return assistant text.
 */
export async function chatCompletion(opts: {
  model: string;
  messages: OpenRouterChatMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<{ text: string; usage?: OpenRouterChatCompletionResponse['usage'] }> {
  const apiKey = getApiKey();

  const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      // OpenRouter recommends these; use stable server values.
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002',
      'X-Title': 'TaxCode',
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.maxTokens ?? 1200,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenRouter chat failed (${response.status}): ${errorData?.error?.message || 'Unknown error'}`
    );
  }

  const data = (await response.json()) as OpenRouterChatCompletionResponse;
  const text = data?.choices?.[0]?.message?.content ?? '';
  return { text, usage: data.usage };
}

/**
 * Generate embeddings using OpenRouter with text-embedding-3-small model
 * Falls back to a simple vector representation if API fails
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const apiKey = getApiKey();
    
    const response = await fetch(`${OPENROUTER_API_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000',
        'X-Title': 'TaxCode',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: text.substring(0, 8000), // OpenAI limit
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(
        `OpenRouter API failed (${response.status}): ${errorData?.error?.message || 'Unknown error'}`
      );
    }

    const data = (await response.json()) as EmbeddingResponse;
    
    if (!data.data || !data.data[0]?.embedding) {
      throw new Error('Invalid embedding response format');
    }

    return data.data[0].embedding;
  } catch (error: any) {
    console.error('Error generating embedding from OpenRouter:', error?.message || error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const apiKey = getApiKey();
    
    const response = await fetch(`${OPENROUTER_API_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000',
        'X-Title': 'TaxCode',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: texts.map(t => t.substring(0, 8000)),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API failed (${response.status}): ${errorData?.error?.message || 'Unknown error'}`
      );
    }

    const data = (await response.json()) as EmbeddingResponse;
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid embedding response format');
    }

    // Sort by index and extract embeddings
    return data.data
      .sort((a, b) => a.index - b.index)
      .map(item => item.embedding);
  } catch (error: any) {
    console.error('Error generating batch embeddings from OpenRouter:', error?.message || error);
    throw error;
  }
}

/**
 * Check if OpenRouter is available by testing the API key
 */
export async function checkOpenRouterAvailability(): Promise<boolean> {
  try {
    const apiKey = getApiKey();
    const response = await fetch(`${OPENROUTER_API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

# Dashboard AI Features - OpenRouter/Puter Integration

## Overview

All AI features in the TaxCode dashboard now use **OpenRouter** via **Puter** as the default AI provider, with automatic fallback to server-side APIs when Puter is unavailable.

## Updated Components

### 1. **AI Tax Assistant** (`src/components/tax-assistant.tsx`)

The dedicated assistant on `/dashboard/assistant` now uses Puter streaming.

**Features:**
- Real-time streaming responses from OpenRouter (Claude 3.5 Sonnet)
- Multi-language support (English, Hausa, Yoruba, Igbo)
- Text-to-speech for responses
- Quick question buttons
- Auto-detection of Puter availability
- Server fallback if Puter unavailable

**How it works:**
```typescript
// Automatically detects Puter on mount
if (usePuter && typeof window !== 'undefined') {
  // Stream from OpenRouter via Puter
  const generator = streamChatWithPuter(question, 'openrouter:anthropic/claude-3-5-sonnet');
  for await (const chunk of generator) {
    // Update message in real-time
  }
} else {
  // Fall back to server API
}
```

### 2. **AI Tax Calculator** (`src/app/dashboard/calculator/page.tsx`)

The calculator on `/dashboard/calculator` now provides AI-enhanced explanations.

**Features:**
- Standard tax calculation via server
- AI-powered explanation generation via Puter
- Shows "AI Insights" when Puter is available
- Falls back to standard calculation if Puter unavailable

**How it works:**
```typescript
// 1. Calculate tax on server (fast)
const response = await calculateTax(values);

// 2. If Puter available, enhance with AI explanation
if (usePuter) {
  const generator = streamChatWithPuter(enhancementPrompt, model);
  // Stream enhanced explanation
}
```

### 3. **Homepage Chatbot** (`src/components/homepage-chatbot.tsx`)

The floating chatbot on the homepage also uses Puter.

**Features:**
- Full streaming responses
- Shows provider status ("OpenRouter (Puter)" or "API")
- Auto-detects Puter
- Graceful fallback

## New Hooks

### `useAIChat` Hook (`src/hooks/use-ai-chat.ts`)

A reusable React hook for integrating AI chat into any component.

**Usage:**
```typescript
import { useAIChat } from '@/hooks/use-ai-chat';

function MyComponent() {
  const {
    messages,
    isLoading,
    usePuter,
    sendMessage,
    clearMessages,
    removeMessage,
  } = useAIChat({
    model: 'openrouter:anthropic/claude-3-5-sonnet',
    autoDetectPuter: true,
  });

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          <p>{msg.role}: {msg.content}</p>
        </div>
      ))}
      
      <button 
        onClick={() => sendMessage('Your question here')}
        disabled={isLoading}
      >
        Send
      </button>
    </div>
  );
}
```

## Utility Module

### `src/lib/puter-ai.ts`

Core utilities for Puter integration:

- **`chatWithPuter()`** - Non-streaming chat (not recommended for UI)
- **`streamChatWithPuter()`** - Streaming chat (recommended)
- **`getAvailableModels()`** - List supported models

**Example:**
```typescript
import { streamChatWithPuter } from '@/lib/puter-ai';

// Stream response
const generator = streamChatWithPuter(
  'Your question',
  'openrouter:anthropic/claude-3-5-sonnet'
);

for await (const chunk of generator) {
  if (!chunk.done) {
    console.log(chunk.text); // Real-time text
  }
}
```

## Supported Models

Available through OpenRouter:
- `openrouter:anthropic/claude-3-5-sonnet` (default)
- `openrouter:anthropic/claude-3-5-haiku`
- `openrouter:openai/gpt-4-turbo`
- `openrouter:openai/gpt-4o`
- `openrouter:meta-llama/llama-3.1-405b`
- `openrouter:deepseek/deepseek-chat`

Switch models by changing the model parameter:
```typescript
const generator = streamChatWithPuter(
  message,
  'openrouter:openai/gpt-4o' // Different model
);
```

## Architecture

```
User Input
    ↓
Component (Homepage, Assistant, Calculator)
    ↓
    ├─ Check: Is Puter available?
    │
    ├─ YES → Use useAIChat hook or streamChatWithPuter()
    │         ↓
    │     OpenRouter API (via Puter)
    │         ↓
    │     Real-time Streaming Response
    │
    └─ NO → Fall back to getAiResponse() (Server API)
            ↓
            Server-side AI flows
            ↓
            Response
```

## Configuration

### Environment Variables

The following may need to be configured in your Puter environment:

```env
OPENROUTER_API_KEY=your_api_key_here
```

### Feature Flags

To disable Puter and always use server API:
```typescript
// In any component
const [usePuter] = useState(false); // Force server API
```

## Performance Notes

### Puter Streaming (Recommended)
- ✅ Real-time response display
- ✅ Better UX (progressive text)
- ✅ Perceived faster performance
- ✅ Works on client-side

### Server API Fallback
- ✓ Works offline if set up
- ✓ More reliable
- ✓ Server-side processing
- ✗ Slower perceived performance

## Troubleshooting

### "OpenRouter (Puter)" not showing
- Check browser console for errors
- Verify Puter script loaded: `console.log(window.puter)`
- Check if ad blockers are blocking puter.com

### Responses are slow
- OpenRouter might be experiencing delays
- Try a different model with lower latency
- Check OpenRouter status

### Always falling back to server API
- This is normal if Puter isn't available
- Check browser console for Puter loading errors
- Verify Puter SDK script is in layout

## Future Enhancements

1. **Model Selection UI** - Let users choose models
2. **Temperature Controls** - Expose advanced parameters
3. **Usage Analytics** - Track which API is used
4. **Cost Tracking** - Monitor OpenRouter usage
5. **Caching** - Cache common questions
6. **Voice Input** - Add speech-to-text
7. **Multi-turn Context** - Better conversation history

## Examples

### Example 1: Using the Chat Hook
```typescript
import { useAIChat } from '@/hooks/use-ai-chat';

export function TaxExplainer() {
  const { messages, sendMessage, isLoading } = useAIChat();

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <button onClick={() => sendMessage('Explain VAT in Nigeria')}>
        Get Explanation
      </button>
    </div>
  );
}
```

### Example 2: Direct Streaming
```typescript
import { streamChatWithPuter } from '@/lib/puter-ai';

async function explainTax() {
  const generator = streamChatWithPuter(
    'What is the VAT rate?',
    'openrouter:anthropic/claude-3-5-sonnet'
  );

  for await (const chunk of generator) {
    if (!chunk.done) {
      console.log(chunk.text); // Print as it arrives
    }
  }
}
```

### Example 3: Error Handling
```typescript
const { sendMessage } = useAIChat({
  onError: (error) => {
    console.error('AI Error:', error.message);
    // Custom error handling
  },
  autoDetectPuter: true,
});
```

## Integration Checklist

- [x] Puter SDK added to layout
- [x] OpenRouter Genkit plugin added
- [x] `puter-ai.ts` utility module created
- [x] `useAIChat` hook created
- [x] Tax Assistant component updated
- [x] Tax Calculator component updated
- [x] Homepage chatbot component updated
- [x] Documentation complete

## Resources

- [Puter Documentation](https://docs.puter.com)
- [OpenRouter API](https://openrouter.ai/docs)
- [Anthropic Claude API](https://anthropic.com/docs)
- [Genkit Documentation](https://firebase.google.com/docs/genkit)

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Puter is loaded: `window.puter`
3. Test with direct API calls
4. Fall back to server API

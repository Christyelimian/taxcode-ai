# OpenRouter/Puter Integration - Architecture & Implementation Guide

## Issue Resolution

### Problem
The initial implementation incorrectly tried to use `@genkit-ai/openrouter` which is not an official Genkit plugin.

### Solution
**OpenRouter integration is handled entirely on the client-side via Puter**, not through Genkit. This is the correct approach because:

1. **Puter handles API management** - Puter manages OpenRouter API keys and authentication
2. **Client-side streaming** - Better UX with real-time response streaming
3. **No backend plugin needed** - Genkit stays for server-side AI flows (Google AI)
4. **Decoupled architecture** - Client and server use different AI providers optimally

## Final Architecture

### Server-Side (Genkit + Google AI)
- Location: `src/ai/genkit.ts`
- Purpose: Backend AI flows (tax calculations, document generation)
- Uses: Google AI (Gemini 2.0 Flash)
- Via: Genkit framework

### Client-Side (Puter + OpenRouter)
- Location: `src/lib/puter-ai.ts`
- Purpose: Streaming chat and interactive features
- Uses: OpenRouter (Claude 3.5 Sonnet, GPT-4, Llama, etc.)
- Via: Puter SDK
- Fallback: Server-side getAiResponse() function

## Component Integration Map

| Component | Location | AI Provider | Use Case |
|-----------|----------|-------------|----------|
| **Homepage Chatbot** | `src/components/homepage-chatbot.tsx` | Puter→OpenRouter | Floating chat widget |
| **Tax Assistant** | `src/components/tax-assistant.tsx` | Puter→OpenRouter | Dedicated Q&A page |
| **Tax Calculator** | `src/app/dashboard/calculator/page.tsx` | Server (calc) + Puter (explain) | Tax estimation |
| **Tax QA Flow** | `src/ai/flows/tax-qa.ts` | Google AI (Genkit) | Backend knowledge base |
| **Calculate Tax Flow** | `src/ai/flows/calculate-tax-flow.ts` | Google AI (Genkit) | Backend calculations |

## File Structure

```
src/
├── ai/
│   ├── genkit.ts                    ← Server AI (Google AI only)
│   ├── flows/
│   │   ├── tax-qa.ts
│   │   └── calculate-tax-flow.ts
│   └── dev.ts
├── components/
│   ├── homepage-chatbot.tsx         ← Uses Puter
│   ├── tax-assistant.tsx            ← Uses Puter
│   └── ...
├── app/
│   ├── actions.ts                   ← Server actions
│   ├── dashboard/
│   │   ├── calculator/
│   │   │   └── page.tsx             ← Uses Puter for explanations
│   │   ├── assistant/
│   │   │   └── page.tsx             ← Uses Puter
│   │   └── ...
│   └── ...
├── lib/
│   ├── puter-ai.ts                  ← Puter utilities
│   └── ...
└── hooks/
    ├── use-ai-chat.ts               ← AI chat hook
    └── ...
```

## Environment Setup

### What You Need

1. **Puter SDK** - Loaded from CDN in `src/app/layout.tsx`
   ```html
   <script src="https://js.puter.com/v2/"></script>
   ```

2. **OpenRouter API Key** - Configured in Puter environment
   - Puter handles the authentication

3. **Google AI API Key** (optional) - For server-side Genkit flows
   - Set in environment variables if using Gemini flows

### What You Don't Need

- ❌ `@genkit-ai/openrouter` package (doesn't exist)
- ❌ Server-side OpenRouter configuration in Genkit
- ❌ Environment variable for OpenRouter on backend

## How It Works: Request Flow

### For Client-Side Chat (Homepage, Assistant, Calculator explanations)

```
User Types Message
    ↓
Component (e.g., homepage-chatbot.tsx)
    ↓
Check: Is Puter available?
    ├─ YES:
    │   ↓
    │   streamChatWithPuter()
    │   ↓
    │   Puter SDK
    │   ↓
    │   OpenRouter API (Claude 3.5 Sonnet)
    │   ↓
    │   Stream response back
    │
    └─ NO:
        ↓
        getAiResponse() (server action)
        ↓
        Genkit + Google AI
        ↓
        Response
```

### For Server-Side Flows (Tax Calculation, Q&A)

```
Request from Client
    ↓
Server Action (src/app/actions.ts)
    ↓
Genkit Flow (src/ai/flows/)
    ↓
Google AI (Gemini)
    ↓
Structured Response
```

## Usage Examples

### 1. Using Streaming Chat in Components

```typescript
import { streamChatWithPuter } from '@/lib/puter-ai';

// In a component
const generator = streamChatWithPuter(
  "What is VAT in Nigeria?",
  'openrouter:anthropic/claude-3-5-sonnet'
);

for await (const chunk of generator) {
  if (!chunk.done) {
    console.log(chunk.text); // Real-time text
  }
}
```

### 2. Using the AI Chat Hook

```typescript
import { useAIChat } from '@/hooks/use-ai-chat';

export function MyComponent() {
  const { messages, sendMessage, isLoading } = useAIChat();

  return (
    <div>
      {messages.map(msg => <p key={msg.id}>{msg.content}</p>)}
      <button onClick={() => sendMessage('Your question')}>Send</button>
    </div>
  );
}
```

### 3. Using Server-Side Genkit Flows

```typescript
import { askTaxLawQuestion } from '@/ai/flows/tax-qa';

// In server action
const response = await askTaxLawQuestion({
  question: 'What is the VAT rate?'
});
```

## Configuration

### Add to Environment (if needed)

For server-side Google AI flows:
```env
GOOGLE_GENKIT_API_KEY=your_key_here
```

Puter handles OpenRouter credentials automatically through its environment.

### Switch AI Models

Change the model string in components:

```typescript
// Use different OpenRouter model
streamChatWithPuter(
  message,
  'openrouter:openai/gpt-4o' // Different model
)
```

Available models:
- `openrouter:anthropic/claude-3-5-sonnet` (default)
- `openrouter:anthropic/claude-3-5-haiku`
- `openrouter:openai/gpt-4-turbo`
- `openrouter:openai/gpt-4o`
- `openrouter:meta-llama/llama-3.1-405b`
- `openrouter:deepseek/deepseek-chat`

## Deployment Checklist

- [x] Removed `@genkit-ai/openrouter` from package.json
- [x] Updated genkit.ts to use Google AI only
- [x] Puter SDK included in layout
- [x] Puter utilities created in src/lib/puter-ai.ts
- [x] useAIChat hook created
- [x] All dashboard components updated
- [x] Server fallback implemented
- [x] Auto-detection of Puter availability

## Troubleshooting

### "Module not found: @genkit-ai/openrouter"
✅ **Fixed** - Removed from package.json and genkit.ts

### Puter not detected
- Check: `console.log(window.puter)` in browser
- Verify Puter script loaded in Network tab
- Check for ad blockers blocking puter.com

### Slow responses
- OpenRouter might be delayed
- Try different model with lower latency
- Check OpenRouter status page

## Summary

The final implementation uses:
- **Server**: Google AI (Genkit) for backend calculations
- **Client**: OpenRouter (Puter) for interactive UI
- **Fallback**: Server API if Puter unavailable
- **Result**: Best of both worlds - fast calculations + responsive UI

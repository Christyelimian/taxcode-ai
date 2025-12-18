# OpenRouter Integration with Puter Guide

## Overview
This document explains how OpenRouter is now integrated as the default API provider using Puter in the TaxCode application.

## What Was Changed

### 1. **Genkit Configuration** (`src/ai/genkit.ts`)
- Added `@genkit-ai/openrouter` plugin
- Set default model to `openrouter/anthropic/claude-3-5-sonnet`
- Maintains backward compatibility with Google AI

### 2. **Puter AI Module** (`src/lib/puter-ai.ts`)
Created a new utility module with functions:
- `initPuterAI()` - Initialize Puter SDK on client side
- `chatWithPuter()` - Non-streaming chat requests
- `streamChatWithPuter()` - Streaming responses (recommended)
- `getAvailableModels()` - List supported OpenRouter models

### 3. **Homepage Chatbot Component** (`src/components/homepage-chatbot.tsx`)
- Auto-detects if Puter SDK is available
- Falls back to server-side API if Puter unavailable
- Implements streaming responses from OpenRouter
- Shows API provider status in UI ("OpenRouter (Puter)" or "API")

### 4. **Root Layout** (`src/app/layout.tsx`)
- Added Puter SDK script: `<script src="https://js.puter.com/v2/"></script>`
- Loads on all pages for global availability

### 5. **Package Dependencies** (`package.json`)
- Added `@genkit-ai/openrouter` plugin

## How It Works

### Client-Side Flow (Using Puter)
```
User Input → Puter SDK → OpenRouter API → Streaming Response → Display
```

### Server-Side Fallback Flow
```
User Input → Server API → AI Flows → Response → Display
```

## Supported OpenRouter Models

The integration supports these models by default:
- `openrouter:anthropic/claude-3-5-sonnet` (default)
- `openrouter:anthropic/claude-3-5-haiku`
- `openrouter:openai/gpt-4-turbo`
- `openrouter:openai/gpt-4o`
- `openrouter:meta-llama/llama-3.1-405b`
- `openrouter:deepseek/deepseek-chat`

## Configuration

### Environment Variables Required
You may need to set up OpenRouter authentication. Check if Puter handles this automatically or if you need:
```
OPENROUTER_API_KEY=your_api_key_here
```

### Using Different Models

To change the default model, edit `src/lib/puter-ai.ts`:

```typescript
// Line in streamChatWithPuter or chatWithPuter
export async function streamChatWithPuter(
  message: string,
  model: string = 'openrouter:anthropic/claude-3-5-sonnet' // Change this
): Promise<...>
```

Or pass a different model at runtime:
```typescript
const response = await streamChatWithPuter(
  userMessage,
  'openrouter:openai/gpt-4o'
);
```

## Error Handling

The implementation includes error handling for:
1. **Missing Puter SDK** - Falls back to server API
2. **API Failures** - Shows toast notifications to user
3. **Network Issues** - Graceful degradation

## Testing

### To Test Locally:
1. Run `npm install` to install new dependencies
2. Start the dev server: `npm run dev`
3. Open the chatbot in the homepage
4. Verify "OpenRouter (Puter)" appears in the status indicator
5. Send a test message and verify streaming response

### To Test with Different Models:
Edit the model parameter in `homepage-chatbot.tsx`:
```typescript
const generator = streamChatWithPuter(
  currentInput,
  'openrouter:openai/gpt-4o' // Change model here
);
```

## Deployment Notes

1. **Puter Script**: The Puter SDK is loaded from CDN, no build configuration needed
2. **API Keys**: Ensure OpenRouter API credentials are properly configured in Puter
3. **CORS**: Puter handles CORS, no additional configuration needed
4. **Performance**: Streaming responses improve perceived performance

## Troubleshooting

### Chatbot shows "API" instead of "OpenRouter (Puter)"
- Check browser console for errors
- Verify Puter script loaded: `window.puter` should exist
- Check if ad blockers are blocking puter.com

### Responses are slow or timeout
- OpenRouter might be experiencing delays
- Try a different model with lower latency
- Check OpenRouter status page

### Fallback to server API
- This is normal when Puter isn't available
- Server API uses Genkit flows as backup
- No user-facing issues, just different provider

## Future Enhancements

1. **Model Selection UI** - Allow users to choose models at runtime
2. **Temperature/Settings Control** - Expose advanced parameters
3. **Usage Analytics** - Track which API provider is used most
4. **Cost Tracking** - Monitor OpenRouter usage costs
5. **Caching Layer** - Cache common questions for faster responses

## Additional Resources

- [Puter Documentation](https://docs.puter.com)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Genkit Integration Guide](https://firebase.google.com/docs/genkit)
- [Claude API Documentation](https://anthropic.com/docs)

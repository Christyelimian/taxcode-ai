import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

// OpenRouter integration is handled via Puter on the client side
// See src/lib/puter-ai.ts for OpenRouter/Claude usage in UI components

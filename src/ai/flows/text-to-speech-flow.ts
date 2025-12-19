
'use server';
/**
 * @fileOverview An AI agent for converting text to speech in multiple languages.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { z } from 'zod';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  language: z.enum(['en', 'ha', 'yo', 'ig']).describe('The language of the text. Supported: en (English), ha (Hausa), yo (Yoruba), ig (Igbo).'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  // Gemini-based TTS removed: this project uses OpenRouter/Puter for LLMs.
  // Use browser SpeechSynthesis on the client instead.
  TextToSpeechInputSchema.parse(input);
  throw new Error('Text-to-speech is client-side only (SpeechSynthesis).');
}

TextToSpeechOutputSchema;

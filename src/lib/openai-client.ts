/**
 * OpenAI Client for embeddings and AI operations
 */

import OpenAI from 'openai';

let _client: OpenAI | null = null;

function initClient() {
  if (_client) return _client;
  if (!process.env.OPENAI_API_KEY) return null;
  _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

const handler: ProxyHandler<any> = {
  get(_target, prop) {
    const client = initClient();
    if (!client) {
      throw new Error(
        'Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.'
      );
    }
    const value = (client as any)[prop];
    if (typeof value === 'function') return value.bind(client);
    return value;
  },
};

export const openai = new Proxy({}, handler) as unknown as OpenAI;

export default openai;

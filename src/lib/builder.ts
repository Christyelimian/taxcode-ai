import { builder } from '@builder.io/react';

// Initialize Builder.io client
// API key should be set in NEXT_PUBLIC_BUILDER_API_KEY environment variable
if (process.env.NEXT_PUBLIC_BUILDER_API_KEY) {
  builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);
}

export { builder };


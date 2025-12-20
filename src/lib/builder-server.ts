/**
 * Server-side Builder.io client
 * Uses REST API directly to avoid React dependencies
 * Safe to use in server components
 */

interface BuilderContent {
  id: string;
  data: any;
  [key: string]: any;
}

/**
 * Fetch Builder.io content server-side
 */
export async function getBuilderContent(
  model: string,
  options: {
    url?: string;
    entry?: string;
    noTargeting?: boolean;
  } = {}
): Promise<BuilderContent | null> {
  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const params = new URLSearchParams();
    if (options.url) {
      params.append('url', options.url);
    }
    if (options.entry) {
      params.append('entry', options.entry);
    }
    if (options.noTargeting) {
      params.append('noTargeting', 'true');
    }
    params.append('apiKey', apiKey);

    const url = `https://cdn.builder.io/api/v2/${model}?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Content not found
      }
      // Builder.io might return HTML error pages
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        return null; // HTML response means content doesn't exist or error page
      }
      throw new Error(`Builder.io API error: ${response.statusText}`);
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null; // Not JSON, likely HTML error page
    }

    const data = await response.json();
    
    // Builder.io returns results in different formats
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    if (data.id) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to fetch Builder.io content:', error);
    return null;
  }
}


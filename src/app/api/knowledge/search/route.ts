/**
 * Knowledge Base Search API
 * POST /api/knowledge/search?q=query
 * Performs hybrid search (semantic + keyword)
 */

import { NextRequest, NextResponse } from 'next/server';
import { hybridSearch } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await hybridSearch(query, limit);

    return NextResponse.json({
      query,
      count: results.length,
      results: results.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        category: article.category,
        similarity: (article.similarity || 0).toFixed(3),
        viewCount: article.viewCount || 0,
        createdAt: article.createdAt,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

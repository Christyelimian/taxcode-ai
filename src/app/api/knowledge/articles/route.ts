/**
 * Add Knowledge Base Article API
 * POST /api/knowledge/articles
 * Adds a new article with automatic embedding generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { addArticle } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, content, summary, category, tags = [], source, author } = body;

    // Validation
    if (!title || !content || !summary || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, summary, category' },
        { status: 400 }
      );
    }

    if (title.length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters' },
        { status: 400 }
      );
    }

    if (content.length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Add article (will generate embedding automatically)
    const article = await addArticle({
      title,
      content,
      summary,
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      source: source || 'Manual Entry',
      author: author || 'Admin',
    });

    return NextResponse.json(
      {
        message: 'Article added successfully',
        article: {
          id: article.id,
          title: article.title,
          category: article.category,
          createdAt: article.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add article error:', error);

    if (error instanceof Error && error.message.includes('embedding')) {
      return NextResponse.json(
        { error: 'Failed to generate embedding. Please check OpenAI API key.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add article' },
      { status: 500 }
    );
  }
}

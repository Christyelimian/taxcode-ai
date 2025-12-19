/**
 * Knowledge Base Article Management API
 * PUT    /api/knowledge/articles/:id   - update fields (re-embeds if content changes)
 * DELETE /api/knowledge/articles/:id   - hard delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteArticle, getArticleById, setArticleActive, updateArticle } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const article = await getArticleById(id);
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    return NextResponse.json({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        summary: article.summary,
        category: article.category,
        tags: article.tags,
        source: article.source,
        sourceUrl: article.sourceUrl,
        author: article.author,
        isActive: article.isActive,
        version: article.version,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Minimal validation: allow partial updates
    const {
      title,
      content,
      summary,
      category,
      tags,
      source,
      sourceUrl,
      author,
      isActive,
    } = body ?? {};

    // If only toggling active state, do that explicitly
    if (
      typeof isActive === 'boolean' &&
      title === undefined &&
      content === undefined &&
      summary === undefined &&
      category === undefined &&
      tags === undefined &&
      source === undefined &&
      sourceUrl === undefined &&
      author === undefined
    ) {
      const article = await setArticleActive(id, isActive);
      return NextResponse.json(
        { message: 'Article status updated', article: { id: article.id, isActive: article.isActive } },
        { status: 200 }
      );
    }

    const article = await updateArticle(id, {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(tags !== undefined ? { tags: Array.isArray(tags) ? tags : [tags] } : {}),
      ...(source !== undefined ? { source } : {}),
      ...(sourceUrl !== undefined ? { sourceUrl } : {}),
      ...(author !== undefined ? { author } : {}),
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
    });

    return NextResponse.json(
      {
        message: 'Article updated successfully',
        article: {
          id: article.id,
          title: article.title,
          category: article.category,
          isActive: article.isActive,
          version: article.version,
          updatedAt: article.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update article error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update article';
    const status = msg.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await deleteArticle(id);
    return NextResponse.json({ message: 'Article deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete article error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to delete article';
    const status = msg.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}



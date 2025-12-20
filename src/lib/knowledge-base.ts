/**
 * Knowledge Base Service with Vector Embeddings
 * Handles RAG (Retrieval-Augmented Generation) for AI training
 */

import { getPrismaClient } from '@/lib/prisma';
import { generateEmbedding as generateOpenRouterEmbedding } from '@/lib/openrouter-client';

// Constants
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;
const SIMILARITY_THRESHOLD = 0.7;

const SECTION_MIN_CHARS = 900;
const SECTION_MAX_CHARS = 3200;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const prisma = getPrismaClient();
  let slug = baseSlug;
  let i = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.knowledgeBaseArticle.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return slug;
    slug = `${baseSlug}-${i++}`;
  }
}

function cleanTextForEmbedding(text: string) {
  return text.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
}

function splitIntoSections(content: string): Array<{ sectionNumber: number; heading: string; content: string }> {
  const text = cleanTextForEmbedding(content);
  if (!text) return [];

  // Split by blank lines first (paragraph-aware)
  const parts = text.split(/\n\s*\n+/g).map(p => p.trim()).filter(Boolean);

  const sections: Array<{ sectionNumber: number; heading: string; content: string }> = [];
  let buffer: string[] = [];
  let sectionNumber = 1;

  const flush = () => {
    const joined = buffer.join('\n\n').trim();
    if (!joined) return;

    // Try to infer a heading from the first line if it looks like a heading.
    const firstLine = joined.split('\n')[0]?.trim() ?? '';
    let heading = `Section ${sectionNumber}`;
    if (firstLine.startsWith('#')) {
      heading = firstLine.replace(/^#+\s*/, '').slice(0, 120) || heading;
    } else if (firstLine.length > 0 && firstLine.length <= 80 && /^[A-Z0-9][A-Z0-9\s\-():,&/]+$/.test(firstLine)) {
      heading = firstLine.slice(0, 120);
    }

    sections.push({ sectionNumber, heading, content: joined });
    sectionNumber++;
    buffer = [];
  };

  for (const part of parts) {
    if (buffer.length === 0) {
      buffer.push(part);
      continue;
    }

    const candidate = buffer.join('\n\n').length + 2 + part.length;
    if (candidate <= SECTION_MAX_CHARS) {
      buffer.push(part);
      continue;
    }

    // Buffer is too big with this part; flush current buffer.
    flush();

    // If the part itself is huge, split it hard by sentence-ish boundaries.
    if (part.length > SECTION_MAX_CHARS) {
      const sentences = part.split(/(?<=[.!?])\s+(?=[A-Z0-9])/g);
      let hardBuf = '';
      for (const s of sentences) {
        if (!hardBuf) {
          hardBuf = s;
          continue;
        }
        if ((hardBuf + ' ' + s).length <= SECTION_MAX_CHARS) {
          hardBuf += ' ' + s;
        } else {
          buffer = [hardBuf];
          flush();
          hardBuf = s;
        }
      }
      if (hardBuf) {
        buffer = [hardBuf];
        flush();
      }
    } else {
      buffer.push(part);
    }
  }
  flush();

  // Merge tiny trailing sections into previous where possible
  const merged: typeof sections = [];
  for (const sec of sections) {
    const last = merged[merged.length - 1];
    if (last && sec.content.length < SECTION_MIN_CHARS && (last.content.length + 2 + sec.content.length) <= SECTION_MAX_CHARS) {
      last.content = `${last.content}\n\n${sec.content}`.trim();
      continue;
    }
    merged.push({ ...sec });
  }

  // Re-number after merging
  return merged.map((s, idx) => ({ ...s, sectionNumber: idx + 1 }));
}

async function upsertArticleSections(articleId: string, fullContent: string) {
  const prisma = getPrismaClient();
  const sections = splitIntoSections(fullContent);
  if (sections.length === 0) return { sectionCount: 0 };

  // Replace sections on every refresh to keep deterministic ordering/content
  await prisma.articleSection.deleteMany({ where: { articleId } });

  for (const sec of sections) {
    const embedding = await generateEmbedding(sec.content);
    await prisma.articleSection.create({
      data: {
        articleId,
        sectionNumber: sec.sectionNumber,
        heading: sec.heading,
        content: sec.content,
        embedding,
      },
    });
  }

  return { sectionCount: sections.length };
}

/**
 * Generate embeddings for text using OpenRouter
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    return await generateOpenRouterEmbedding(text);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Add a new article to knowledge base with embeddings
 */
export async function addArticle(data: {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  author?: string;
}) {
  try {
    // Generate embedding for the article
    const embedding = await generateEmbedding(data.content);

    const baseSlug = slugify(data.title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create article
    const article = await getPrismaClient().knowledgeBaseArticle.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        summary: data.summary,
        category: data.category,
        tags: data.tags || [],
        source: data.source,
        sourceUrl: data.sourceUrl,
        author: data.author,
        embedding: embedding, // Store as vector
      },
    });

    // Section-level ingestion (higher precision retrieval)
    await upsertArticleSections(article.id, data.content);

    console.log(`Created article: ${article.id}`);
    return article;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

export async function getArticleById(articleId: string) {
  return getPrismaClient().knowledgeBaseArticle.findUnique({
    where: { id: articleId },
  });
}

export async function listArticles(options?: {
  query?: string;
  includeInactive?: boolean;
  limit?: number;
}) {
  const limit = options?.limit ?? 20;
  const query = options?.query?.trim();
  const includeInactive = options?.includeInactive ?? false;

  return getPrismaClient().knowledgeBaseArticle.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { summary: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { tags: { has: query.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 100),
  });
}

/**
 * Update an existing article. If content changes, re-embed automatically.
 * If title changes, slug is regenerated and made unique.
 */
export async function updateArticle(
  articleId: string,
  data: Partial<{
    title: string;
    content: string;
    summary: string;
    category: string;
    tags: string[];
    source: string;
    sourceUrl: string;
    author: string;
    isActive: boolean;
  }>
) {
  const prisma = getPrismaClient();

  const existing = await prisma.knowledgeBaseArticle.findUnique({
    where: { id: articleId },
    select: { id: true, title: true, content: true, slug: true },
  });
  if (!existing) throw new Error('Article not found');

  const updateData: any = { ...data };

  if (typeof data.title === 'string' && data.title.trim() && data.title !== existing.title) {
    const baseSlug = slugify(data.title);
    updateData.slug = await ensureUniqueSlug(baseSlug, articleId);
  }

  if (typeof data.content === 'string' && data.content.trim() && data.content !== existing.content) {
    updateData.embedding = await generateEmbedding(data.content);
    updateData.version = { increment: 1 };
  }

  const updated = await prisma.knowledgeBaseArticle.update({
    where: { id: articleId },
    data: updateData,
  });

  if (typeof data.content === 'string' && data.content.trim() && data.content !== existing.content) {
    await upsertArticleSections(articleId, data.content);
  }

  return updated;
}

/**
 * Soft-retire an article (recommended "untrain" approach for RAG).
 * Retrieval already filters `isActive = true`, so this removes it from answers.
 */
export async function setArticleActive(articleId: string, isActive: boolean) {
  return getPrismaClient().knowledgeBaseArticle.update({
    where: { id: articleId },
    data: { isActive },
  });
}

/**
 * Hard-delete an article (removes from DB). This will also cascade delete
 * relations/training data per schema.
 */
export async function deleteArticle(articleId: string) {
  return getPrismaClient().knowledgeBaseArticle.delete({
    where: { id: articleId },
  });
}

/**
 * Vector search to find similar articles
 */
export async function semanticSearch(
  query: string,
  limit: number = 5,
  threshold: number = SIMILARITY_THRESHOLD
) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search using raw SQL for pgvector similarity
    const results = await getPrismaClient().$queryRaw<any[]>`
      SELECT 
        id, 
        title, 
        content, 
        summary, 
        category,
        1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM "KnowledgeBaseArticle"
      WHERE isActive = true
      AND 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;

    return results;
  } catch (error) {
    console.error('Error in semantic search:', error);
    throw error;
  }
}

/**
 * Section-level vector search (more precise than whole-article search)
 */
export async function semanticSearchSections(
  query: string,
  limit: number = 10,
  threshold: number = 0.6
) {
  try {
    const queryEmbedding = await generateEmbedding(query);

    const results = await getPrismaClient().$queryRaw<any[]>`
      SELECT 
        s.id as "sectionId",
        s."articleId" as "articleId",
        s."sectionNumber" as "sectionNumber",
        s.heading as heading,
        s.content as content,
        a.title as "articleTitle",
        a.summary as "articleSummary",
        a.category as "articleCategory",
        a.tags as "articleTags",
        a.source as "articleSource",
        a."sourceUrl" as "articleSourceUrl",
        1 - (s.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM "ArticleSection" s
      JOIN "KnowledgeBaseArticle" a ON a.id = s."articleId"
      WHERE a."isActive" = true
      AND 1 - (s.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
      ORDER BY s.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;

    return results;
  } catch (error) {
    console.error('Error in section semantic search:', error);
    throw error;
  }
}

/**
 * Hybrid search: combines semantic search + keyword search
 */
export async function hybridSearch(
  query: string,
  limit: number = 5
) {
  try {
    // Section-first semantic search (higher precision)
    const sectionResults = await semanticSearchSections(query, Math.max(limit * 4, 10), 0.55);

    // Aggregate best section per article
    const bestByArticle = new Map<string, any>();
    for (const r of sectionResults) {
      const prev = bestByArticle.get(r.articleId);
      if (!prev || (r.similarity ?? 0) > (prev.similarity ?? 0)) {
        bestByArticle.set(r.articleId, r);
      }
    }

    const semanticResults = Array.from(bestByArticle.values())
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
      .slice(0, limit)
      .map((r) => ({
        id: r.articleId,
        title: r.articleTitle,
        content: r.content, // best matching section content (for grounding)
        summary: r.articleSummary,
        category: r.articleCategory,
        tags: r.articleTags,
        source: r.articleSource,
        sourceUrl: r.articleSourceUrl,
        similarity: r.similarity,
        // section metadata (for citations)
        sectionId: r.sectionId,
        sectionNumber: r.sectionNumber,
        sectionHeading: r.heading,
      }));

    // Keyword search for fallback
    const keywords = query.toLowerCase().split(' ');
    const keywordResults = await getPrismaClient().knowledgeBaseArticle.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: keywords } },
          { category: { in: keywords } },
        ],
      },
      take: limit,
    });

    // Merge and deduplicate results
    const merged = [
      ...semanticResults,
      ...keywordResults.filter(
        kr => !semanticResults.find(sr => sr.id === kr.id)
      ),
    ];

    return merged.slice(0, limit);
  } catch (error: any) {
    // If Prisma is not initialized (DATABASE_URL missing/invalid), return empty array
    // This allows the assistant to work without KB grounding
    const isPrismaInitError = 
      error?.name === 'PrismaClientInitializationError' ||
      error?.message?.includes('DATABASE_URL') ||
      error?.message?.includes('PrismaClient') ||
      error?.message?.includes('needs to be constructed');
    
    if (isPrismaInitError) {
      console.warn('Prisma not available for hybrid search, returning empty results:', error?.message || error);
      return [];
    }
    
    console.error('Error in hybrid search:', error);
    throw error;
  }
}

/**
 * Get related articles for knowledge graph
 */
export async function getRelatedArticles(articleId: string) {
  try {
    const article = await getPrismaClient().knowledgeBaseArticle.findUnique({
      where: { id: articleId },
    });

    if (!article) return [];

    // Find related articles based on embedding similarity
    const related = await getPrismaClient().$queryRaw<any[]>`
      SELECT 
        ra.id,
        ra."relatedId" as id,
        kba.title,
        kba.summary,
        ra."relevanceScore" as relevance
      FROM "RelatedArticle" ra
      JOIN "KnowledgeBaseArticle" kba ON kba.id = ra."relatedId"
      WHERE ra."articleId" = ${articleId}
      AND kba."isActive" = true
      ORDER BY ra."relevanceScore" DESC
      LIMIT 5
    `;

    return related;
  } catch (error) {
    console.error('Error getting related articles:', error);
    throw error;
  }
}

/**
 * Store training data from AI interactions
 */
export async function saveTrainingData(data: {
  articleId: string;
  question: string;
  answer: string;
  retrievalContext?: any;
  rating?: number;
  feedback?: string;
}) {
  try {
    const trainingData = await getPrismaClient().aITrainingData.create({
      data: {
        articleId: data.articleId,
        question: data.question,
        answer: data.answer,
        // NOTE: retrievalContext may not exist in the Prisma schema in some deployments.
        // Keep the ingestion resilient (we still store Q/A and optional rating/feedback).
        rating: data.rating,
        feedback: data.feedback,
        model: 'claude-3.5-sonnet',
      },
    });

    // Update article helpful count if rated
    if (data.rating && data.rating >= 4) {
      await getPrismaClient().knowledgeBaseArticle.update({
        where: { id: data.articleId },
        data: { helpfulCount: { increment: 1 } },
      });
    } else if (data.rating && data.rating <= 2) {
      await getPrismaClient().knowledgeBaseArticle.update({
        where: { id: data.articleId },
        data: { unhelpfulCount: { increment: 1 } },
      });
    }

    return trainingData;
  } catch (error) {
    console.error('Error saving training data:', error);
    throw error;
  }
}

/**
 * Get training data for analysis
 */
export async function getTrainingData(
  filter?: {
    articleId?: string;
    minRating?: number;
    model?: string;
  }
) {
  try {
    const data = await getPrismaClient().aITrainingData.findMany({
      where: {
        articleId: filter?.articleId,
        rating: filter?.minRating ? { gte: filter.minRating } : undefined,
        model: filter?.model,
      },
      include: {
        article: {
          select: {
            title: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return data;
  } catch (error) {
    console.error('Error getting training data:', error);
    throw error;
  }
}

/**
 * Batch process articles with embeddings
 */
export async function batchEmbedArticles(articleIds: string[]) {
  try {
    const articles = await getPrismaClient().knowledgeBaseArticle.findMany({
      where: { id: { in: articleIds } },
    });

    for (const article of articles) {
      const embedding = await generateEmbedding(article.content);
      await getPrismaClient().knowledgeBaseArticle.update({
        where: { id: article.id },
        data: { embedding },
      });
      console.log(`Embedded article: ${article.id}`);
    }

    return { success: true, count: articles.length };
  } catch (error) {
    console.error('Error batch embedding articles:', error);
    throw error;
  }
}

/**
 * Create knowledge graph by finding related articles
 */
export async function buildKnowledgeGraph() {
  try {
    const articles = await getPrismaClient().knowledgeBaseArticle.findMany({
      where: { isActive: true },
    });

    let connectionCount = 0;

    for (const article of articles) {
      // Find similar articles by embedding
      const related = await getPrismaClient().$queryRaw<any[]>`
        SELECT 
          id,
          1 - (embedding <=> ${JSON.stringify(article.embedding)}::vector) as similarity
        FROM "KnowledgeBaseArticle"
        WHERE id != ${article.id}
        AND isActive = true
        AND 1 - (embedding <=> ${JSON.stringify(article.embedding)}::vector) > 0.6
        ORDER BY embedding <=> ${JSON.stringify(article.embedding)}::vector
        LIMIT 5
      `;

      for (const rel of related) {
        // Check if relation already exists
        const existing = await getPrismaClient().relatedArticle.findFirst({
          where: {
            articleId: article.id,
            relatedId: rel.id,
          },
        });

        if (!existing) {
          await getPrismaClient().relatedArticle.create({
            data: {
              articleId: article.id,
              relatedId: rel.id,
              relevanceScore: rel.similarity,
            },
          });
          connectionCount++;
        }
      }
    }

    console.log(`Built knowledge graph with ${connectionCount} connections`);
    return { success: true, connectionCount };
  } catch (error) {
    console.error('Error building knowledge graph:', error);
    throw error;
  }
}

/**
 * Get knowledge base statistics
 */
export async function getKnowledgeBaseStats() {
  try {
    const [
      totalArticles,
      activeArticles,
      byCategory,
      mostViewed,
      mostHelpful,
      recentAdditions,
    ] = await Promise.all([
      getPrismaClient().knowledgeBaseArticle.count(),
      getPrismaClient().knowledgeBaseArticle.count({ where: { isActive: true } }),
      getPrismaClient().knowledgeBaseArticle.groupBy({
        by: ['category'],
        _count: true,
      }),
      getPrismaClient().knowledgeBaseArticle.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, title: true, viewCount: true },
      }),
      getPrismaClient().knowledgeBaseArticle.findMany({
        take: 5,
        orderBy: { helpfulCount: 'desc' },
        select: { id: true, title: true, helpfulCount: true },
      }),
      getPrismaClient().knowledgeBaseArticle.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true },
      }),
    ]);

    return {
      totalArticles,
      activeArticles,
      byCategory,
      mostViewed,
      mostHelpful,
      recentAdditions,
    };
  } catch (error) {
    console.error('Error getting KB stats:', error);
    throw error;
  }
}

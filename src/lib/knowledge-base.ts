/**
 * Knowledge Base Service with Vector Embeddings
 * Handles RAG (Retrieval-Augmented Generation) for AI training
 */

import { PrismaClient } from '@prisma/client';
import { openai } from '@/lib/openai-client'; // We'll create this

const prisma = new PrismaClient();

// Constants
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;
const SIMILARITY_THRESHOLD = 0.7;

interface EmbedArgs {
  input: string;
}

/**
 * Generate embeddings for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.substring(0, 8000), // OpenAI limit
    });

    return response.data[0].embedding;
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

    // Create article
    const article = await prisma.knowledgeBaseArticle.create({
      data: {
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
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

    console.log(`Created article: ${article.id}`);
    return article;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
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
    const results = await prisma.$queryRaw<any[]>`
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
 * Hybrid search: combines semantic search + keyword search
 */
export async function hybridSearch(
  query: string,
  limit: number = 5
) {
  try {
    // Semantic search results
    const semanticResults = await semanticSearch(query, limit, 0.6);

    // Keyword search for fallback
    const keywords = query.toLowerCase().split(' ');
    const keywordResults = await prisma.knowledgeBaseArticle.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { search: query } },
          { content: { search: query } },
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
  } catch (error) {
    console.error('Error in hybrid search:', error);
    throw error;
  }
}

/**
 * Get related articles for knowledge graph
 */
export async function getRelatedArticles(articleId: string) {
  try {
    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: { id: articleId },
    });

    if (!article) return [];

    // Find related articles based on embedding similarity
    const related = await prisma.$queryRaw<any[]>`
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
  rating?: number;
  feedback?: string;
}) {
  try {
    const trainingData = await prisma.aITrainingData.create({
      data: {
        articleId: data.articleId,
        question: data.question,
        answer: data.answer,
        rating: data.rating,
        feedback: data.feedback,
        model: 'claude-3.5-sonnet',
      },
    });

    // Update article helpful count if rated
    if (data.rating && data.rating >= 4) {
      await prisma.knowledgeBaseArticle.update({
        where: { id: data.articleId },
        data: { helpfulCount: { increment: 1 } },
      });
    } else if (data.rating && data.rating <= 2) {
      await prisma.knowledgeBaseArticle.update({
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
    const data = await prisma.aITrainingData.findMany({
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
    const articles = await prisma.knowledgeBaseArticle.findMany({
      where: { id: { in: articleIds } },
    });

    for (const article of articles) {
      const embedding = await generateEmbedding(article.content);
      await prisma.knowledgeBaseArticle.update({
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
    const articles = await prisma.knowledgeBaseArticle.findMany({
      where: { isActive: true },
    });

    let connectionCount = 0;

    for (const article of articles) {
      // Find similar articles by embedding
      const related = await prisma.$queryRaw<any[]>`
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
        const existing = await prisma.relatedArticle.findFirst({
          where: {
            articleId: article.id,
            relatedId: rel.id,
          },
        });

        if (!existing) {
          await prisma.relatedArticle.create({
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
      prisma.knowledgeBaseArticle.count(),
      prisma.knowledgeBaseArticle.count({ where: { isActive: true } }),
      prisma.knowledgeBaseArticle.groupBy({
        by: ['category'],
        _count: true,
      }),
      prisma.knowledgeBaseArticle.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, title: true, viewCount: true },
      }),
      prisma.knowledgeBaseArticle.findMany({
        take: 5,
        orderBy: { helpfulCount: 'desc' },
        select: { id: true, title: true, helpfulCount: true },
      }),
      prisma.knowledgeBaseArticle.findMany({
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

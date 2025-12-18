/**
 * Knowledge Base Statistics API
 * GET /api/knowledge/stats
 * Returns analytics and statistics about the knowledge base
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeBaseStats } from '@/lib/knowledge-base';
import { prisma } from '@/generated/prisma/client';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const stats = await getKnowledgeBaseStats();

    // Get recent additions
    const recentAdditions = await prisma.knowledgeBaseArticle.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    // Get most viewed
    const mostViewed = await prisma.knowledgeBaseArticle.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        viewCount: true,
      },
    });

    // Get most helpful (based on training data ratings)
    const mostHelpful = await prisma.aiTrainingData.groupBy({
      by: ['articleId'],
      _avg: { rating: true },
      _count: true,
      orderBy: { _avg: { rating: 'desc' } },
      take: 5,
    });

    const helpfulWithTitles = await Promise.all(
      mostHelpful.map(async (item) => {
        const article = await prisma.knowledgeBaseArticle.findUnique({
          where: { id: item.articleId },
          select: { title: true },
        });
        return {
          id: item.articleId,
          title: article?.title || 'Unknown',
          helpfulCount: item._count,
          avgRating: (item._avg.rating || 0).toFixed(2),
        };
      })
    );

    // Get articles by category
    const byCategory = await prisma.knowledgeBaseArticle.groupBy({
      by: ['category'],
      _count: true,
      where: { active: true },
    });

    return NextResponse.json({
      totalArticles: stats.totalArticles,
      activeArticles: stats.activeArticles,
      totalSections: stats.totalSections,
      totalConnections: stats.totalConnections,
      coveragePercentage: stats.coveragePercentage,
      averageRelevanceScore: stats.averageRelevanceScore,
      recentAdditions,
      mostViewed,
      mostHelpful: helpfulWithTitles,
      byCategory,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

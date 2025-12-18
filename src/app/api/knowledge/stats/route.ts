/**
 * Knowledge Base Statistics API
 * GET /api/knowledge/stats
 * Returns analytics and statistics about the knowledge base
 */

import { NextResponse } from 'next/server';
import { getKnowledgeBaseStats } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const stats = await getKnowledgeBaseStats();

    return NextResponse.json({
      ...stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

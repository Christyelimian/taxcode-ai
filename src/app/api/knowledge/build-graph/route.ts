/**
 * Build Knowledge Graph API
 * POST /api/knowledge/build-graph
 * Builds connections between related articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildKnowledgeGraph } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // This is a long-running operation
    // Ideally run in background, but for now return immediately with progress
    
    const result = await buildKnowledgeGraph();

    return NextResponse.json(
      {
        message: 'Knowledge graph built successfully',
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Build graph error:', error);
    return NextResponse.json(
      { error: 'Failed to build knowledge graph' },
      { status: 500 }
    );
  }
}

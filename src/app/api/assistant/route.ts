import { NextRequest, NextResponse } from 'next/server';
import { getAiResponse } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await getAiResponse({ question });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
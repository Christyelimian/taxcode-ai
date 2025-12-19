import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion, type OpenRouterChatMessage } from '@/lib/openrouter-client';
import { hybridSearch } from '@/lib/knowledge-base';
import { cookies } from 'next/headers';
import { getUserFromRequestCookies } from '@/lib/session';

export const runtime = 'nodejs';

type Language = 'en' | 'ha' | 'yo' | 'ig';

function languageName(lang: Language | undefined) {
  switch (lang) {
    case 'ha':
      return 'Hausa';
    case 'yo':
      return 'Yoruba';
    case 'ig':
      return 'Igbo';
    case 'en':
    default:
      return 'English';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = typeof body?.question === 'string' ? body.question : '';
    const language = (body?.language as Language | undefined) ?? 'en';
    const history = Array.isArray(body?.history) ? (body.history as any[]) : [];

    if (!question.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Optional: tie to authenticated user (Firebase session cookie).
    const cookieStore = await cookies();
    const user = await getUserFromRequestCookies(cookieStore);

    // Retrieve KB grounding (section-level best hits already returned by hybridSearch()).
    // Gracefully handle Prisma/Neon connection errors - fall back to answering without KB.
    let kb: any[] = [];
    try {
      const articles = await hybridSearch(question, 6);
      kb = articles.map((a: any) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        summary: a.summary,
        content: a.content, // best-matching section content when section-search hit
        sectionHeading: a.sectionHeading,
        sectionNumber: a.sectionNumber,
        similarity: Number((a.similarity ?? 0).toFixed?.(3) ?? a.similarity ?? 0),
        source: a.source ?? null,
        sourceUrl: a.sourceUrl ?? null,
      }));
    } catch (kbError: any) {
      // Log but don't fail the request - assistant can still answer without KB grounding
      console.warn('Knowledge Base search unavailable:', kbError?.message || kbError);
      // Continue with empty KB array - the system prompt will handle this
    }

    const hasKb = Array.isArray(kb) && kb.length > 0;
    const system = `You are TaxCode's AI Tax Assistant — a world-class, careful Nigerian tax co-pilot.
You must answer in ${languageName(language)}.

Hard rules:
- Be accurate, practical, and professional.
${hasKb ? '- Use the provided Knowledge Base excerpts as primary grounding when relevant.' : '- Knowledge Base is currently unavailable. Answer using your general knowledge of Nigerian tax law, but be clear that you cannot cite specific KB articles.'}
- If the KB does not contain enough information (or is unavailable), say so plainly and answer using general Nigerian tax knowledge without inventing fake citations or sections.
- If the user asks for calculations, show the steps and assumptions.
- If the user asks legal/filing advice, include clear next steps and common pitfalls.

Output format:
Return ONLY valid JSON (no markdown) with this shape:
{
  "answer": string,
  "documentation": string,
  "suggestedQuestions": string[]
}

Where:
- answer: the user-facing response (can include bullets, tables as plain text)
- documentation: short grounding notes + citations (when available). ${hasKb ? 'If KB is insufficient, write "No KB citation available."' : 'Write "Knowledge Base currently unavailable. Answer based on general Nigerian tax knowledge."'}
- suggestedQuestions: 3-6 short follow-up questions tailored to this conversation.
`;

    const trimmedHistory = history
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10)
      .map(
        (m): OpenRouterChatMessage => ({
          role: m.role,
          content: String(m.content).slice(0, 6000),
        })
      );

    const userMsg = `User:
${question}

Conversation history (most recent last):
${JSON.stringify(trimmedHistory)}

${hasKb ? `Knowledge Base excerpts (JSON):
${JSON.stringify(kb)}` : 'Knowledge Base: Currently unavailable. Answer using general Nigerian tax knowledge.'}

User metadata (optional):
${JSON.stringify({ userId: user?.uid ?? null, email: user?.email ?? null })}
`;

    const { text, usage } = await chatCompletion({
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.2,
      maxTokens: 1400,
    });

    const jsonText = extractFirstJsonObject(text);
    const parsed = JSON.parse(jsonText) as {
      answer?: string;
      documentation?: string;
      suggestedQuestions?: string[];
    };

    return NextResponse.json({
      success: true,
      data: {
        answer: String(parsed.answer ?? '').trim(),
        documentation: String(parsed.documentation ?? '').trim(),
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
          ? parsed.suggestedQuestions.map((s) => String(s)).filter(Boolean).slice(0, 8)
          : [],
        usage: usage ?? null,
      },
    });
  } catch (error: any) {
    console.error('assistant-worldclass error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractFirstJsonObject(s: string): string {
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model did not return JSON.');
  }
  return s.slice(start, end + 1);
}



/**
 * Admin Document Extract API
 * POST /api/admin/document-extract
 *
 * Accepts multipart/form-data with:
 * - file: PDF/DOCX/TXT/MD
 * OR JSON with:
 * - text: string
 *
 * Returns extracted plain text for AI processing.
 */

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';

function normalizeText(text: string) {
  return text.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // JSON fallback: { text }
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const text = typeof body?.text === 'string' ? normalizeText(body.text) : '';
      if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 });
      return NextResponse.json({ text });
    }

    // Multipart upload
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mime = file.type || '';
    const name = (file as any).name || '';
    const ext = name.toLowerCase().split('.').pop();

    let extracted = '';

    if (mime === 'application/pdf' || ext === 'pdf') {
      // `pdf-parse` ESM entry does not provide a default export; dynamic import avoids interop issues.
      const { PDFParse } = await import('pdf-parse');
      // In Next.js/Turbopack server runtime, pdf.js worker bundling can fail; disable workers.
      const parser = new PDFParse({ data: buffer, disableWorker: true } as any);
      try {
        const data = await parser.getText();
        extracted = data.text || '';
      } finally {
        await parser.destroy();
      }
    } else if (
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extracted = result.value || '';
    } else {
      // txt/md fallback
      extracted = buffer.toString('utf8');
    }

    extracted = normalizeText(extracted);
    if (!extracted) {
      return NextResponse.json({ error: 'Failed to extract text (empty result)' }, { status: 422 });
    }

    // Safety cap (avoid huge payloads)
    const capped = extracted.length > 200_000 ? extracted.slice(0, 200_000) : extracted;

    return NextResponse.json({
      fileName: name,
      mimeType: mime,
      length: capped.length,
      truncated: extracted.length > capped.length,
      text: capped,
    });
  } catch (error) {
    console.error('Document extract error:', error);
    return NextResponse.json({ error: 'Failed to extract document text' }, { status: 500 });
  }
}



import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { getPrismaClient } from '@/lib/prisma';
import { Resend } from 'resend';
import OpenAI from 'openai';

// POST test connection
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded || !decoded.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = await getUserRole(decoded.uid);
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { type } = await request.json();

    switch (type) {
      case 'database': {
        // Test PostgreSQL connection
        try {
          const prisma = getPrismaClient();
          await prisma.$queryRaw`SELECT 1`;
          return NextResponse.json({
            success: true,
            message: 'Database connection successful',
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            error: `Database connection failed: ${error.message}`,
          });
        }
      }

      case 'email': {
        // Test Resend email connection
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          // Try to validate API key by checking domains (non-destructive test)
          // Note: Resend doesn't have a simple ping endpoint, so we'll just verify the key exists
          if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not configured');
          }
          
          return NextResponse.json({
            success: true,
            message: 'Email service configured (API key present)',
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            error: `Email service test failed: ${error.message}`,
          });
        }
      }

      case 'firebase': {
        // Test Firebase connection
        try {
          const { auth, db } = getFirebaseAdmin();
          
          if (!auth || !db) {
            throw new Error('Firebase not initialized');
          }
          
          // Test Firestore connection
          await db.collection('_test').doc('connection').set({
            test: true,
            timestamp: new Date(),
          });
          
          await db.collection('_test').doc('connection').delete();
          
          return NextResponse.json({
            success: true,
            message: 'Firebase connection successful',
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            error: `Firebase connection failed: ${error.message}`,
          });
        }
      }

      case 'ai': {
        // Test AI service connections
        try {
          const results: string[] = [];
          
          // Test OpenAI
          if (process.env.OPENAI_API_KEY) {
            try {
              const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
              // Simple validation - check if key format is correct
              if (process.env.OPENAI_API_KEY.startsWith('sk-')) {
                results.push('OpenAI API key configured');
              } else {
                results.push('OpenAI API key format invalid');
              }
            } catch (error: any) {
              results.push(`OpenAI error: ${error.message}`);
            }
          } else {
            results.push('OpenAI API key not configured');
          }
          
          // Test OpenRouter
          if (process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
            const key = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
            if (key?.startsWith('sk-or-')) {
              results.push('OpenRouter API key configured');
            } else {
              results.push('OpenRouter API key format invalid');
            }
          } else {
            results.push('OpenRouter API key not configured');
          }
          
          return NextResponse.json({
            success: results.every(r => !r.includes('not configured') && !r.includes('error')),
            message: results.join('; '),
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            error: `AI service test failed: ${error.message}`,
          });
        }
      }

      default:
        return NextResponse.json(
          { error: 'Invalid connection type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test connection' },
      { status: 500 }
    );
  }
}



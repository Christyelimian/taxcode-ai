import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';
import { getFirebaseAdmin } from '@/lib/firebase-server';

// Get all environment variables from process.env
function getAllEnvironmentVariables() {
  const envVars: Array<{ key: string; value: string; isSecret: boolean; description?: string; source: 'env' | 'custom' }> = [];
  
  // Known environment variables with descriptions
  const knownVars: Record<string, { isSecret: boolean; description: string }> = {
    DATABASE_URL: { isSecret: true, description: 'PostgreSQL database connection string' },
    FIREBASE_PROJECT_ID: { isSecret: false, description: 'Firebase project ID' },
    FIREBASE_CLIENT_EMAIL: { isSecret: false, description: 'Firebase service account email' },
    FIREBASE_PRIVATE_KEY: { isSecret: true, description: 'Firebase private key' },
    RESEND_API_KEY: { isSecret: true, description: 'Resend email API key' },
    OPENAI_API_KEY: { isSecret: true, description: 'OpenAI API key for embeddings' },
    OPENROUTER_API_KEY: { isSecret: true, description: 'OpenRouter API key for AI chat' },
    NEXT_PUBLIC_FIREBASE_API_KEY: { isSecret: false, description: 'Firebase client API key (public)' },
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: { isSecret: false, description: 'Firebase auth domain (public)' },
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: { isSecret: false, description: 'Firebase project ID (public)' },
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: { isSecret: false, description: 'Firebase storage bucket (public)' },
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: { isSecret: false, description: 'Firebase messaging sender ID (public)' },
    NEXT_PUBLIC_FIREBASE_APP_ID: { isSecret: false, description: 'Firebase app ID (public)' },
    VERCEL: { isSecret: false, description: 'Vercel deployment indicator' },
    VERCEL_ENV: { isSecret: false, description: 'Vercel environment (production/preview/development)' },
    VERCEL_URL: { isSecret: false, description: 'Vercel deployment URL' },
  };

  // Get all environment variables
  for (const [key, value] of Object.entries(process.env)) {
    // Skip Next.js internal variables
    if (key.startsWith('__') || key === 'NODE_ENV') continue;
    
    const known = knownVars[key];
    const isSecret = known?.isSecret || 
                     key.toLowerCase().includes('key') || 
                     key.toLowerCase().includes('secret') || 
                     key.toLowerCase().includes('password') ||
                     key.toLowerCase().includes('token') ||
                     key.toLowerCase().includes('private');
    
    envVars.push({
      key,
      value: isSecret && value ? '***' : (value || ''),
      isSecret,
      description: known?.description,
      source: 'env',
    });
  }

  // Sort: known vars first, then alphabetically
  return envVars.sort((a, b) => {
    const aKnown = knownVars[a.key] ? 0 : 1;
    const bKnown = knownVars[b.key] ? 0 : 1;
    if (aKnown !== bKnown) return aKnown - bKnown;
    return a.key.localeCompare(b.key);
  });
}

// Merge environment variables from process.env with saved custom vars
function mergeEnvironmentVariables(
  envVars: Array<{ key: string; value: string; isSecret: boolean; description?: string; source: 'env' | 'custom' }>,
  savedVars: Array<{ key: string; value: string; isSecret: boolean; description?: string }>
) {
  const merged = new Map<string, typeof envVars[0]>();
  
  // Add all env vars first (these are the actual values)
  for (const envVar of envVars) {
    merged.set(envVar.key, envVar);
  }
  
  // Add saved custom vars (for documentation/reference, but don't override actual env values)
  for (const savedVar of savedVars) {
    if (!merged.has(savedVar.key)) {
      // Only add if it doesn't exist in process.env (custom var)
      merged.set(savedVar.key, {
        ...savedVar,
        source: 'custom',
      });
    } else {
      // Update description if provided in saved vars
      const existing = merged.get(savedVar.key)!;
      if (savedVar.description && !existing.description) {
        existing.description = savedVar.description;
      }
    }
  }
  
  return Array.from(merged.values());
}

// GET settings
export async function GET() {
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

    // Load settings from Firestore
    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const settingsDoc = await db.collection('adminSettings').doc('main').get();
    
    if (!settingsDoc.exists) {
      // Return default settings
      return NextResponse.json({
        envVars: [],
        email: {
          provider: 'resend',
          apiKey: '',
          fromEmail: 'contact@taxcode.com.ng',
          fromName: 'TaxCode',
        },
        ai: {
          openaiApiKey: '',
          openrouterApiKey: '',
          defaultModel: 'claude-3.5-sonnet',
          temperature: 0.7,
        },
        database: {
          url: '',
          backupEnabled: true,
          backupFrequency: 'daily',
          lastBackup: undefined,
        },
        firebase: {
          projectId: '',
          clientEmail: '',
          privateKey: '',
        },
        system: {
          maintenanceMode: false,
          allowRegistrations: true,
          maxUploadSize: 10485760,
          sessionTimeout: 3600,
        },
      });
    }

    const settings = settingsDoc.data();
    
    // Get ALL environment variables from process.env
    // Priority: process.env (actual) > Firestore settings (reference)
    const allEnvVars = getAllEnvironmentVariables();
    
    // Merge with saved custom env vars from Firestore (for documentation/reference)
    const savedEnvVars = settings.envVars || [];
    const mergedEnvVars = mergeEnvironmentVariables(allEnvVars, savedEnvVars);

    // Merge settings with actual environment values
    const mergedSettings = {
      ...settings,
      envVars: mergedEnvVars,
      // Override with actual env values if they exist
      email: {
        ...settings.email,
        apiKey: process.env.RESEND_API_KEY ? '***' : (settings.email?.apiKey || ''),
      },
      ai: {
        ...settings.ai,
        openaiApiKey: process.env.OPENAI_API_KEY ? '***' : (settings.ai?.openaiApiKey || ''),
        openrouterApiKey: process.env.OPENROUTER_API_KEY ? '***' : (settings.ai?.openrouterApiKey || ''),
      },
      database: {
        ...settings.database,
        url: process.env.DATABASE_URL ? '***' : (settings.database?.url || ''),
      },
      firebase: {
        ...settings.firebase,
        projectId: process.env.FIREBASE_PROJECT_ID || settings.firebase?.projectId || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || settings.firebase?.clientEmail || '',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? '***' : (settings.firebase?.privateKey || ''),
      },
    };

    return NextResponse.json(mergedSettings);
  } catch (error: any) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load settings' },
      { status: 500 }
    );
  }
}

// POST settings (update)
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

    const settings = await request.json();

    // Save to Firestore
    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    await db.collection('adminSettings').doc('main').set({
      ...settings,
      updatedAt: new Date(),
      updatedBy: decoded.uid,
    }, { merge: true });

    // Note: Environment variables cannot be updated at runtime in Next.js
    // They would need to be updated in the deployment environment
    // We store them in Firestore for reference, but actual changes require redeployment

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}




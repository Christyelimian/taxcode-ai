import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';

// GET environment variables from Vercel API
export async function GET(request: NextRequest) {
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

    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;

    if (!vercelToken) {
      return NextResponse.json(
        { error: 'VERCEL_TOKEN not configured. Add it to your environment variables to enable Vercel sync.' },
        { status: 400 }
      );
    }

    // Get project ID from query or env
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') || vercelProjectId;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required. Set VERCEL_PROJECT_ID or provide projectId query parameter.' },
        { status: 400 }
      );
    }

    // Fetch environment variables from Vercel API
    const url = vercelTeamId
      ? `https://api.vercel.com/v9/projects/${projectId}/env?teamId=${vercelTeamId}`
      : `https://api.vercel.com/v9/projects/${projectId}/env`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Vercel API error: ${error}` },
        { status: response.status }
      );
    }

    const vercelEnvs = await response.json();
    
    // Transform Vercel format to our format
    const envVars = vercelEnvs.envs?.map((env: any) => ({
      key: env.key,
      value: env.value || '',
      isSecret: env.type === 'secret' || env.type === 'encrypted',
      description: env.target?.join(', ') || '',
      source: 'vercel' as const,
      environments: env.target || [],
    })) || [];

    return NextResponse.json({
      success: true,
      envVars,
      projectId,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching Vercel env vars:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Vercel environment variables' },
      { status: 500 }
    );
  }
}




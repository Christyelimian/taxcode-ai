import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';
import { getFirebaseAdmin } from '@/lib/firebase-server';

/**
 * API route to migrate faculty members from teamMembers to faculty collection
 * 
 * POST /api/admin/migrate-faculty
 * Body: { dryRun?: boolean }
 * 
 * Requires admin authentication
 */

function isFirestoreTimestamp(value: any): boolean {
  return value && typeof value.toDate === 'function';
}

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

    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore is not initialized' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const dryRun = body.dryRun === true;

    const stats = {
      total: 0,
      consultants: 0,
      lawyers: 0,
      faculty: 0,
      migrated: 0,
      errors: 0,
      skipped: [] as string[],
      migratedIds: [] as string[],
    };

    try {
      // Get all documents from teamMembers collection
      const teamMembersSnapshot = await db.collection('teamMembers').get();
      stats.total = teamMembersSnapshot.size;

      const batch = db.batch();
      let batchCount = 0;
      const batchSize = 500;

      for (const doc of teamMembersSnapshot.docs) {
        const data = doc.data();
        const docId = doc.id;

        // Skip consultants
        if (data.isConsultant === true || data.role === 'Tax Consultant') {
          stats.consultants++;
          stats.skipped.push(`${data.name || docId} (consultant)`);
          continue;
        }

        // Skip lawyers
        if (data.isLawyer === true || data.role === 'Tax Lawyer') {
          stats.lawyers++;
          stats.skipped.push(`${data.name || docId} (lawyer)`);
          continue;
        }

        // This is a faculty member - prepare for migration
        stats.faculty++;

        if (!dryRun) {
          // Check if already exists in faculty collection
          const existingDoc = await db.collection('faculty').doc(docId).get();
          
          if (existingDoc.exists) {
            // Update existing document
            batch.set(
              db.collection('faculty').doc(docId),
              {
                ...data,
                createdAt: data.createdAt || new Date(),
              },
              { merge: true }
            );
          } else {
            // Create new document
            batch.set(db.collection('faculty').doc(docId), {
              ...data,
              createdAt: data.createdAt || new Date(),
            });
          }

          stats.migratedIds.push(docId);
          batchCount++;

          // Firestore batches are limited to 500 operations
          if (batchCount >= batchSize) {
            await batch.commit();
            batchCount = 0;
          }
        } else {
          stats.migratedIds.push(docId);
        }
      }

      // Commit remaining documents
      if (!dryRun && batchCount > 0) {
        await batch.commit();
      }

      if (dryRun) {
        stats.migrated = stats.faculty; // Preview count
      } else {
        stats.migrated = stats.migratedIds.length;
      }

      return NextResponse.json({
        success: true,
        dryRun,
        stats,
        message: dryRun
          ? 'Dry run completed. No changes were made.'
          : 'Migration completed successfully.',
      });
    } catch (error: any) {
      console.error('Migration error:', error);
      stats.errors++;
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Migration failed',
          stats,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



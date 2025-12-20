import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { getPrismaClient } from '@/lib/prisma';

// POST restore backup
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

    const backup = await request.json();

    if (!backup.version || !backup.firestore || !backup.postgres) {
      return NextResponse.json(
        { error: 'Invalid backup format' },
        { status: 400 }
      );
    }

    // Restore Firestore data
    const { db } = getFirebaseAdmin();
    
    if (db && backup.firestore) {
      for (const [collectionName, documents] of Object.entries(backup.firestore)) {
        if (Array.isArray(documents)) {
          const batch = db.batch();
          let batchCount = 0;
          
          for (const doc of documents as any[]) {
            const { id, ...data } = doc;
            const docRef = db.collection(collectionName).doc(id || undefined);
            batch.set(docRef, data);
            batchCount++;
            
            // Firestore batches are limited to 500 operations
            if (batchCount >= 500) {
              await batch.commit();
              batchCount = 0;
            }
          }
          
          if (batchCount > 0) {
            await batch.commit();
          }
        }
      }
    }

    // Restore PostgreSQL data
    if (backup.postgres) {
      const prisma = getPrismaClient();
      // Clear existing data (optional - you might want to ask for confirmation)
      // For safety, we'll use upsert operations instead
      
      if (backup.postgres.users) {
        for (const user of backup.postgres.users) {
          await prisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
          });
        }
      }

      if (backup.postgres.knowledgeBaseArticles) {
        for (const article of backup.postgres.knowledgeBaseArticles) {
          await prisma.knowledgeBaseArticle.upsert({
            where: { id: article.id },
            update: article,
            create: article,
          });
        }
      }

      if (backup.postgres.questions) {
        for (const question of backup.postgres.questions) {
          await prisma.question.upsert({
            where: { id: question.id },
            update: question,
            create: question,
          });
        }
      }

      if (backup.postgres.answers) {
        for (const answer of backup.postgres.answers) {
          await prisma.answer.upsert({
            where: { id: answer.id },
            update: answer,
            create: answer,
          });
        }
      }

      // Add more table restores as needed
      // Note: This is a simplified version. In production, you'd want to handle
      // foreign key constraints and relationships more carefully
    }

    return NextResponse.json({ success: true, message: 'Backup restored successfully' });
  } catch (error: any) {
    console.error('Error restoring backup:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to restore backup' },
      { status: 500 }
    );
  }
}



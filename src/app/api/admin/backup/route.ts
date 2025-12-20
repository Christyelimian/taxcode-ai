import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { getPrismaClient } from '@/lib/prisma';

// POST create backup
export async function POST() {
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

    // Backup Firestore data
    const { db } = getFirebaseAdmin();
    const firestoreBackup: any = {};
    
    if (db) {
      const collections = ['users', 'trainingModules', 'knowledgeBase', 'contacts', 'bookingRequests', 'adminSettings'];
      
      for (const collectionName of collections) {
        try {
          const snapshot = await db.collection(collectionName).get();
          firestoreBackup[collectionName] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.warn(`Failed to backup collection ${collectionName}:`, error);
        }
      }
    }

    // Backup PostgreSQL data
    const postgresBackup: any = {};
    
    try {
      const prisma = getPrismaClient();
      // Backup all tables
      postgresBackup.users = await prisma.user.findMany();
      postgresBackup.knowledgeBaseArticles = await prisma.knowledgeBaseArticle.findMany();
      postgresBackup.articleSections = await prisma.articleSection.findMany();
      postgresBackup.questions = await prisma.question.findMany();
      postgresBackup.answers = await prisma.answer.findMany();
      postgresBackup.votes = await prisma.vote.findMany();
      postgresBackup.enrollments = await prisma.enrollment.findMany();
      postgresBackup.lessonProgress = await prisma.lessonProgress.findMany();
      postgresBackup.learningPaths = await prisma.learningPath.findMany();
      postgresBackup.userLearningPaths = await prisma.userLearningPath.findMany();
      postgresBackup.bookmarkedCourses = await prisma.bookmarkedCourse.findMany();
      postgresBackup.documents = await prisma.documents.findMany();
      postgresBackup.savedArticles = await prisma.savedArticle.findMany();
      postgresBackup.aiTrainingData = await prisma.aITrainingData.findMany();
      postgresBackup.vectorSearchCache = await prisma.vectorSearchCache.findMany();
      postgresBackup.badges = await prisma.badge.findMany();
      postgresBackup.userBadges = await prisma.userBadge.findMany();
      postgresBackup.notifications = await prisma.notification.findMany();
      postgresBackup.flags = await prisma.flag.findMany();
    } catch (error) {
      console.error('Failed to backup PostgreSQL data:', error);
    }

    // Create backup object
    const backup = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      firestore: firestoreBackup,
      postgres: postgresBackup,
      metadata: {
        collections: Object.keys(firestoreBackup),
        tables: Object.keys(postgresBackup),
      },
    };

    // Update last backup time in settings
    if (db) {
      await db.collection('adminSettings').doc('main').set({
        database: {
          lastBackup: new Date().toISOString(),
        },
      }, { merge: true });
    }

    // Return as JSON file download
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create backup' },
      { status: 500 }
    );
  }
}



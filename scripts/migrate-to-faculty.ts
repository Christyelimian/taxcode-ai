import 'dotenv/config';
import { getFirebaseAdmin } from "../src/lib/firebase-server";

/**
 * Migration script to move faculty members from teamMembers to faculty collection
 * 
 * This script:
 * 1. Reads all documents from teamMembers collection
 * 2. Filters out consultants (isConsultant === true) and lawyers (isLawyer === true)
 * 3. Moves remaining members to faculty collection
 * 4. Optionally deletes from teamMembers after successful migration
 * 
 * Usage:
 *   npm run ts-node scripts/migrate-to-faculty.ts --dry-run  (preview changes)
 *   npm run ts-node scripts/migrate-to-faculty.ts            (execute migration)
 */

interface MigrationStats {
  total: number;
  consultants: number;
  lawyers: number;
  faculty: number;
  migrated: number;
  errors: number;
}

async function migrateToFaculty(dryRun: boolean = false) {
  const { db } = getFirebaseAdmin();
  
  if (!db) {
    throw new Error("Firestore is not initialized. Please check your environment variables.");
  }

  console.log('\n🔄 Starting Faculty Migration...\n');
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes will be made)' : '✅ LIVE MIGRATION'}\n`);

  const stats: MigrationStats = {
    total: 0,
    consultants: 0,
    lawyers: 0,
    faculty: 0,
    migrated: 0,
    errors: 0,
  };

  try {
    // Get all documents from teamMembers collection
    const teamMembersSnapshot = await db.collection('teamMembers').get();
    stats.total = teamMembersSnapshot.size;

    console.log(`📊 Found ${stats.total} documents in teamMembers collection\n`);

    const batch = db.batch();
    let batchCount = 0;
    const batchSize = 500;

    for (const doc of teamMembersSnapshot.docs) {
      const data = doc.data();
      const docId = doc.id;

      // Skip consultants
      if (data.isConsultant === true || data.role === 'Tax Consultant') {
        stats.consultants++;
        console.log(`⏭️  Skipping consultant: ${data.name || docId}`);
        continue;
      }

      // Skip lawyers
      if (data.isLawyer === true || data.role === 'Tax Lawyer') {
        stats.lawyers++;
        console.log(`⏭️  Skipping lawyer: ${data.name || docId}`);
        continue;
      }

      // This is a faculty member - prepare for migration
      stats.faculty++;
      console.log(`✅ Faculty member found: ${data.name || docId} (${data.role || 'N/A'})`);

      if (!dryRun) {
        // Add to faculty collection
        const facultyRef = db.collection('faculty').doc(docId);
        batch.set(facultyRef, {
          ...data,
          // Ensure createdAt exists
          createdAt: data.createdAt || new Date(),
        });

        batchCount++;

        // Firestore batches are limited to 500 operations
        if (batchCount >= batchSize) {
          await batch.commit();
          console.log(`   💾 Committed batch of ${batchCount} documents`);
          batchCount = 0;
        }
      }
    }

    // Commit remaining documents
    if (!dryRun && batchCount > 0) {
      await batch.commit();
      console.log(`   💾 Committed final batch of ${batchCount} documents`);
      stats.migrated = stats.faculty;
    } else if (dryRun) {
      stats.migrated = stats.faculty; // Preview count
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 Migration Summary');
    console.log('='.repeat(60));
    console.log(`Total documents in teamMembers: ${stats.total}`);
    console.log(`Consultants (skipped): ${stats.consultants}`);
    console.log(`Lawyers (skipped): ${stats.lawyers}`);
    console.log(`Faculty members found: ${stats.faculty}`);
    console.log(`Documents ${dryRun ? 'to be ' : ''}migrated: ${stats.migrated}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('='.repeat(60) + '\n');

    if (dryRun) {
      console.log('🔍 This was a dry run. No changes were made.');
      console.log('💡 Run without --dry-run flag to execute the migration.\n');
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('💡 Faculty members are now in the faculty collection.');
      console.log('💡 Consultants and lawyers remain in teamMembers collection.\n');
    }

    return stats;
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error);
    stats.errors++;
    throw error;
  }
}

// Main execution
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');

migrateToFaculty(dryRun)
  .then(() => {
    console.log('✨ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });



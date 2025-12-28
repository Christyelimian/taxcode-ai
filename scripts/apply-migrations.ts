#!/usr/bin/env tsx
/**
 * Apply pending Prisma migrations to production database
 * Usage: npx tsx scripts/apply-migrations.ts
 */

import { execSync } from 'child_process';

console.log('🚀 Applying Prisma migrations to production database...\n');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.log('\nPlease set DATABASE_URL in your environment or .env file');
    process.exit(1);
  }

  console.log('📦 Running Prisma migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });

  console.log('\n✅ Migrations applied successfully!');
  console.log('\n📊 Verifying schema...');
  
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env,
  });

  console.log('\n✅ Prisma client regenerated successfully!');
  console.log('\n🎉 All migrations have been applied. Your database is up to date!');
} catch (error: any) {
  console.error('\n❌ Error applying migrations:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('1. Ensure DATABASE_URL is correct');
  console.log('2. Ensure you have database access');
  console.log('3. Check if migrations are already applied');
  console.log('4. Run: npx prisma migrate status');
  process.exit(1);
}




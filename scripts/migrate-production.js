#!/usr/bin/env node

/**
 * Production Database Migration Script
 *
 * This script helps migrate the database schema to production.
 * Make sure to set your production DATABASE_URL before running.
 *
 * Usage:
 * 1. Set your production DATABASE_URL: export DATABASE_URL="your-production-url"
 * 2. Run: node scripts/migrate-production.js
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function migrateProduction() {
  console.log('🚀 Starting production database migration...');

  // Check if DATABASE_URL is set to production
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('Please set your production DATABASE_URL:');
    console.log('export DATABASE_URL="your-production-database-url"');
    process.exit(1);
  }

  // Warn if it looks like a local database
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    console.warn('⚠️  WARNING: DATABASE_URL appears to be a local database!');
    console.warn('Make sure you set the PRODUCTION DATABASE_URL before running this script.');
    console.log('Current DATABASE_URL:', dbUrl);
    process.exit(1);
  }

  console.log('📊 Connecting to database...');
  console.log('Database URL:', dbUrl.replace(/:[^:]*@/, ':***@')); // Hide password

  try {
    // Test connection
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Run migration
    console.log('🔄 Running database migration...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

    console.log('✅ Database migration completed successfully!');

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('🎉 Production migration complete!');
    console.log('Your Vercel deployment should now work correctly.');

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the migration
migrateProduction().catch(console.error);

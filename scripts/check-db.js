#!/usr/bin/env node

/**
 * Database Check Script
 * Verifies the current state of the Insight table
 */

const { getPrismaClient } = require('../src/lib/community-helpers');

async function checkDatabase() {
  console.log('🔍 Checking database state...\n');

  try {
    const prisma = getPrismaClient();

    // Check Insight table structure
    console.log('📊 Insight table info:');
    const insights = await prisma.insight.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        image: true,
        isPublished: true,
        createdAt: true
      }
    });

    console.log(`Found ${insights.length} insights in database:`);
    insights.forEach((insight, i) => {
      console.log(`${i + 1}. ${insight.title}`);
      console.log(`   - ID: ${insight.id}`);
      console.log(`   - Image: ${insight.image || 'null'}`);
      console.log(`   - Published: ${insight.isPublished}`);
      console.log(`   - Created: ${insight.createdAt}`);
      console.log('');
    });

    // Check if image column exists by trying to select it
    console.log('✅ Database connection successful');
    console.log('✅ Insight table accessible');
    console.log('✅ Image column appears to exist');

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

checkDatabase();

/**
 * Migration script to export existing static page content
 * This script helps identify content that can be migrated to Builder.io
 * 
 * Usage: tsx scripts/migrate-to-builder.ts
 */

import fs from 'fs';
import path from 'path';

const STATIC_PAGES = [
  {
    id: 'start-here',
    route: '/start-here',
    file: 'src/app/start-here/default-content.ts',
  },
  // Add more pages as needed
];

interface PageContent {
  id: string;
  route: string;
  content: any;
}

function extractPageContent(page: typeof STATIC_PAGES[0]): PageContent | null {
  try {
    const filePath = path.join(process.cwd(), page.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${page.file}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract exported content (simplified - in practice you'd parse the TypeScript)
    return {
      id: page.id,
      route: page.route,
      content: {
        note: 'Content extracted from ' + page.file,
        // In a real implementation, you'd parse the TypeScript exports
        // and convert them to Builder.io format
      },
    };
  } catch (error) {
    console.error(`Error extracting content from ${page.file}:`, error);
    return null;
  }
}

function generateMigrationReport() {
  console.log('📋 Builder.io Migration Report\n');
  console.log('=' .repeat(50));
  
  const pages: PageContent[] = [];
  
  for (const page of STATIC_PAGES) {
    const content = extractPageContent(page);
    if (content) {
      pages.push(content);
      console.log(`✅ ${page.id} - ${page.route}`);
    } else {
      console.log(`❌ ${page.id} - ${page.route} (failed to extract)`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\nTotal pages: ${pages.length}`);
  console.log('\n📝 Next Steps:');
  console.log('1. Sign up for Builder.io at https://builder.io');
  console.log('2. Get your API key from the dashboard');
  console.log('3. Add NEXT_PUBLIC_BUILDER_API_KEY to .env.local');
  console.log('4. Manually recreate pages in Builder.io using the content above');
  console.log('5. Or use Builder.io API to import content programmatically');
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'builder-migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(pages, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

if (require.main === module) {
  generateMigrationReport();
}

export { generateMigrationReport };


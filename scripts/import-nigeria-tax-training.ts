/**
 * Import Nigeria Tax Training Document
 * Splits nigeria_tax_training.md into 9 logical modules and imports them into the system
 * 
 * Run: npx tsx scripts/import-nigeria-tax-training.ts
 * 
 * Prerequisites:
 * - Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local
 * - Set DATABASE_URL and OPENROUTER_API_KEY if you want KB sync
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getFirebaseAdmin } from '../src/lib/firebase-server';
import { addArticle, setArticleActive } from '../src/lib/knowledge-base';

// Define the 9 modules with their part ranges and metadata
const MODULE_DEFINITIONS = [
  {
    title: '2025 Tax Reform Overview & Corporate Income Tax',
    summary: 'Comprehensive overview of the four transformative tax reform bills signed in June 2025, including the Nigeria Tax Act, Tax Administration Act, Revenue Service Act, and Joint Revenue Board Act. Covers corporate income tax rates, small company exemptions, Development Levy, and international tax provisions.',
    parts: [1, 2], // Executive Summary + CIT
    tags: ['2025 Tax Reform', 'Corporate Income Tax', 'CIT', 'Development Levy', 'Small Companies', 'NTA', 'NTAA'],
    dates: 'January 1, 2026',
    effectiveDate: '2026-01-01',
  },
  {
    title: 'Personal Income Tax & Progressive Tax Structure',
    summary: 'Complete guide to the new progressive personal income tax structure effective January 2026. Covers tax bands from 0% to 25%, resident vs non-resident taxation, rent relief, and PAYE compliance requirements.',
    parts: [2], // PIT only
    tags: ['Personal Income Tax', 'PIT', 'Tax Bands', 'Progressive Tax', 'Rent Relief', 'PAYE', 'Resident Taxation'],
    dates: 'January 1, 2026',
    effectiveDate: '2026-01-01',
  },
  {
    title: 'Value Added Tax (VAT) & Capital Gains Tax',
    summary: 'Detailed coverage of VAT rates, zero-rated goods and services, input VAT recovery, VAT fiscalization, and e-invoicing. Also covers Capital Gains Tax rates for companies and individuals, computation methods, and exemptions.',
    parts: [3, 4], // VAT + CGT
    tags: ['VAT', 'Value Added Tax', 'Capital Gains Tax', 'CGT', 'Zero-Rated', 'Input VAT', 'Fiscalization', 'E-Invoicing'],
    dates: 'January 1, 2026',
    effectiveDate: '2026-01-01',
  },
  {
    title: 'Partnership Taxation & Withholding Tax',
    summary: 'Understanding partnership income taxation, registration requirements, profit determination, and withholding tax regulations. Covers common WHT rates, administration, and compliance procedures.',
    parts: [5, 6], // Partnership + WHT
    tags: ['Partnership', 'Withholding Tax', 'WHT', 'Partnership Registration', 'Profit Determination'],
    dates: 'January 2025 - January 2026',
    effectiveDate: '2025-01-01',
  },
  {
    title: 'Tax Administration & Digital Compliance',
    summary: 'Comprehensive guide to the Nigeria Revenue Service (NRS), Joint Revenue Board, Tax Ombuds Office, and mandatory digital tax administration. Covers e-filing, VAT fiscalization, e-invoicing, National Single Window, and transfer pricing.',
    parts: [7], // Tax Administration
    tags: ['Tax Administration', 'NRS', 'FIRS', 'Joint Revenue Board', 'E-Filing', 'Digital Compliance', 'Transfer Pricing', 'BEPS'],
    dates: 'January 2026',
    effectiveDate: '2026-01-01',
  },
  {
    title: 'Nigeria-France Tax Partnership & International Cooperation',
    summary: 'In-depth analysis of the December 2025 Memorandum of Understanding between Nigeria and France. Covers digital transformation, compliance management, taxpayer services, data protection, and implementation timeline.',
    parts: [8], // Nigeria-France Partnership
    tags: ['Nigeria-France Partnership', 'DGFiP', 'International Cooperation', 'Digital Transformation', 'Capacity Building', 'Data Protection'],
    dates: 'December 2025 - Ongoing',
    effectiveDate: '2025-12-10',
  },
  {
    title: 'Tax Incentives, Exemptions & Compliance Procedures',
    summary: 'Complete guide to tax incentives including Pioneer Status, Free Trade Zone benefits, small company exemptions, tax registration, filing returns, payment methods, record keeping, and penalties.',
    parts: [9, 10], // Incentives + Compliance Procedures
    tags: ['Tax Incentives', 'Pioneer Status', 'Free Trade Zone', 'Tax Registration', 'E-Filing', 'Record Keeping', 'Penalties'],
    dates: 'January 2026',
    effectiveDate: '2026-01-01',
  },
  {
    title: 'Taxpayer Rights, Appeals & Sector-Specific Provisions',
    summary: 'Understanding taxpayer rights, appeal processes through Tax Appeal Tribunal, tax clearance certificates, and sector-specific tax provisions for oil & gas, real estate, technology, and financial services.',
    parts: [11, 12], // Taxpayer Rights + Sector-Specific
    tags: ['Taxpayer Rights', 'Appeals', 'Tax Appeal Tribunal', 'Tax Clearance', 'Oil & Gas', 'Real Estate', 'Technology', 'Financial Services'],
    dates: 'January 2026',
    effectiveDate: '2026-01-01',
  },
  {
    title: 'International Tax, Audit, Planning & Implementation Guide',
    summary: 'Comprehensive coverage of double taxation treaties, permanent establishment, thin capitalization, tax audit processes, investigation powers, legitimate tax planning, GAAR, FAQs, implementation checklists, and useful resources.',
    parts: [13, 14, 15, 16, 17, 18, 19, 20], // International + Audit + Planning + FAQs + Implementation
    tags: ['International Tax', 'Double Taxation', 'Permanent Establishment', 'Tax Audit', 'Tax Planning', 'GAAR', 'FAQs', 'Implementation'],
    dates: 'January 2026',
    effectiveDate: '2026-01-01',
  },
];

function extractPartContent(markdown: string, partNumber: number): string {
  // Find the part header
  const partHeader = new RegExp(`## PART ${partNumber}:`, 'i');
  const nextPartHeader = new RegExp(`## PART ${partNumber + 1}:`, 'i');
  
  const startMatch = markdown.match(partHeader);
  if (!startMatch) return '';
  
  const startIdx = startMatch.index!;
  const endMatch = markdown.slice(startIdx).match(nextPartHeader);
  const endIdx = endMatch ? startIdx + endMatch.index! : markdown.length;
  
  return markdown.slice(startIdx, endIdx).trim();
}

function extractTopicsFromPart(content: string): string[] {
  const topics: string[] = [];
  
  // Extract section headers (### 1.1, ### 2.1, etc.)
  const sectionRegex = /### \d+\.\d+\s+(.+?)$/gm;
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const title = match[1].trim();
    if (title && title.length > 5 && title.length < 100) {
      topics.push(title);
    }
  }
  
  // Also extract major subsections (####)
  const subsectionRegex = /#### (.+?)$/gm;
  while ((match = subsectionRegex.exec(content)) !== null) {
    const title = match[1].trim();
    if (title && title.length > 5 && title.length < 100 && !topics.includes(title)) {
      topics.push(title);
    }
  }
  
  // If we don't have enough topics, extract from bullet points or numbered lists
  if (topics.length < 5) {
    const listRegex = /^[-*]\s+(.+?)$/gm;
    while ((match = listRegex.exec(content)) !== null && topics.length < 18) {
      const title = match[1].trim();
      if (title && title.length > 10 && title.length < 80) {
        topics.push(title);
      }
    }
  }
  
  // Ensure we have at least 5 topics
  if (topics.length < 5) {
    // Split by major sections and create topics
    const sections = content.split(/\n### /);
    for (const section of sections.slice(1, 10)) {
      const firstLine = section.split('\n')[0]?.trim();
      if (firstLine && firstLine.length > 10 && topics.length < 18) {
        topics.push(firstLine);
      }
    }
  }
  
  return topics.slice(0, 18); // Max 18 topics
}

async function importModules() {
  console.log('📚 Starting Nigeria Tax Training import...\n');
  
  // Read the markdown file
  const filePath = join(process.cwd(), 'nigeria_tax_training.md');
  let markdown: string;
  try {
    markdown = readFileSync(filePath, 'utf-8');
    console.log(`✅ Loaded markdown file (${markdown.length} characters)\n`);
  } catch (error) {
    console.error('❌ Failed to read nigeria_tax_training.md:', error);
    process.exit(1);
  }
  
  // Process each module definition
  for (let i = 0; i < MODULE_DEFINITIONS.length; i++) {
    const def = MODULE_DEFINITIONS[i];
    console.log(`\n📦 Processing Module ${i + 1}/9: ${def.title}`);
    
    // Extract content from all parts
    let combinedContent = '';
    for (const partNum of def.parts) {
      const partContent = extractPartContent(markdown, partNum);
      if (partContent) {
        combinedContent += partContent + '\n\n';
      }
    }
    
    if (!combinedContent.trim()) {
      console.warn(`⚠️  No content found for parts ${def.parts.join(', ')}`);
      continue;
    }
    
    // Extract topics from the combined content
    const topics = extractTopicsFromPart(combinedContent);
    
    if (topics.length < 5) {
      console.warn(`⚠️  Only found ${topics.length} topics, generating fallback topics...`);
      // Generate fallback topics based on part numbers
      for (let j = 0; j < def.parts.length && topics.length < 10; j++) {
        topics.push(`Part ${def.parts[j]} Overview`);
        topics.push(`Part ${def.parts[j]} Key Concepts`);
        topics.push(`Part ${def.parts[j]} Practical Applications`);
      }
    }
    
    console.log(`   Found ${topics.length} topics`);
    
    // Create the module directly in Firestore
    try {
      const { db } = getFirebaseAdmin();
      if (!db) {
        throw new Error('Firestore not initialized. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local');
      }
      
      const moduleData = {
        title: def.title,
        summary: def.summary,
        tags: def.tags,
        jurisdiction: 'Nigeria',
        effectiveDate: def.effectiveDate,
        dates: def.dates,
        status: 'Published' as const, // IMPORTANT: Published so it appears in Academy
        content: topics,
        createdAt: new Date(),
      };
      
      const docRef = await db.collection('trainingModules').add(moduleData);
      console.log(`   ✅ Created module: ${docRef.id}`);
      
      // Sync to Knowledge Base (if KB is configured)
      try {
        const kbPayload = {
          title: `Academy Module: ${def.title}`,
          content: [
            `# ${def.title}`,
            ``,
            `## Module metadata`,
            `- Dates: ${def.dates}`,
            `- Status: Published`,
            `- Jurisdiction: Nigeria`,
            `- Effective date: ${def.effectiveDate}`,
            `- Source: TaxCode Academy`,
            ``,
            `## Summary`,
            def.summary,
            ``,
            `## Course outline`,
            ...topics.map((t, idx) => `${idx + 1}. ${t}`),
          ].join('\n'),
          summary: def.summary,
          category: 'Academy',
          tags: Array.from(new Set(['academy', 'training', ...def.tags.map(t => t.toLowerCase())])),
          source: 'TaxCode Academy',
          sourceUrl: `/academy/modules/${docRef.id}`,
          author: 'TaxCode CMS',
        };
        
        const kbArticle = await addArticle(kbPayload);
        await db.collection('trainingModules').doc(docRef.id).update({
          kbArticleId: kbArticle.id,
          kbSyncedAt: new Date(),
        });
        console.log(`   ✅ Synced to KB: ${kbArticle.id}`);
      } catch (kbError: any) {
        console.warn(`   ⚠️  KB sync failed (non-fatal): ${kbError.message}`);
      }
    } catch (error: any) {
      console.error(`   ❌ Error creating module: ${error.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n✅ Import complete!');
  console.log('📝 Next steps:');
  console.log('   1. Go to /dashboard/modules to review all modules');
  console.log('   2. Edit any module to refine topics/summaries');
  console.log('   3. Modules are already Published and visible in /academy');
  console.log('   4. Each module is synced to AI Knowledge Base automatically\n');
}

// Run if called directly
if (require.main === module) {
  importModules()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { importModules };


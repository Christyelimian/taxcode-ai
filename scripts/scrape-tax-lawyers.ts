import 'dotenv/config';
import { getFirebaseAdmin } from '../src/lib/firebase-server';

import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

interface ScrapedLawyer {
  name: string;
  firmName?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  practiceAreas?: string[];
  barNumber?: string;
  bio?: string;
}

// Sources to scrape (Nigerian legal directories and law firm websites)
const SCRAPE_SOURCES = [
  {
    name: "Nigerian Bar Association Directory",
    url: "https://nigerianbar.org.ng/members-directory",
    type: "directory"
  },
  {
    name: "Law Firms Directory",
    url: "https://www.lawpavilion.com/directory",
    type: "directory"
  },
  // Add more sources as needed
];

// Keywords to identify tax lawyers
const TAX_KEYWORDS = [
  "tax", "FIRS", "TAT", "tax appeal", "tax litigation", "tax dispute",
  "tax compliance", "tax planning", "VAT", "withholding tax", "corporate tax",
  "tax fraud", "tax evasion", "tax investigation", "tax audit"
];

async function scrapeNigerianBarAssociation(): Promise<ScrapedLawyer[]> {
  const lawyers: ScrapedLawyer[] = [];
  
  try {
    // Note: This is a placeholder - NBA website structure may vary
    // You'll need to inspect the actual website and adjust selectors
    console.log("Scraping Nigerian Bar Association...");
    
    // Example structure (adjust based on actual website):
    // const response = await fetch(SCRAPE_SOURCES[0].url);
    // const html = await response.text();
    // const $ = cheerio.load(html);
    // 
    // $('.lawyer-card').each((i, elem) => {
    //   const name = $(elem).find('.name').text().trim();
    //   const firm = $(elem).find('.firm').text().trim();
    //   // ... extract other fields
    // });
    
    console.log("NBA scraping not implemented - website structure needs inspection");
    return lawyers;
  } catch (error) {
    console.error("Error scraping NBA:", error);
    return lawyers;
  }
}

async function scrapeLawPavilion(): Promise<ScrapedLawyer[]> {
  const lawyers: ScrapedLawyer[] = [];
  
  try {
    console.log("Scraping Law Pavilion...");
    // Similar structure - inspect website and implement
    return lawyers;
  } catch (error) {
    console.error("Error scraping Law Pavilion:", error);
    return lawyers;
  }
}

// Search Google for tax lawyers in Nigeria
async function searchGoogleForTaxLawyers(): Promise<ScrapedLawyer[]> {
  const lawyers: ScrapedLawyer[] = [];
  
  try {
    console.log("Searching Google for tax lawyers...");
    
    // Google Custom Search API or web scraping
    // Note: Requires Google Custom Search API key or use Puppeteer for scraping
    
    const searchQueries = [
      "tax lawyer Nigeria",
      "FIRS lawyer Lagos",
      "TAT appeal lawyer Nigeria",
      "tax litigation lawyer Abuja",
      "tax dispute lawyer Nigeria"
    ];
    
    for (const query of searchQueries) {
      // Implement Google search scraping
      // This would use Puppeteer or Google Custom Search API
      console.log(`Would search: ${query}`);
    }
    
    return lawyers;
  } catch (error) {
    console.error("Error searching Google:", error);
    return lawyers;
  }
}

// Scrape individual law firm websites
async function scrapeLawFirmWebsite(url: string): Promise<ScrapedLawyer[]> {
  const lawyers: ScrapedLawyer[] = [];

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try multiple selectors for lawyer profiles
    const selectors = [
      '.lawyer-profile',
      '.partner',
      '.associate',
      '.attorney',
      '.team-member',
      '.people-item',
      '.staff-member',
      '[class*="lawyer"]',
      '[class*="partner"]',
      '[class*="associate"]'
    ];

    let foundLawyers = 0;

    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const name = $(elem).find('h3, h4, .name, .title').first().text().trim() ||
                    $(elem).find('a').first().text().trim();

        const bio = $(elem).find('.bio, .description, .summary, p').text().trim();

        // Check if this person has tax-related practice
        const hasTaxPractice = TAX_KEYWORDS.some(keyword =>
          bio.toLowerCase().includes(keyword.toLowerCase()) ||
          name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (hasTaxPractice && name && name.length > 3) {
          const email = $(elem).find('a[href^="mailto:"]').attr('href')?.replace('mailto:', '') ||
                       $(elem).find('.email').text().trim();

          const phone = $(elem).find('a[href^="tel:"]').attr('href')?.replace('tel:', '') ||
                       $(elem).find('.phone, .tel').text().trim();

          const location = $(elem).find('.location, .address, .city').text().trim();

          lawyers.push({
            name,
            firmName: $('h1, .firm-name, .company-name').first().text().trim() || undefined,
            email,
            phone,
            website: url,
            location,
            bio: bio.substring(0, 500),
            practiceAreas: extractPracticeAreas(bio),
          });

          foundLawyers++;
        }
      });

      // If we found lawyers with this selector, break
      if (foundLawyers > 0) break;
    }

    console.log(`   Scraping ${url} - found ${foundLawyers} potential tax lawyers`);
    return lawyers;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return lawyers;
  }
}

function extractPracticeAreas(bio: string): string[] {
  const areas: string[] = [];
  const practiceAreaMap: Record<string, string> = {
    "tax litigation": "Tax Litigation",
    "tax appeal": "Tax Appeal Tribunal",
    "firs": "FIRS Disputes",
    "tat": "Tax Appeal Tribunal",
    "tax planning": "Tax Planning",
    "tax compliance": "Tax Compliance",
    "vat": "VAT Disputes",
    "withholding tax": "Withholding Tax",
    "corporate tax": "Corporate Tax",
    "tax fraud": "Tax Fraud Defense",
  };
  
  const lowerBio = bio.toLowerCase();
  for (const [keyword, area] of Object.entries(practiceAreaMap)) {
    if (lowerBio.includes(keyword)) {
      areas.push(area);
    }
  }
  
  return [...new Set(areas)]; // Remove duplicates
}

// Known law firms with tax practices (manual list)
const KNOWN_TAX_LAW_FIRMS = [
  {
    name: "Aluko & Oyebode",
    website: "https://www.aluko-oyebode.com",
    lawyers: [] // Will be scraped
  },
  {
    name: "Banwo & Ighodalo",
    website: "https://www.banwo-ighodalo.com",
    lawyers: []
  },
  {
    name: "G. Elias & Co",
    website: "https://www.gelias.com",
    lawyers: []
  },
  // Add more known firms
];

async function scrapeKnownFirms(): Promise<ScrapedLawyer[]> {
  const allLawyers: ScrapedLawyer[] = [];
  
  for (const firm of KNOWN_TAX_LAW_FIRMS) {
    try {
      console.log(`Scraping ${firm.name}...`);
      const lawyers = await scrapeLawFirmWebsite(firm.website);
      lawyers.forEach(l => {
        l.firmName = firm.name;
      });
      allLawyers.push(...lawyers);
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error scraping ${firm.name}:`, error);
    }
  }
  
  return allLawyers;
}

// LinkedIn scraping (requires authentication)
async function scrapeLinkedIn(): Promise<ScrapedLawyer[]> {
  const lawyers: ScrapedLawyer[] = [];
  
  try {
    console.log("LinkedIn scraping requires authentication and API access");
    // Would use LinkedIn API or Puppeteer with login
    return lawyers;
  } catch (error) {
    console.error("Error scraping LinkedIn:", error);
    return lawyers;
  }
}

// Main scraping function
async function scrapeAllSources(): Promise<ScrapedLawyer[]> {
  console.log("🚀 Starting tax lawyer web scraping...\n");
  
  const allLawyers: ScrapedLawyer[] = [];
  
  // 1. Scrape known law firms
  console.log("1. Scraping known law firms...");
  const firmLawyers = await scrapeKnownFirms();
  allLawyers.push(...firmLawyers);
  console.log(`   Found ${firmLawyers.length} lawyers from known firms\n`);
  
  // 2. Scrape NBA directory
  console.log("2. Scraping Nigerian Bar Association...");
  const nbaLawyers = await scrapeNigerianBarAssociation();
  allLawyers.push(...nbaLawyers);
  console.log(`   Found ${nbaLawyers.length} lawyers from NBA\n`);
  
  // 3. Google search
  console.log("3. Searching Google...");
  const googleLawyers = await searchGoogleForTaxLawyers();
  allLawyers.push(...googleLawyers);
  console.log(`   Found ${googleLawyers.length} lawyers from Google\n`);
  
  // Deduplicate by name + email
  const uniqueLawyers = deduplicateLawyers(allLawyers);
  
  console.log(`✅ Total unique lawyers found: ${uniqueLawyers.length}\n`);
  
  return uniqueLawyers;
}

function deduplicateLawyers(lawyers: ScrapedLawyer[]): ScrapedLawyer[] {
  const seen = new Set<string>();
  const unique: ScrapedLawyer[] = [];
  
  for (const lawyer of lawyers) {
    const key = `${lawyer.name.toLowerCase()}-${lawyer.email?.toLowerCase() || ''}`;
    if (!seen.has(key) && lawyer.name) {
      seen.add(key);
      unique.push(lawyer);
    }
  }
  
  return unique;
}

// Save to Firebase
async function saveToFirebase(lawyers: ScrapedLawyer[]) {
  const { db } = getFirebaseAdmin();
  if (!db) {
    throw new Error("Firestore is not initialized");
  }
  
  console.log(`\n💾 Saving ${lawyers.length} lawyers to Firebase...\n`);
  
  let batch = db.batch();
  let count = 0;
  const batchSize = 500;
  
  for (const lawyer of lawyers) {
    const docRef = db.collection('teamMembers').doc();
    
    // Generate email if not provided
    const email = lawyer.email || `${lawyer.name.toLowerCase().replace(/\s+/g, '.')}@lawyer.taxcode.local`;
    
    const lawyerData = {
      name: lawyer.name,
      email: email,
      title: "Tax Lawyer",
      role: "Tax Consultant" as const, // Reuse role field
      image: "",
      isLawyer: true,
      isConsultant: false,
      firmName: lawyer.firmName,
      city: extractCity(lawyer.location),
      state: extractState(lawyer.location),
      country: "Nigeria",
      barNumber: lawyer.barNumber,
      barAssociation: "Nigerian Bar Association",
      practiceAreas: lawyer.practiceAreas || ["Tax Litigation", "FIRS Disputes"],
      jurisdictions: extractJurisdictions(lawyer.location),
      languages: ["English"],
      yearsExperience: 5, // Default, update manually
      consultationFeeNGN: 50000, // Default
      hourlyRateNGN: 75000, // Default
      fairPricingPledge: true,
      proBono: false,
      bookingModes: ["Call", "Video", "In-person"],
      responseSlaHours: 24,
      rating: 4.5,
      reviewCount: 0,
      verified: false, // Needs manual verification
      phone: lawyer.phone || "",
      website: lawyer.website,
      bio: lawyer.bio || "",
      claimed: false,
      paymentStatus: "free" as const,
      courtExperience: {
        highCourt: true, // Default, update manually
        appealCourt: false,
        supremeCourt: false,
        taxAppealTribunal: lawyer.practiceAreas?.some(pa => pa.includes("TAT")) || false,
      },
      emergencyAvailable: false,
      createdAt: new Date(),
    };
    
    batch.set(docRef, lawyerData);
    count++;
    
    if (count % batchSize === 0) {
      await batch.commit();
      console.log(`   Saved ${count} lawyers...`);
      batch = db.batch(); // Create new batch
    }
  }
  
  if (count % batchSize !== 0) {
    await batch.commit();
  }
  
  console.log(`\n✅ Successfully saved ${count} lawyers to Firebase`);
}

function extractCity(location?: string): string {
  if (!location) return "";
  // Try to extract city from location string
  const cities = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Kaduna"];
  for (const city of cities) {
    if (location.includes(city)) return city;
  }
  return "";
}

function extractState(location?: string): string {
  if (!location) return "";
  const states = [
    "Lagos", "Abuja", "Rivers", "Kano", "Oyo", "Enugu", "Kaduna",
    "Delta", "Ogun", "Anambra", "Imo", "Plateau"
  ];
  for (const state of states) {
    if (location.includes(state)) return state;
  }
  return "";
}

function extractJurisdictions(location?: string): string[] {
  const jurisdictions: string[] = [];
  if (!location) return jurisdictions;
  
  if (location.includes("Lagos")) jurisdictions.push("Lagos");
  if (location.includes("Abuja") || location.includes("FCT")) jurisdictions.push("Abuja", "Federal");
  if (location.includes("Federal")) jurisdictions.push("Federal");
  
  return [...new Set(jurisdictions)];
}

// Main execution
async function main() {
  try {
    console.log("=".repeat(60));
    console.log("TAX LAWYER WEB SCRAPER");
    console.log("=".repeat(60));
    console.log();
    
    // Scrape all sources
    const lawyers = await scrapeAllSources();
    
    if (lawyers.length === 0) {
      console.log("⚠️  No lawyers found. This script needs to be configured with actual website structures.");
      console.log("    Update the scraping functions based on target website HTML structure.");
      return;
    }
    
    // Save to Firebase
    await saveToFirebase(lawyers);
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Scraping complete!");
    console.log("=".repeat(60));
    console.log("\nNext steps:");
    console.log("1. Review lawyers in admin dashboard");
    console.log("2. Verify bar numbers and credentials");
    console.log("3. Update missing information");
    console.log("4. Generate claim tokens for lawyers");
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { scrapeAllSources, saveToFirebase };

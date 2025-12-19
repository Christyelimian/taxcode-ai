import 'dotenv/config';
import { readFileSync } from "fs";
import { join } from "path";
import { getFirebaseAdmin } from "../src/lib/firebase-server";

interface ConsultantRow {
  licenseNo?: string;
  memberNo?: string;
  surname: string;
  otherNames: string;
  firmName?: string;
  firmAddress?: string;
  city?: string;
  state?: string;
}

function parseConsultantList(content: string): ConsultantRow[] {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const consultants: ConsultantRow[] = [];
  
  // Skip header lines until we find data
  let i = 0;
  while (i < lines.length && !lines[i].match(/^PL \d+/)) {
    i++;
  }
  
  // Parse rows - format appears to be: PL number, member number, surname, other names, firm name, address, city, state
  while (i < lines.length) {
    const licenseNo = lines[i]?.match(/^PL \d+/)?.[0];
    if (!licenseNo) {
      i++;
      continue;
    }
    
    const memberNo = lines[i + 1];
    const surname = lines[i + 2];
    const otherNames = lines[i + 3];
    const firmName = lines[i + 4];
    const firmAddress = lines[i + 5];
    const city = lines[i + 6];
    const state = lines[i + 7];
    
    if (surname && otherNames) {
      consultants.push({
        licenseNo,
        memberNo,
        surname,
        otherNames,
        firmName,
        firmAddress,
        city,
        state,
      });
    }
    
    i += 8; // Move to next consultant
  }
  
  return consultants;
}

async function importConsultants() {
  const filePath = join(process.cwd(), "tax_consultant_list.md");
  const content = readFileSync(filePath, "utf-8");
  const consultants = parseConsultantList(content);
  
  console.log(`Found ${consultants.length} consultants to import`);
  
  const { db } = getFirebaseAdmin();
  if (!db) {
    throw new Error("Firestore not initialized");
  }
  
  let count = 0;
  const batchSize = 500;
  let batch = db.batch();
  
  for (const consultant of consultants) {
    const fullName = `${consultant.surname} ${consultant.otherNames}`.trim();
    const email = `${consultant.surname.toLowerCase()}.${consultant.otherNames.toLowerCase().split(" ")[0]}@consultant.taxcode.local`.replace(/\s+/g, "");
    
    // Infer specialties and industries from firm name and location
    const specialties: string[] = [];
    const industries: string[] = [];
    
    // Common tax specialties based on firm name patterns
    const firmNameLower = (consultant.firmName || "").toLowerCase();
    if (firmNameLower.includes("audit") || firmNameLower.includes("assurance")) {
      specialties.push("Audit & Assurance");
    }
    if (firmNameLower.includes("tax") || firmNameLower.includes("consult")) {
      specialties.push("Tax Compliance", "Tax Planning");
    }
    if (firmNameLower.includes("legal") || firmNameLower.includes("law")) {
      specialties.push("Tax Disputes", "Tax Litigation");
    }
    if (firmNameLower.includes("accounting") || firmNameLower.includes("account")) {
      specialties.push("Accounting", "Bookkeeping");
    }
    
    // Default specialties if none found
    if (specialties.length === 0) {
      specialties.push("Tax Compliance", "Tax Planning", "General Tax Services");
    }
    
    // Infer industries from location (state/city)
    if (consultant.state) {
      const stateLower = consultant.state.toLowerCase();
      if (stateLower.includes("lagos") || stateLower.includes("abuja")) {
        industries.push("Corporate", "Professional Services", "E-commerce");
      }
      if (stateLower.includes("rivers") || stateLower.includes("delta")) {
        industries.push("Oil & Gas", "Energy");
      }
      industries.push("General Business");
    } else {
      industries.push("General Business");
    }
    
    // Create consultant document in teamMembers collection with consultant role
    const docRef = db.collection("teamMembers").doc();
    const consultantData = {
      name: fullName,
      email,
      title: consultant.firmName || "Tax Consultant",
      role: "Tax Consultant" as const,
      image: "",
      createdAt: new Date(),
      // Consultant-specific fields
      licenseNo: consultant.licenseNo,
      memberNo: consultant.memberNo,
      firmName: consultant.firmName,
      firmAddress: consultant.firmAddress,
      city: consultant.city,
      state: consultant.state,
      country: "Nigeria",
      verified: true,
      isConsultant: true,
      // Enhanced fields
      specialties,
      industries,
      yearsExperience: 5, // Default, can be updated manually
      languages: ["English"], // Default, can be updated
      consultationFeeNGN: 25000, // Default, can be updated
      fairPricingPledge: true,
      proBono: false, // Default, can be updated
      bookingModes: ["Call", "Video", "In-person"],
      responseSlaHours: 24,
      rating: 4.5, // Default
      reviewCount: 0,
    };
    
    batch.set(docRef, consultantData);
    count++;
    
    if (count % batchSize === 0) {
      await batch.commit();
      console.log(`Imported ${count} consultants...`);
      batch = db.batch(); // Create new batch
    }
  }
  
  if (count % batchSize !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Successfully imported ${count} consultants`);
}

importConsultants().catch(console.error);

# Import Nigeria Tax Training Document

This script automatically splits `nigeria_tax_training.md` into 9 logical training modules and imports them into the TaxCode system.

## Prerequisites

1. **Environment Variables** (in `.env.local`):
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # Optional (for KB sync):
   DATABASE_URL=your-postgres-connection-string
   OPENROUTER_API_KEY=your-openrouter-key
   ```

2. **File Location**: Ensure `nigeria_tax_training.md` is in the project root directory.

## How to Run

```bash
npx tsx scripts/import-nigeria-tax-training.ts
```

## What It Does

1. **Reads** `nigeria_tax_training.md` from the project root
2. **Splits** it into 9 modules based on document parts:
   - Module 1: 2025 Tax Reform Overview & Corporate Income Tax (Parts 1-2)
   - Module 2: Personal Income Tax & Progressive Tax Structure (Part 2)
   - Module 3: VAT & Capital Gains Tax (Parts 3-4)
   - Module 4: Partnership Taxation & Withholding Tax (Parts 5-6)
   - Module 5: Tax Administration & Digital Compliance (Part 7)
   - Module 6: Nigeria-France Tax Partnership (Part 8)
   - Module 7: Tax Incentives & Compliance Procedures (Parts 9-10)
   - Module 8: Taxpayer Rights & Sector-Specific Provisions (Parts 11-12)
   - Module 9: International Tax, Audit & Planning (Parts 13-20)

3. **Creates** each module in Firestore with:
   - Title, summary, tags, jurisdiction, effective date
   - Extracted topics (8-18 per module)
   - Status: **Published** (so they appear in `/academy`)

4. **Syncs** each module to AI Knowledge Base (if KB is configured)

## After Import

1. **View modules**: Go to `/dashboard/modules` to see all 9 modules
2. **Edit modules**: Click "Edit" on any module to refine topics/summaries
3. **View in Academy**: Go to `/academy` - modules are already published and visible
4. **AI Knowledge Base**: Each module is automatically synced and searchable

## Making Changes Later

To edit/amend modules after import:

1. Go to `/dashboard/modules`
2. Find the module → Click "⋮" → "Edit"
3. Modify title, summary, topics, tags, dates, etc.
4. Save → Changes sync to Firestore + AI Knowledge Base automatically

## Troubleshooting

- **"Firestore not initialized"**: Check your Firebase env vars in `.env.local`
- **"KB sync failed"**: This is non-fatal - modules are created, just not synced to KB
- **"No content found"**: Check that `nigeria_tax_training.md` exists in project root
- **"Only found X topics"**: Script will generate fallback topics automatically






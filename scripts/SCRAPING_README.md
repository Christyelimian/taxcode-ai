# Tax Lawyer Web Scraping Script

## Overview
This script scrapes the web for tax lawyers in Nigeria and imports them into the TaxCode directory.

## Setup

### 1. Install Dependencies
```bash
npm install cheerio node-fetch @types/cheerio @types/node-fetch
```

### 2. Configure Environment
Ensure your `.env` file has:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### 3. Run the Script
```bash
npm run scrape:lawyers
```

## How It Works

### Scraping Sources
1. **Known Law Firms** - Scrapes websites of major Nigerian law firms
2. **Nigerian Bar Association** - Scrapes NBA member directory
3. **Google Search** - Searches for tax lawyers (requires API key or Puppeteer)
4. **Law Firm Websites** - Scrapes individual firm websites

### Data Extracted
- Name
- Firm Name
- Email
- Phone
- Website
- Location (City, State)
- Practice Areas (tax-specific)
- Bio/Description
- Bar Number (if available)

### Tax Keywords Detection
The script identifies tax lawyers by searching for these keywords in bios:
- "tax", "FIRS", "TAT", "tax appeal", "tax litigation"
- "tax dispute", "tax compliance", "tax planning"
- "VAT", "withholding tax", "corporate tax"
- "tax fraud", "tax evasion", "tax investigation"

## Customization

### Add More Law Firms
Edit `KNOWN_TAX_LAW_FIRMS` array in `scrape-tax-lawyers.ts`:
```typescript
const KNOWN_TAX_LAW_FIRMS = [
  {
    name: "Your Firm Name",
    website: "https://firm-website.com",
    lawyers: []
  },
];
```

### Adjust Scraping Selectors
Each website has different HTML structure. Inspect the target website and update selectors:
```typescript
// Example: Update selectors for a specific website
$('.lawyer-card').each((i, elem) => {
  const name = $(elem).find('.name').text().trim();
  // ... adjust selectors based on actual HTML
});
```

### Add Google Custom Search
1. Get Google Custom Search API key
2. Create a Custom Search Engine
3. Update `searchGoogleForTaxLawyers()` function

## Data Quality

### Automatic Processing
- Deduplicates by name + email
- Extracts practice areas from bio
- Infers city/state from location string
- Sets default values for missing fields

### Manual Review Required
After scraping, manually verify:
- ✅ Bar numbers
- ✅ Email addresses
- ✅ Practice areas accuracy
- ✅ Court experience
- ✅ Case outcomes (if available)

## Output

Lawyers are saved to Firebase `teamMembers` collection with:
- `isLawyer: true`
- `verified: false` (requires manual verification)
- `claimed: false` (lawyers can claim later)

## Next Steps After Scraping

1. **Review in Admin Dashboard**
   - Go to `/dashboard/lawyers`
   - Review each lawyer
   - Verify credentials

2. **Update Missing Information**
   - Add bar numbers
   - Verify emails
   - Add case outcomes
   - Update court experience

3. **Generate Claim Tokens**
   - For each lawyer, generate a claim token
   - Send email with claim link

4. **Verify Lawyers**
   - Check bar numbers against NBA database
   - Verify firm information
   - Mark as verified when confirmed

## Legal & Ethical Considerations

⚠️ **Important:**
- Respect robots.txt files
- Don't overload servers (add delays between requests)
- Only scrape publicly available information
- Comply with website terms of service
- Consider reaching out to lawyers directly for permission

## Troubleshooting

### "Cheerio not found"
```bash
npm install cheerio @types/cheerio
```

### "Firestore not initialized"
Check your Firebase environment variables in `.env`

### "No lawyers found"
- Websites may have changed structure
- Update selectors in scraping functions
- Check if websites are accessible
- Verify network connection

### Rate Limiting
If you get blocked:
- Increase delay between requests
- Use proxies (if needed)
- Scrape in smaller batches

## Future Enhancements

- [ ] LinkedIn API integration
- [ ] NBA API integration (if available)
- [ ] Automated bar number verification
- [ ] Image scraping for lawyer photos
- [ ] Social media profile links
- [ ] Case outcome data extraction



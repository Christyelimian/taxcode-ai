/**
 * Knowledge Base Setup and Ingestion Script
 * Run this to initialize the knowledge base with Nigerian tax law articles
 */

import { addArticle, batchEmbedArticles, buildKnowledgeGraph } from '@/lib/knowledge-base';

const TAX_ARTICLES = [
  {
    title: "Nigerian Personal Income Tax Act (PITA) Overview",
    slug: "pita-overview",
    content: `The Personal Income Tax Act (PITA) 2011 is the principal legislation governing personal income taxation in Nigeria. 
    
    Key provisions include:
    1. Consolidated Relief Allowance (CRA) - The higher of ₦200,000 or 1% of gross income, plus 20% of gross income
    2. Tax-exempt income - Includes certain government scholarships, disability allowances, and statutory gratuities
    3. Graduated tax rates applied to taxable income
    4. Deductions for business expenses and capital allowances
    
    The 2026 Tax Reform Act modernizes PITA with digital filing requirements and expanded compliance obligations.`,
    summary: "Overview of Nigeria's principal personal income tax legislation and recent reforms",
    category: "Personal Tax",
    tags: ["PITA", "personal income", "tax rates", "tax relief"],
    source: "FIRS",
    author: "Federal Inland Revenue Service"
  },
  {
    title: "Consolidated Relief Allowance (CRA) - Complete Guide",
    slug: "cra-guide",
    content: `The Consolidated Relief Allowance (CRA) is a tax relief mechanism that reduces taxable income for individual taxpayers.

    How CRA is calculated:
    - Base: The higher of ₦200,000 or 1% of gross income
    - Additional: Plus 20% of gross income
    - Example: For gross income of ₦1,000,000
      - Base = Higher of ₦200,000 or ₦10,000 = ₦200,000
      - Additional = 20% × ₦1,000,000 = ₦200,000
      - Total CRA = ₦400,000
    
    Taxable income = Gross Income - CRA
    
    The CRA replaced the former personal relief, pension contributions relief, and life insurance premium relief under the old regime.`,
    summary: "Detailed explanation of how Consolidated Relief Allowance reduces tax liability",
    category: "Personal Tax",
    tags: ["CRA", "relief allowance", "tax calculation", "deductions"],
    source: "Tax Code Trust"
  },
  {
    title: "Nigerian VAT (Value Added Tax) Rates and Application",
    slug: "vat-rates",
    content: `Value Added Tax (VAT) in Nigeria is a consumption tax imposed at each stage of production/distribution.

    Current VAT Rates:
    - Standard rate: 7.5% (as of 2024, previously 5%)
    - Zero rate: Applied to certain exports and essential items
    - Exempt supplies: Financial services, healthcare, education
    
    VAT Registration:
    - Mandatory for businesses with annual turnover above ₦25 million
    - Voluntary registration available for smaller businesses
    - Digital registration via FIRS portal
    
    VAT Returns:
    - Monthly filing requirement for registered businesses
    - Quarterly filing available for certain small businesses
    - Electronic submission mandatory as of 2026 Tax Reform
    
    Input VAT Recovery:
    - Registered businesses can claim input VAT on business expenses
    - Must maintain proper documentation
    - Ineligible supplies include certain personal and capital items`,
    summary: "Complete guide to VAT rates, registration, and compliance in Nigeria",
    category: "VAT",
    tags: ["VAT", "consumption tax", "rates", "registration"],
    source: "FIRS"
  },
  {
    title: "Corporate Income Tax (CIT) - Business Tax Guide",
    slug: "cit-guide",
    content: `Corporate Income Tax (CIT) is the tax on profits earned by companies registered in Nigeria.

    Key Features:
    - Standard rate: 30% on taxable profits
    - Reduced rate: 20% for small companies (annual turnover < ₦500 million)
    - Pioneer status: Tax exemption for 5 years on eligible businesses
    
    Taxable income calculation:
    - Gross profit minus all deductible business expenses
    - Includes depreciation and capital allowances
    - Less loss carryforwards from previous years (limited to 4 years)
    
    Filing requirements:
    - Annual returns due within 18 months of year-end
    - Quarterly provisional tax payments
    - Electronic filing mandatory as of 2026 Tax Reform
    
    Capital Allowances:
    - Industrial buildings (10% per annum)
    - Plant and machinery (15-20% per annum)
    - Intangible assets (depreciation over useful life)`,
    summary: "Overview of corporate income tax, rates, and capital allowance system",
    category: "Corporate Tax",
    tags: ["CIT", "corporate tax", "business tax", "capital allowances"],
    source: "FIRS"
  },
  {
    title: "Capital Gains Tax in Nigeria",
    slug: "cgt-guide",
    content: `Capital Gains Tax is imposed on gains realized from the disposal of chargeable assets.

    Chargeable Assets:
    - Real property (land and buildings)
    - Securities and shares
    - Goodwill and intangible assets
    - Jewelry, paintings, and collectibles above certain thresholds
    
    Capital Gains Tax Rate: 10% (standard)
    
    Exemptions:
    - Private residences (subject to conditions)
    - Certain government securities
    - Disposals resulting in loss
    
    Calculation:
    - Gain = Sale price - Cost of acquisition - Incidental costs
    - Loss relief can be carried forward indefinitely
    
    Reliefs and Deductions:
    - Costs of acquisition and improvements
    - Legal and professional fees
    - Selling expenses
    
    Reporting:
    - Assessment within 4 years of disposal
    - Payment due within 30 days of assessment
    - Digital reporting as of 2026 Tax Reform`,
    summary: "Comprehensive guide to capital gains tax, rates, and exemptions",
    category: "Capital Gains",
    tags: ["CGT", "capital gains", "asset disposal", "investments"],
    source: "FIRS"
  },
  {
    title: "2026 Tax Reform Act - Key Changes and Requirements",
    slug: "2026-tax-reform",
    content: `The 2026 Tax Reform Act introduces significant changes to Nigeria's tax system:

    Major Changes:
    1. Digital-First Compliance
       - Mandatory e-filing for all taxpayers
       - Real-time tax compliance platform (RTCP)
       - Electronic payment systems
    
    2. Expanded Tax Base
       - Digital services tax on online platforms
       - Excise tax on specific goods
       - Increased VAT scope
    
    3. Enhanced Penalties and Enforcement
       - Automated penalties for late filing
       - Interest on unpaid taxes
       - Stricter sanctions for non-compliance
    
    4. Simplified Tax Administration
       - Taxpayer identification system (TIN) centralization
       - Integrated tax dashboard for individuals and businesses
       - Reduced documentation requirements for certain transactions
    
    5. Tax Incentives
       - Incentives for green investments
       - Support for SME development
       - Incentives for technology and innovation
    
    Implementation Timeline:
    - 2024: System preparation
    - 2025: Pilot phase
    - 2026: Full implementation`,
    summary: "Overview of the 2026 Nigerian Tax Reform Act and its major provisions",
    category: "Tax Reform",
    tags: ["2026 reform", "digital tax", "compliance", "changes"],
    source: "Tax Code Trust"
  }
];

async function seedKnowledgeBase() {
  console.log('🌱 Starting knowledge base seeding...');
  
  try {
    for (const article of TAX_ARTICLES) {
      console.log(`📝 Adding article: ${article.title}`);
      await addArticle({
        title: article.title,
        content: article.content,
        summary: article.summary,
        category: article.category,
        tags: article.tags,
        source: article.source,
        author: article.author,
      });
    }

    console.log('✅ Articles added successfully');

    // Build knowledge graph
    console.log('🔗 Building knowledge graph...');
    await buildKnowledgeGraph();

    console.log('✅ Knowledge base seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding knowledge base:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedKnowledgeBase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedKnowledgeBase };

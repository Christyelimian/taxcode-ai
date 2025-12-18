# Knowledge Base Setup - Quick Start Guide

## Phase 1: Database Preparation (5 minutes)

### Step 1: Enable pgvector on Neon

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project and database
3. Open SQL Editor
4. Run this command:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 2: Configure Environment Variables

Add to your `.env.local`:

```env
OPENAI_API_KEY=sk-...your-key...
DATABASE_URL=postgresql://...your-neon-url...
```

## Phase 2: Prisma Setup (5 minutes)

### Step 1: Create Migration

```bash
npx prisma migrate dev --name init_knowledge_base
```

This will:
- Create all 9 database tables
- Set up pgvector support
- Create indexes for performance

### Step 2: Verify Schema

```bash
npx prisma studio
```

Visit http://localhost:5555 to view your database schema

## Phase 3: Seed Knowledge Base (2 minutes)

### Step 1: Run Seed Script

```bash
npx ts-node scripts/seed-knowledge-base.ts
```

This adds 6 initial articles about Nigerian tax law:
- PITA (Personal Income Tax Act)
- CRA (Consolidated Relief Allowance)
- VAT (Value Added Tax)
- CIT (Corporate Income Tax)
- CGT (Capital Gains Tax)
- 2026 Tax Reform Act

### Step 2: Verify Data

```bash
npx prisma studio
# Check KnowledgeBaseArticle table - should have 6 rows
```

## Phase 3: Test Knowledge Base

### Test 1: Semantic Search

```bash
npx tsx << 'EOF'
import { hybridSearch } from '@/lib/knowledge-base';

const results = await hybridSearch('What is VAT?', 5);
console.log('Search results:', results);
EOF
```

Expected output: Array of articles with similarity scores, highest first

### Test 2: Add New Article

```bash
npx tsx << 'EOF'
import { addArticle } from '@/lib/knowledge-base';

const article = await addArticle({
  title: 'Stamp Duty in Nigeria - Complete Guide',
  content: 'Stamp duty is a tax on documents...',
  summary: 'Overview of stamp duty regulations',
  category: 'Tax Compliance',
  tags: ['stamp duty', 'documents', 'tax'],
  source: 'FIRS',
  author: 'Tax Admin'
});

console.log('Article created:', article.id);
EOF
```

## Phase 4: Access Admin Dashboard

Visit: `http://localhost:3000/dashboard/knowledge-base`

The dashboard provides:
- **Overview Tab**: Article statistics and categories
- **Search Tab**: Test semantic search functionality
- **Add Article Tab**: Create new articles with automatic embedding
- **Analytics Tab**: View performance metrics
- **Tools Tab**: Build knowledge graph, embed articles

## Integration Checklist

- [ ] pgvector enabled on Neon
- [ ] Prisma migrations applied
- [ ] 6 seed articles loaded
- [ ] Semantic search tested
- [ ] Dashboard accessible
- [ ] OpenAI API key configured
- [ ] Tax QA updated to use knowledge base
- [ ] Training data collection enabled

## Common Issues & Solutions

### Issue: "pgvector extension not found"
**Solution**: Run `CREATE EXTENSION IF NOT EXISTS vector;` in Neon SQL editor

### Issue: "OPENAI_API_KEY not found"
**Solution**: Check `.env.local` has the correct key with `sk-` prefix

### Issue: "Prisma schema mismatch"
**Solution**: Run `npx prisma migrate resolve` then apply migrations again

### Issue: "No articles found in search"
**Solution**: Run seed script again: `npx ts-node scripts/seed-knowledge-base.ts`

## Next Steps

1. **Update Tax QA Flow** (`src/ai/flows/tax-qa.ts`)
   - Replace Firebase calls with `hybridSearch()`
   - Add training data logging after AI response
   - Use `saveTrainingData()` function

2. **Add Document Upload**
   - Create file upload endpoint
   - Auto-extract content from PDFs
   - Generate embeddings automatically

3. **Set up Monitoring**
   - Track search accuracy
   - Monitor embedding quality
   - Analyze training data

4. **Fine-tune AI Model**
   - Collect 100+ quality Q&A pairs
   - Use training data to fine-tune Claude
   - Measure improvement in answers

## Useful Commands

```bash
# View database visually
npx prisma studio

# View logs from Neon
npx vercel logs --tail

# Test embeddings
npx tsx scripts/test-embeddings.ts

# Rebuild knowledge graph
npx tsx scripts/rebuild-knowledge-graph.ts

# Export knowledge base
npx tsx scripts/export-kb.ts

# Analyze training data
npx tsx scripts/analyze-training.ts
```

## Cost Analysis (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Neon DB | ₦5K-15K | 5GB free, then paid | 
| OpenAI Embeddings | ₦2K-8K | $0.02 per 1M tokens |
| OpenRouter Claude | Pay-per-use | Only when used |
| **Total** | **₦7K-23K** | Quite affordable |

## Architecture Overview

```
┌─────────────────────────────────────────┐
│       Knowledge Base System             │
├─────────────────────────────────────────┤
│                                         │
│  1. Input Layer                         │
│     ├── Web Form (Add Article)          │
│     ├── PDF Upload                      │
│     └── API Integration                 │
│                                         │
│  2. Processing Layer                    │
│     ├── generateEmbedding()             │
│     └── Tokenization                    │
│                                         │
│  3. Storage Layer (Neon)                │
│     ├── Articles + Embeddings           │
│     ├── Sections + Embeddings           │
│     ├── Related Articles (Graph)        │
│     └── Training Data                   │
│                                         │
│  4. Retrieval Layer                     │
│     ├── Semantic Search (vector)        │
│     ├── Keyword Search (full-text)      │
│     └── Hybrid Search (combined)        │
│                                         │
│  5. AI Layer                            │
│     ├── Claude 3.5 (Puter)              │
│     ├── Context from KB                 │
│     └── RAG Pipeline                    │
│                                         │
│  6. Feedback Layer                      │
│     ├── Rating (1-5 stars)              │
│     ├── Feedback Text                   │
│     └── Training Data Collection        │
│                                         │
└─────────────────────────────────────────┘
```

## Support

For issues or questions:
1. Check logs: `npx vercel logs --tail`
2. Test functions directly in Node
3. Verify database connection: `npx prisma db push`
4. Check OpenAI API status

---

**Last Updated**: 2024
**Status**: Production Ready ✅

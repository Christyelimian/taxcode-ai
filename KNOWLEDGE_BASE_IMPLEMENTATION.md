# Knowledge Base Implementation Guide - Neon + Vector Embeddings + RAG

## Overview

This guide explains how to implement a production-ready knowledge base system with:
- **Neon PostgreSQL** - Serverless database with vector support (pgvector)
- **Vector Embeddings** - OpenAI embeddings for semantic search
- **RAG (Retrieval-Augmented Generation)** - AI training with knowledge base
- **Semantic Search** - Find relevant articles by meaning, not just keywords

## Architecture

```
┌─────────────────────────────────────┐
│      User Question (Dashboard)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Hybrid Search (Semantic + Text)   │
│  (src/lib/knowledge-base.ts)        │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    ┌────────┐   ┌──────────┐
    │Vector  │   │Keyword   │
    │Search  │   │Search    │
    └────┬───┘   └─────┬────┘
         │             │
         └──────┬──────┘
                ▼
    ┌─────────────────────┐
    │  Neon PostgreSQL    │
    │  (pgvector)         │
    │  Knowledge Base     │
    └──────────┬──────────┘
               │
        ┌──────┴──────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌──────────┐
   │Articles │      │Embeddings│
   │ + Meta  │      │ (Vector) │
   └─────────┘      └──────────┘
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install @prisma/client prisma openai pgvector
npm install -D prisma
```

### 2. Set Environment Variables

Add to `.env`:

```env
# Already configured
DATABASE_URL="postgresql://neondb_owner:npg_Sj9m1wUOrEaC@ep-morning-flower-ae6a6czg-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Add OpenAI API key for embeddings
OPENAI_API_KEY="sk-your-api-key-here"
```

### 3. Enable pgvector Extension on Neon

Connect to Neon console and enable pgvector:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Set Up Prisma Schema

The schema is in `prisma/schema.prisma` with:

- **KnowledgeBaseArticle** - Main articles with vector embeddings
- **ArticleSection** - Detailed sections of articles
- **RelatedArticle** - Knowledge graph connections
- **AITrainingData** - Store Q&A interactions for training
- **Documents** - User-uploaded documents
- **VectorSearchCache** - Cache for frequently searched queries

### 5. Run Migrations

```bash
# Create migration
npx prisma migrate dev --name init_knowledge_base

# Push to database
npx prisma db push
```

### 6. Seed Initial Knowledge Base

Run the seeding script to populate with Nigerian tax law articles:

```bash
npx ts-node scripts/seed-knowledge-base.ts
```

This adds 6 base articles covering:
- Personal Income Tax Act (PITA)
- Consolidated Relief Allowance (CRA)
- VAT (Value Added Tax)
- Corporate Income Tax (CIT)
- Capital Gains Tax (CGT)
- 2026 Tax Reform Act

## Core Functions

### Adding Articles

```typescript
import { addArticle } from '@/lib/knowledge-base';

await addArticle({
  title: "Article Title",
  content: "Full article content...",
  summary: "Brief summary",
  category: "Personal Tax",
  tags: ["tag1", "tag2"],
  source: "FIRS",
  author: "Author Name"
});
```

### Semantic Search

```typescript
import { semanticSearch } from '@/lib/knowledge-base';

// Find similar articles by meaning
const results = await semanticSearch(
  "What is the VAT rate?",
  5,  // Return top 5 results
  0.7 // Similarity threshold (0-1)
);

// Returns articles with similarity scores
```

### Hybrid Search (Recommended)

```typescript
import { hybridSearch } from '@/lib/knowledge-base';

// Combines semantic + keyword search for best results
const results = await hybridSearch("VAT rate", 5);

// Results include both semantic matches and keyword matches
```

### Building Knowledge Graph

```typescript
import { buildKnowledgeGraph } from '@/lib/knowledge-base';

// Creates connections between related articles
await buildKnowledgeGraph();

// Automatically links similar articles based on embeddings
```

### Saving Training Data

```typescript
import { saveTrainingData } from '@/lib/knowledge-base';

await saveTrainingData({
  articleId: "article-uuid",
  question: "User's question",
  answer: "AI's answer",
  rating: 5,  // 1-5 stars
  feedback: "Optional feedback"
});
```

## How AI Training Works

### Current Flow

```
User Question
    ↓
Tax Assistant (src/components/tax-assistant.tsx)
    ↓
askTaxLawQuestion() (src/ai/flows/tax-qa.ts)
    ↓
getKnowledge Tool (uses hybridSearch)
    ↓
Neon: Search knowledge base with vectors
    ↓
Claude AI generates answer from retrieved articles
    ↓
saveTrainingData() stores interaction for training
    ↓
User gets answer + source citations
```

### AI Training Loop

1. **User asks question** → System searches knowledge base
2. **Relevant articles retrieved** → AI generates answer
3. **Interaction saved** → Training data collected
4. **Rating/feedback** → System learns which answers help
5. **Knowledge graph updated** → Links similar topics
6. **Model improves** → Better answers over time

## Advanced Features

### 1. Document Upload & Processing

Users can upload tax documents (PDFs, DOCX, etc.) which are:
- Extracted automatically
- Converted to embeddings
- Added to knowledge base
- Indexed for search

### 2. Personalized Knowledge Base

Each user can:
- Save articles (SavedArticle model)
- Create custom knowledge sections
- Track their learning progress
- Get personalized recommendations

### 3. Real-Time Analytics

Track:
- Most viewed articles
- Most helpful articles
- Search trends
- Knowledge gaps
- AI training effectiveness

```typescript
import { getKnowledgeBaseStats } from '@/lib/knowledge-base';

const stats = await getKnowledgeBaseStats();
// Returns: totalArticles, activeArticles, byCategory, mostViewed, mostHelpful
```

### 4. Cache Layer

Vector search results are cached for:
- Faster repeated queries
- Reduced OpenAI API costs
- TTL-based expiration

## API Endpoints (To Be Created)

```
GET  /api/knowledge/search?q=query
POST /api/knowledge/articles
GET  /api/knowledge/articles/:id
POST /api/knowledge/articles/:id/rate
GET  /api/knowledge/related/:id
POST /api/knowledge/documents/upload
GET  /api/knowledge/stats
```

## Performance Optimization

### Vector Search Indexing

On Neon, pgvector supports:

```sql
-- Create index for faster vector search
CREATE INDEX ON "KnowledgeBaseArticle" 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

### Query Batching

For better performance:

```typescript
// Bad: Loop with individual queries
for (const query of queries) {
  await semanticSearch(query);
}

// Good: Batch process
const results = await Promise.all(
  queries.map(q => semanticSearch(q))
);
```

## Monitoring & Maintenance

### Regular Tasks

```typescript
// Weekly: Update knowledge graph
await buildKnowledgeGraph();

// Daily: Analyze training data
const trainingData = await getTrainingData({ minRating: 4 });

// Monthly: Review knowledge base coverage
const stats = await getKnowledgeBaseStats();
```

### Quality Metrics

Track:
- Average helpfulness rating
- Search success rate
- AI accuracy
- User satisfaction
- Knowledge gap areas

## Cost Optimization

### Using Neon (PostgreSQL Serverless)
- Pay only for compute used
- Auto-scaling
- No minimum costs
- ₦50,000-150,000/month estimated for production

### Using OpenAI Embeddings
- text-embedding-3-small: $0.02 per 1M tokens
- Estimated: $10-50/month for typical usage
- Cache layer reduces API calls

### Hybrid Approach
- Semantic search: For quality (5-10 queries/request)
- Keyword search: For fallback (free)
- Combined: Best results with minimal cost

## Migration from Firebase

### Current System (Firebase)
- Simple text search in Firestore
- Limited to keyword matching
- No semantic understanding

### New System (Neon + Embeddings)
- Advanced semantic search
- Vector similarity matching
- Knowledge graph relationships
- AI training loop

### Migration Steps
1. Export Firebase knowledge base
2. Transform to Prisma schema
3. Generate embeddings for all articles
4. Import to Neon
5. Build knowledge graph
6. Update tax-qa.ts flow
7. Test hybrid search accuracy

## Testing

### Test Semantic Search

```typescript
import { hybridSearch } from '@/lib/knowledge-base';

async function testSearch() {
  const queries = [
    "What is VAT?",
    "How to calculate tax?",
    "CRA relief allowance",
  ];

  for (const query of queries) {
    const results = await hybridSearch(query);
    console.log(`Query: ${query}`);
    console.log(`Results: ${results.length}`);
    results.forEach(r => console.log(`  - ${r.title}`));
  }
}
```

### Test Training Data

```typescript
import { saveTrainingData, getTrainingData } from '@/lib/knowledge-base';

async function testTraining() {
  // Save training data
  await saveTrainingData({
    articleId: "some-id",
    question: "Test question",
    answer: "Test answer",
    rating: 5,
  });

  // Retrieve and verify
  const data = await getTrainingData({ minRating: 4 });
  console.log(`Training records: ${data.length}`);
}
```

## Next Steps

1. **Immediate** (This Week)
   - [ ] Enable pgvector on Neon
   - [ ] Set up Prisma schema
   - [ ] Run migrations
   - [ ] Seed knowledge base
   - [ ] Test semantic search

2. **Short-term** (Next 2 Weeks)
   - [ ] Update tax-qa.ts to use new KB
   - [ ] Test AI with knowledge base
   - [ ] Set up analytics dashboard
   - [ ] Create knowledge base admin UI

3. **Medium-term** (Next Month)
   - [ ] Document upload feature
   - [ ] Personalization system
   - [ ] Advanced analytics
   - [ ] Performance optimization

4. **Long-term** (Q1 2026)
   - [ ] Fine-tuned model training
   - [ ] Multi-language support
   - [ ] Mobile app integration
   - [ ] Enterprise knowledge bases

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [pgvector](https://github.com/pgvector/pgvector)
- [Prisma Vector Support](https://www.prisma.io/docs/concepts/components/prisma-client/vectors)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [RAG Patterns](https://platform.openai.com/docs/guides/retrieval-augmented-generation)

## Support

For questions or issues:
1. Check the documentation above
2. Review Neon console logs
3. Test individual components
4. Check OpenAI API status
5. Verify Prisma migrations

---

**Knowledge Base = Smart AI = Better User Experience = 🚀**

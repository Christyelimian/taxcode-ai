# Knowledge Base API Reference

Complete function documentation for the knowledge base system.

## Core Functions

### `generateEmbedding(text: string): Promise<number[]>`

Generates a vector embedding for any text using OpenAI's text-embedding-3-small model.

**Parameters:**
- `text` - Text to embed (any length)

**Returns:**
- `number[]` - Array of 1536 numbers (vector embedding)

**Example:**
```typescript
import { generateEmbedding } from '@/lib/knowledge-base';

const embedding = await generateEmbedding('What is VAT?');
console.log(embedding); // [0.123, -0.456, ..., 0.789]
```

**Cost:** $0.02 per 1 million tokens (~400 words)

---

### `addArticle(data: AddArticleInput): Promise<KnowledgeBaseArticle>`

Adds a new article to the knowledge base with automatic embedding generation.

**Parameters:**
```typescript
{
  title: string;           // Article title (min 5 chars)
  content: string;         // Full content (min 50 chars)
  summary: string;         // Brief summary
  category: string;        // Article category
  tags: string[];          // Tags for filtering
  source: string;          // Source (e.g., "FIRS")
  author?: string;         // Author name
}
```

**Returns:**
- Stored article with ID and embedding

**Example:**
```typescript
import { addArticle } from '@/lib/knowledge-base';

const article = await addArticle({
  title: 'Withholding Tax Guide',
  content: 'Comprehensive guide to withholding tax...',
  summary: 'Overview of withholding tax',
  category: 'Tax Compliance',
  tags: ['withholding', 'tax'],
  source: 'FIRS'
});

console.log(article.id); // Article ID for reference
```

**Cost:** ~$0.0001 per article (for embedding generation)

---

### `semanticSearch(query: string, limit?: number, threshold?: number): Promise<Article[]>`

Searches the knowledge base using vector similarity (semantic search).

**Parameters:**
- `query` - Search query (will be embedded automatically)
- `limit` - Max results to return (default: 10)
- `threshold` - Minimum similarity score (0-1, default: 0.5)

**Returns:**
- Array of articles sorted by similarity

**Example:**
```typescript
import { semanticSearch } from '@/lib/knowledge-base';

const results = await semanticSearch('What is VAT?', 5, 0.7);

results.forEach(article => {
  console.log(article.title);      // "Nigerian VAT..."
  console.log(article.similarity); // 0.92
});
```

**Features:**
- Finds articles by meaning (not just keywords)
- Automatic query embedding
- Similarity scoring (0-1)
- Caching for performance

---

### `hybridSearch(query: string, limit?: number): Promise<Article[]>`

**Recommended** - Combines semantic and keyword search for best results.

**Parameters:**
- `query` - Search query
- `limit` - Max results (default: 10)

**Returns:**
- Array of articles with combined scoring

**Example:**
```typescript
import { hybridSearch } from '@/lib/knowledge-base';

// This is the recommended search function
const results = await hybridSearch('VAT exemptions', 5);

results.forEach(article => {
  console.log(`${article.title} (${article.similarity})`);
});
```

**How it works:**
1. Semantic search: Find by meaning
2. Keyword search: Find exact words
3. Combine scores: Articles in both = highest score
4. Sort by relevance

**Advantages:**
- Better accuracy than either alone
- Handles edge cases
- Natural language friendly
- Fast execution

---

### `getRelatedArticles(articleId: string, limit?: number): Promise<RelatedArticle[]>`

Finds articles related to a specific article using knowledge graph.

**Parameters:**
- `articleId` - Article to find relations for
- `limit` - Max results (default: 5)

**Returns:**
- Related articles with relevance scores

**Example:**
```typescript
import { getRelatedArticles } from '@/lib/knowledge-base';

const related = await getRelatedArticles('article-123', 3);

related.forEach(article => {
  console.log(article.title);          // Related article
  console.log(article.relevanceScore); // 0.85
});
```

**Use cases:**
- "You might also be interested in..."
- Building context for AI
- Knowledge discovery
- Content recommendations

---

### `saveTrainingData(data: TrainingDataInput): Promise<AITrainingData>`

Saves Q&A interactions for training and continuous improvement.

**Parameters:**
```typescript
{
  articleId: string;    // Which article was used
  question: string;     // User's question
  answer: string;       // AI's response
  userId?: string;      // User identifier
  helpful?: boolean;    // Did user find it helpful?
  feedback?: string;    // User feedback text
}
```

**Returns:**
- Saved training data record

**Example:**
```typescript
import { saveTrainingData } from '@/lib/knowledge-base';

await saveTrainingData({
  articleId: 'article-123',
  question: 'How much is VAT?',
  answer: 'VAT in Nigeria is 7.5%...',
  userId: 'user-456',
  helpful: true,
  feedback: 'Very helpful, thanks!'
});
```

**Automatically captured:**
- Timestamp
- Training effectiveness
- User engagement

**Used for:**
- Measuring search quality
- Finding knowledge gaps
- User analytics
- Future AI fine-tuning

---

### `getTrainingData(filter?: TrainingDataFilter): Promise<AITrainingData[]>`

Retrieves training data for analysis and improvement.

**Parameters:**
```typescript
{
  articleId?: string;    // Filter by article
  userId?: string;       // Filter by user
  helpful?: boolean;     // Filter by helpful rating
  startDate?: Date;      // Date range start
  endDate?: Date;        // Date range end
}
```

**Returns:**
- Array of training data records

**Example:**
```typescript
import { getTrainingData } from '@/lib/knowledge-base';

// Get all helpful training data
const helpful = await getTrainingData({ helpful: true });
console.log(`${helpful.length} helpful interactions`);

// Get this week's data
const thisWeek = await getTrainingData({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endDate: new Date()
});
```

---

### `buildKnowledgeGraph(threshold?: number): Promise<GraphStats>`

Creates relationships between semantically similar articles.

**Parameters:**
- `threshold` - Minimum similarity to create connection (default: 0.7)

**Returns:**
- Statistics about created relationships

**Example:**
```typescript
import { buildKnowledgeGraph } from '@/lib/knowledge-base';

const stats = await buildKnowledgeGraph(0.75);
console.log(`Created ${stats.connections} relationships`);
```

**Performance:**
- Takes 2-5 seconds for 10 articles
- Scales with article count
- Run during off-peak hours

**Benefits:**
- Finds related content
- Improves context
- Enables recommendations
- Powers "related articles"

---

### `batchEmbedArticles(articleIds: string[]): Promise<EmbeddingStats>`

Generates embeddings for multiple articles efficiently.

**Parameters:**
- `articleIds` - Array of article IDs

**Returns:**
- Statistics about processing

**Example:**
```typescript
import { batchEmbedArticles } from '@/lib/knowledge-base';

const ids = ['art-1', 'art-2', 'art-3'];
const stats = await batchEmbedArticles(ids);

console.log(`${stats.success} embedded, ${stats.failed} failed`);
```

**Advantages:**
- Batch processing (cheaper)
- Error recovery
- Progress tracking
- Efficient token usage

---

### `getKnowledgeBaseStats(): Promise<KBStats>`

Returns statistics and analytics about the knowledge base.

**Returns:**
```typescript
{
  totalArticles: number;
  activeArticles: number;
  totalSections: number;
  totalConnections: number;
  coveragePercentage: number;
  averageRelevanceScore: number;
  lastUpdated: Date;
}
```

**Example:**
```typescript
import { getKnowledgeBaseStats } from '@/lib/knowledge-base';

const stats = await getKnowledgeBaseStats();
console.log(`KB has ${stats.totalArticles} articles`);
console.log(`Coverage: ${stats.coveragePercentage}%`);
```

**Useful for:**
- Dashboard display
- Health monitoring
- Planning content updates
- Performance tracking

---

## API Endpoints

### `GET /api/knowledge/search`

Performs hybrid search on the knowledge base.

**Query Parameters:**
- `q` - Search query (required)
- `limit` - Max results (default: 10)

**Response:**
```json
{
  "query": "VAT",
  "count": 3,
  "results": [
    {
      "id": "...",
      "title": "Nigerian VAT Rates and Application",
      "summary": "...",
      "category": "VAT",
      "similarity": "0.92",
      "viewCount": 45
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/knowledge/search?q=VAT&limit=5"
```

---

### `GET /api/knowledge/stats`

Returns knowledge base statistics and analytics.

**Response:**
```json
{
  "totalArticles": 10,
  "activeArticles": 9,
  "totalSections": 45,
  "byCategory": [...],
  "mostViewed": [...],
  "mostHelpful": [...]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/knowledge/stats"
```

---

### `POST /api/knowledge/articles`

Adds a new article to the knowledge base.

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Full content...",
  "summary": "Brief summary",
  "category": "Personal Tax",
  "tags": ["tag1", "tag2"],
  "source": "FIRS",
  "author": "Admin"
}
```

**Response:**
```json
{
  "message": "Article added successfully",
  "article": {
    "id": "...",
    "title": "Article Title",
    "category": "Personal Tax",
    "createdAt": "2024-01-15T..."
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/knowledge/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Withholding Tax",
    "content": "Guide to withholding tax...",
    "summary": "Overview",
    "category": "Tax",
    "tags": ["tax"],
    "source": "FIRS"
  }'
```

---

### `POST /api/knowledge/build-graph`

Builds knowledge graph connections between articles.

**Response:**
```json
{
  "message": "Knowledge graph built successfully",
  "result": {
    "connections": 45,
    "processingTime": 3500
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/knowledge/build-graph"
```

---

## Type Definitions

### Article
```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  source: string;
  author: string;
  embedding: number[];  // 1536 dimensions
  viewCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### TrainingData
```typescript
interface AITrainingData {
  id: string;
  articleId: string;
  userId?: string;
  question: string;
  answer: string;
  helpful?: boolean;
  feedback?: string;
  rating?: number;
  createdAt: Date;
}
```

### RelatedArticle
```typescript
interface RelatedArticle {
  articleId: string;
  relatedArticleId: string;
  relevanceScore: number;
  connectionType: string;
  createdAt: Date;
}
```

---

## Error Handling

All functions include try-catch blocks and graceful degradation:

```typescript
try {
  const results = await hybridSearch('query');
} catch (error) {
  console.error('Search failed:', error);
  // Return empty results or fallback
}
```

**Common Errors:**
- `OPENAI_API_KEY not found` - Check env variables
- `Database connection failed` - Check connection string
- `Embedding generation failed` - Check OpenAI API status
- `No articles found` - Check seeding

---

## Performance Tips

### 1. Use Caching
```typescript
// Results are cached for 1 hour
const results = await hybridSearch(query);
```

### 2. Batch Operations
```typescript
// More efficient than individual calls
const stats = await batchEmbedArticles([...ids]);
```

### 3. Limit Results
```typescript
// Don't fetch unnecessary results
const results = await hybridSearch(query, 5);
```

### 4. Use Semantic Search for AI
```typescript
// Better for generating context
const context = await semanticSearch(query, 3);
```

---

## Cost Optimization

### Embedding Generation
- $0.02 per 1M tokens
- Average article: 500 words = ~750 tokens
- Cost per article: ~$0.000015

### Vector Search
- Included in Neon cost
- No per-query fees
- Unlimited searches

### Monthly Budget
- 100 articles: ~$0.0015
- 1000 articles: ~$0.015
- 10,000 articles: ~$0.15

**Conclusion:** Embedding costs are negligible

---

## Examples

### Complete Search & AI Flow
```typescript
import { hybridSearch, saveTrainingData } from '@/lib/knowledge-base';
import { askTaxLawQuestion } from '@/ai/flows/tax-qa';

// 1. Search knowledge base
const context = await hybridSearch('VAT Nigeria');

// 2. Ask AI with context
const response = await askTaxLawQuestion({
  question: 'What is VAT?',
  userId: 'user-123'
});

// 3. System automatically saves training data
// (done inside askTaxLawQuestion)

// 4. Get results
console.log(response.answer);
console.log(response.sourceArticles);
```

### Analytics Dashboard
```typescript
import { getKnowledgeBaseStats, getTrainingData } from '@/lib/knowledge-base';

const stats = await getKnowledgeBaseStats();
const trainingData = await getTrainingData({ helpful: true });

console.log(`Total: ${stats.totalArticles}`);
console.log(`Helpful: ${trainingData.length}`);
```

---

**Last Updated**: 2024
**Status**: Complete
**Version**: 1.0

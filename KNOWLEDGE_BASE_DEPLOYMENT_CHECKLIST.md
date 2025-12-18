# Knowledge Base Implementation Checklist

## Phase 1: Database Setup (Estimated: 5 minutes)

### Neon PostgreSQL Configuration
- [ ] Log into [Neon Console](https://console.neon.tech)
- [ ] Select your project and database
- [ ] Open SQL Editor
- [ ] Run: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Verify no errors (pgvector is now enabled)

### Environment Variables
- [ ] Add `OPENAI_API_KEY` to `.env.local`
  - Get key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - Format should be: `sk-...`
- [ ] Verify `DATABASE_URL` exists and is correct
  - Should point to your Neon PostgreSQL instance
  - Format: `postgresql://user:password@host/database`

## Phase 2: Prisma Migration (Estimated: 3 minutes)

### Schema Creation
- [ ] Run: `npx prisma migrate dev --name init_knowledge_base`
- [ ] Wait for migration to complete
- [ ] Verify no errors in output

### Verification
- [ ] Run: `npx prisma studio`
- [ ] Open [localhost:5555](http://localhost:5555)
- [ ] Verify all tables exist:
  - [ ] KnowledgeBaseArticle
  - [ ] ArticleSection
  - [ ] RelatedArticle
  - [ ] AITrainingData
  - [ ] VectorSearchCache
  - [ ] Documents
  - [ ] SavedArticle
  - [ ] User

## Phase 3: Initial Data (Estimated: 2 minutes)

### Seed Knowledge Base
- [ ] Run: `npx ts-node scripts/seed-knowledge-base.ts`
- [ ] Wait for completion
- [ ] Should show: "Successfully seeded 6 articles"

### Verify Seeding
- [ ] Run: `npx prisma studio`
- [ ] Go to KnowledgeBaseArticle table
- [ ] Verify 6 articles exist:
  - [ ] PITA Overview
  - [ ] CRA Guide
  - [ ] VAT Application
  - [ ] CIT Guide
  - [ ] Capital Gains Tax
  - [ ] 2026 Tax Reform

- [ ] Click on one article
- [ ] Verify `embedding` field has values (1536 dimensions)

## Phase 4: Testing (Estimated: 5 minutes)

### Test Semantic Search
```bash
npx tsx << 'EOF'
import { hybridSearch } from '@/lib/knowledge-base';
const results = await hybridSearch('What is VAT?', 3);
console.log(results);
EOF
```
- [ ] Returns 3 results
- [ ] VAT article has high similarity (>0.8)
- [ ] Results have similarity scores

### Test API Endpoint
```bash
curl "http://localhost:3000/api/knowledge/search?q=VAT&limit=3"
```
- [ ] Returns JSON response
- [ ] Contains 3 results
- [ ] Each result has title, summary, category, similarity

### Test Stats Endpoint
```bash
curl "http://localhost:3000/api/knowledge/stats"
```
- [ ] Returns JSON response
- [ ] Shows totalArticles: 6
- [ ] Shows activeArticles: 6

## Phase 5: Dashboard (Estimated: 2 minutes)

### Access Dashboard
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to: `http://localhost:3000/dashboard/knowledge-base`
- [ ] Page should load without errors

### Test Dashboard Features
- [ ] **Overview Tab**
  - [ ] Stats cards display
  - [ ] Shows totalArticles: 6
  - [ ] Shows activeArticles: 6

- [ ] **Search Tab**
  - [ ] Enter search term: "VAT"
  - [ ] Click Search
  - [ ] Returns results
  - [ ] Results show similarity percentages

- [ ] **Add Article Tab**
  - [ ] Fill in form:
    - [ ] Title: "Test Article"
    - [ ] Content: "This is test content..." (at least 50 chars)
    - [ ] Summary: "Test summary"
    - [ ] Category: Select one
    - [ ] Source: "Manual"
  - [ ] Click "Add Article"
  - [ ] Should show success message
  - [ ] Should now have 7 total articles

- [ ] **Analytics Tab**
  - [ ] Chart displays with data
  - [ ] Shows article views

- [ ] **Tools Tab**
  - [ ] "Build Knowledge Graph" button present
  - [ ] "Embed All Articles" button present

## Phase 6: AI Integration (Estimated: 5 minutes)

### Update Tax QA Flow
- [ ] File: `src/ai/flows/tax-qa.ts`
- [ ] Verify imports include:
  - [ ] `hybridSearch` from `@/lib/knowledge-base`
  - [ ] `saveTrainingData` from `@/lib/knowledge-base`
- [ ] Verify `getKnowledge` tool uses `hybridSearch()`
- [ ] Verify flow saves training data

### Test Tax QA Integration
- [ ] Navigate to: `/dashboard/assistant`
- [ ] Enter question: "What is VAT in Nigeria?"
- [ ] Wait for response
- [ ] Response should reference knowledge base
- [ ] Should mention source articles

## Phase 7: Advanced Features (Estimated: 5 minutes)

### Build Knowledge Graph
- [ ] Go to Dashboard → Tools Tab
- [ ] Click "Build Knowledge Graph"
- [ ] Wait for completion (takes 2-5 seconds)
- [ ] Should show success message

### Verify Knowledge Graph
```bash
npx prisma studio
# Go to RelatedArticle table
# Should have entries showing article relationships
```
- [ ] RelatedArticle table has entries
- [ ] Articles have relevance scores

### Test Related Articles Feature
```bash
npx tsx << 'EOF'
import { getRelatedArticles } from '@/lib/knowledge-base';
const articleId = '...'; // Get from dashboard
const related = await getRelatedArticles(articleId);
console.log('Related:', related);
EOF
```
- [ ] Returns related articles
- [ ] Each has relevance score

## Phase 8: Performance Optimization (Estimated: 3 minutes)

### Check Database Indexes
```bash
npx prisma studio
# Go to KnowledgeBaseArticle
# Verify indexed fields are present
```
- [ ] `embedding` field indexed
- [ ] `category` field indexed
- [ ] `active` field indexed
- [ ] `createdAt` field indexed

### Monitor Response Times
```bash
# Test search performance
time curl "http://localhost:3000/api/knowledge/search?q=VAT"
```
- [ ] Response time < 500ms
- [ ] No database errors in logs

## Phase 9: Monitoring & Analytics (Estimated: 2 minutes)

### Setup Monitoring
- [ ] Check logs: `npx vercel logs --tail`
- [ ] Monitor for errors
- [ ] Track search queries

### Enable Training Data Collection
- [ ] Verify AITrainingData table exists
- [ ] Check that Q&A interactions are logged
```bash
npx prisma studio
# Go to AITrainingData
# Should see entries after using tax assistant
```
- [ ] New entries appear when questions are asked
- [ ] Data includes userId, question, answer, rating

## Phase 10: Documentation & Training (Estimated: 3 minutes)

### Review Documentation
- [ ] Read: `KNOWLEDGE_BASE_QUICKSTART.md`
- [ ] Read: `KNOWLEDGE_BASE_COMPLETE.md`
- [ ] Read: `KNOWLEDGE_BASE_INTEGRATION.md`
- [ ] Read: `KNOWLEDGE_BASE_IMPLEMENTATION.md`

### Share with Team
- [ ] Share dashboard access instructions
- [ ] Explain how to add articles
- [ ] Show search functionality
- [ ] Explain training data benefits

## Phase 11: Production Deployment (Estimated: 5 minutes)

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No errors in logs
- [ ] Dashboard working correctly
- [ ] API endpoints responsive
- [ ] Training data collecting

### Environment Verification
- [ ] `OPENAI_API_KEY` set in production
- [ ] `DATABASE_URL` points to production Neon
- [ ] pgvector enabled on production database
- [ ] Migrations applied to production

### Deployment
- [ ] Push code to main branch
- [ ] Verify Vercel/deployment pipeline passes
- [ ] Wait for deployment completion
- [ ] Test production endpoints
- [ ] Verify knowledge base works in production

## Phase 12: Post-Launch (Ongoing)

### Daily
- [ ] Check logs for errors
- [ ] Monitor API response times
- [ ] Verify search quality

### Weekly
- [ ] Review search logs
- [ ] Check for common questions
- [ ] Add missing articles
- [ ] Monitor training data quality

### Monthly
- [ ] Analyze training data
- [ ] Identify knowledge gaps
- [ ] Update outdated articles
- [ ] Review performance metrics
- [ ] Plan new features

## Troubleshooting Guide

### Issue: "pgvector not found"
**Solution**: 
1. Go to Neon Console
2. Run: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Refresh and try again

### Issue: "OPENAI_API_KEY not found"
**Solution**:
1. Check `.env.local` exists
2. Add: `OPENAI_API_KEY=sk-your-key`
3. Restart dev server

### Issue: "No articles found in search"
**Solution**:
1. Verify seed script ran: `npx prisma studio` → KnowledgeBaseArticle
2. Check articles have embeddings
3. Try different search terms

### Issue: "API returns 500 error"
**Solution**:
1. Check logs: `npx vercel logs --tail`
2. Verify database connection
3. Check OpenAI API quota
4. Verify OPENAI_API_KEY format

### Issue: "Dashboard loads but no data"
**Solution**:
1. Verify Prisma migrations applied
2. Check database connection
3. Refresh page and try again
4. Check browser console for errors

### Issue: "Search is slow (>1 second)"
**Solution**:
1. Verify indexes are created
2. Run: `npx prisma db seed` to optimize
3. Check vector dimension (should be 1536)
4. Monitor database connection pool

### Issue: "Can't add new articles"
**Solution**:
1. Verify OPENAI_API_KEY is set
2. Check OpenAI API quota
3. Verify article content > 50 characters
4. Check logs for specific errors

## Success Indicators

✅ **You're ready when:**
- [ ] Dashboard loads without errors
- [ ] Search returns VAT article when searching "VAT"
- [ ] Can add new articles successfully
- [ ] API endpoints respond in <500ms
- [ ] Knowledge graph built successfully
- [ ] Training data being collected
- [ ] Tax QA uses knowledge base
- [ ] Team can access dashboard
- [ ] No errors in logs for 1 hour
- [ ] All 6 seed articles searchable

## Time Estimates

| Phase | Time | Priority |
|-------|------|----------|
| Database Setup | 5 min | 🔴 Critical |
| Prisma Migration | 3 min | 🔴 Critical |
| Seed Data | 2 min | 🔴 Critical |
| Testing | 5 min | 🟠 High |
| Dashboard | 2 min | 🟠 High |
| AI Integration | 5 min | 🟠 High |
| Advanced Features | 5 min | 🟡 Medium |
| Optimization | 3 min | 🟡 Medium |
| Monitoring | 2 min | 🟡 Medium |
| Documentation | 3 min | 🟢 Low |
| Deployment | 5 min | 🔴 Critical |
| **TOTAL** | **40 min** | - |

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: ✅ Ready to Deploy

Print this checklist and check off each item as you complete it!

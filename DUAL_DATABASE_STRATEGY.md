# Dual Database Strategy: Firebase + Neon

## Overview

TaxCode uses **two separate databases** for different purposes:

### 🟦 **Database #1: Firebase/Firestore** (Transactional Academy DB)
**Purpose:** User-facing app state, Academy modules, enrollments, progress

**Stores:**
- Training modules (`trainingModules` collection)
- User accounts, roles, preferences
- Enrollment data, progress, streaks, XP
- Team members, contacts
- CMS content (drafts, published status)

**Characteristics:**
- Fast writes, real-time updates
- User permissions & security rules
- Per-user data isolation
- Optimized for: **app transactions, UI rendering**

### 🟩 **Database #2: Neon/Postgres + Prisma** (AI Knowledge Base)
**Purpose:** Curated knowledge corpus for AI retrieval (RAG)

**Stores:**
- Knowledge base articles (`KnowledgeBaseArticle`)
- Article sections with embeddings (`ArticleSection`)
- Vector embeddings (pgvector, 1536 dimensions)
- Knowledge graph relationships (`RelatedArticle`)
- Training data logs (`AITrainingData`)

**Characteristics:**
- Semantic search (vector similarity)
- Section-level chunking for precision
- Optimized for: **AI retrieval, grounding answers**

---

## How They Work Together

### The Sync Flow (Automatic)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Admin Creates/Updates Module (Firestore)                 │
│    └─> trainingModules/{id}                                 │
│        - title, summary, tags, content                      │
│        - status: Draft/Published/Archived                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Dual-Write/Sync Trigger                                  │
│    └─> syncTrainingModuleToKnowledgeBase()                   │
│        - Converts module → KB article format                │
│        - Generates embeddings (OpenRouter)                  │
│        - Chunks into sections (300-800 tokens)              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Write to Neon/Postgres (KB)                              │
│    └─> KnowledgeBaseArticle                                 │
│        - Full article with embedding                        │
│        - ArticleSection[] (chunked, embedded)               │
│        - isActive = (status === 'Published')                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Store Link Back to Firestore                             │
│    └─> trainingModules/{id}.kbArticleId                     │
│        - Links Firestore doc → Postgres article             │
│        - Enables updates/deletes                            │
└─────────────────────────────────────────────────────────────┘
```

### When Sync Happens

**Automatic sync occurs when:**

1. **Creating a module** (`createTrainingModule`)
   - Writes to Firestore first
   - Then syncs to KB (if KB configured)
   - Stores `kbArticleId` back in Firestore

2. **Updating a module** (`updateTrainingModule`)
   - Updates Firestore
   - Updates KB article (re-embeds if content changed)
   - Activates/deactivates based on `status`

3. **Publishing/Unpublishing**
   - `status: Published` → KB article `isActive: true` (retrievable)
   - `status: Draft/Archived` → KB article `isActive: false` (soft "untrain")

4. **Deleting a module** (`deleteTrainingModule`)
   - Deletes Firestore doc
   - Deletes KB article (cascade deletes sections)

---

## Example: Import Script Flow

When you run `scripts/import-nigeria-tax-training.ts`:

### Step 1: Write to Firestore
```typescript
// Creates in Firebase/Firestore
const docRef = await db.collection('trainingModules').add({
  title: "2025 Tax Reform Overview",
  status: "Published",
  content: [...topics],
  // ... other fields
});
```

### Step 2: Sync to Neon/Postgres KB
```typescript
// Creates in Postgres Knowledge Base
const kbArticle = await addArticle({
  title: "Academy Module: 2025 Tax Reform Overview",
  content: "# Module content...",
  // ... generates embeddings
  // ... chunks into sections
});

// Links back
await db.collection('trainingModules').doc(docRef.id).update({
  kbArticleId: kbArticle.id,
  kbSyncedAt: new Date(),
});
```

### Result:
- ✅ Module appears in `/academy` (reads from Firestore)
- ✅ Module searchable by AI (reads from Postgres KB)
- ✅ Both databases stay in sync

---

## How AI Uses Both Databases

### User asks: "What is the Development Levy?"

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AI Flow (tax-qa.ts)                                       │
│    └─> askTaxLawQuestion("What is Development Levy?")       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Retrieval from KB (Postgres)                             │
│    └─> hybridSearch(query)                                 │
│        - Searches ArticleSection embeddings                │
│        - Finds relevant sections from Academy modules      │
│        - Returns: section content + metadata               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. AI Generates Answer                                      │
│    └─> Uses retrieved KB sections as context               │
│        - Cites source: "Academy Module: 2025 Tax Reform..." │
│        - Includes sourceUrl: /academy/modules/{id}         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. User Clicks Citation                                     │
│    └─> Navigates to /academy/modules/{id}                  │
│        - Reads full module from Firestore                  │
│        - Shows enrollment/progress (Firestore)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Benefits of Dual DB Strategy

### ✅ **Separation of Concerns**
- **Firestore**: Fast, user-facing, transactional
- **Postgres**: Optimized for AI retrieval, semantic search

### ✅ **Independent Scaling**
- Firestore scales automatically (Google Cloud)
- Postgres scales independently (Neon serverless)

### ✅ **Data Governance**
- **"Untraining"** = Set `isActive: false` in KB (doesn't delete Firestore)
- **Versioning** = Update Firestore module → KB re-embeds automatically
- **Audit trail** = Both databases maintain their own history

### ✅ **Resilience**
- If KB sync fails → Module still created in Firestore (non-fatal)
- If Firestore fails → KB articles remain searchable
- Can rebuild KB from Firestore modules if needed

---

## Making Changes: How It Works

### Scenario: Update a Module

1. **Admin edits module** in `/dashboard/modules/{id}/edit`
2. **Saves** → `updateTrainingModule()` called
3. **Firestore updated** → Module doc changed
4. **KB sync triggered**:
   - If `content` changed → Re-embeds article + sections
   - If `status` changed → Activates/deactivates KB article
   - Updates `kbArticleId` link in Firestore
5. **Result**: Both databases stay in sync

### Scenario: Publish a Draft Module

1. **Admin changes status** from `Draft` → `Published`
2. **KB article** `isActive` set to `true`
3. **Module now retrievable** by AI
4. **Module appears** in `/academy` (Firestore query filters `status: Published`)

---

## Configuration Requirements

### For Firestore (Academy DB):
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### For Neon/Postgres (KB):
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
OPENROUTER_API_KEY=sk-or-v1-...  # For embeddings
```

### Both Required For:
- ✅ Full sync (modules → KB)
- ✅ AI answers with citations
- ✅ Academy UI + AI Assistant

### Firestore Only:
- ✅ Academy UI works
- ✅ Module management works
- ❌ AI can't retrieve module content

### KB Only:
- ✅ AI can search existing KB articles
- ❌ Can't create modules via UI
- ❌ No Academy content

---

## Troubleshooting Sync Issues

### "KB sync failed (non-fatal)"
- **Cause**: DATABASE_URL or OPENROUTER_API_KEY missing/invalid
- **Impact**: Module created in Firestore, but not in KB
- **Fix**: Set correct env vars, then manually sync via Edit → Save

### "Module not appearing in AI answers"
- **Check**: Is `status === 'Published'`?
- **Check**: Does Firestore doc have `kbArticleId`?
- **Check**: Is KB article `isActive: true`?
- **Fix**: Edit module → Publish → Save

### "Want to rebuild KB from Firestore"
- **Option 1**: Edit each module → Save (triggers sync)
- **Option 2**: Create a migration script that reads Firestore → writes to KB

---

## Summary

**Firebase/Firestore** = Your app's transactional database (Academy, users, progress)  
**Neon/Postgres** = Your AI's knowledge database (RAG, embeddings, retrieval)

**They sync automatically** when modules are created/updated/published, keeping both databases aligned for optimal performance in their respective roles.


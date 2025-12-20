# Lesson Content Strategy

## Current State
- Training modules have `content: string[]` - just topic titles
- No detailed lesson content exists
- Learning interface shows placeholder text

## Proposed Strategy: Hybrid Approach

### 1. Database Model (Prisma)

Create a new `LessonContent` model in PostgreSQL to store detailed lesson content:

```prisma
model LessonContent {
  id              String   @id @default(cuid())
  moduleId        String   // References Firestore TrainingModule ID
  lessonIndex     Int      // 0-based index matching module.content array
  
  // Content structure
  title           String   // Lesson title (denormalized from module.content)
  content         String   @db.Text // Main content (Markdown supported)
  summary         String?  @db.Text // Short summary/learning objective
  
  // Rich content support
  contentType     String   @default("markdown") // markdown, html, video
  videoUrl        String?  // Optional video URL
  videoDuration   Int?     // Duration in seconds
  
  // Interactive elements
  hasQuiz         Boolean  @default(false)
  quizData        Json?    // Quiz questions and answers
  
  // Resources
  resources       Json?    // Array of resources: {type, title, url}[]
  // Example: [{type: "pdf", title: "Tax Guide", url: "..."}]
  
  // Metadata
  estimatedMinutes Int     @default(5) // Estimated time to complete
  difficulty      String   @default("beginner") // beginner, intermediate, advanced
  
  // SEO & tracking
  viewCount       Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([moduleId, lessonIndex])
  @@index([moduleId])
  @@index([lessonIndex])
}
```

### 2. Content Types Supported

#### A. Markdown Content (Primary)
- Rich text formatting
- Code blocks
- Lists, tables, links
- Images embedded via URLs

#### B. Video Lessons
- YouTube/Vimeo embeds
- Self-hosted videos
- Video transcripts

#### C. Interactive Quizzes
- Multiple choice
- True/False
- Short answer (future)
- Immediate feedback

#### D. Resources
- PDF downloads
- External links
- Practice exercises
- Templates

### 3. Content Structure Example

```json
{
  "moduleId": "abc123",
  "lessonIndex": 0,
  "title": "Understanding Nigerian Tax System",
  "content": "# Understanding Nigerian Tax System\n\n## Introduction\n\nThe Nigerian tax system...",
  "summary": "Learn the fundamentals of how taxes work in Nigeria",
  "contentType": "markdown",
  "videoUrl": "https://youtube.com/watch?v=...",
  "videoDuration": 600,
  "hasQuiz": true,
  "quizData": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "What is the primary tax authority in Nigeria?",
        "options": ["FIRS", "CBN", "Ministry of Finance"],
        "correctAnswer": 0,
        "explanation": "FIRS (Federal Inland Revenue Service) is responsible..."
      }
    ]
  },
  "resources": [
    {
      "type": "pdf",
      "title": "Tax Guide 2024",
      "url": "/resources/tax-guide-2024.pdf"
    }
  ],
  "estimatedMinutes": 10,
  "difficulty": "beginner"
}
```

### 4. Implementation Phases

#### Phase 1: Database & API (Week 1)
- [ ] Add `LessonContent` model to Prisma schema
- [ ] Create migration
- [ ] Create API routes:
  - `GET /api/lessons/[moduleId]/[lessonIndex]` - Get lesson content
  - `POST /api/lessons` - Create/update lesson content (admin)
  - `PUT /api/lessons/[id]` - Update lesson content (admin)
  - `DELETE /api/lessons/[id]` - Delete lesson content (admin)

#### Phase 2: Admin Interface (Week 2)
- [ ] Add lesson content editor to module edit page
- [ ] Rich text editor (Tiptap or similar)
- [ ] Video URL input
- [ ] Quiz builder interface
- [ ] Resource uploader
- [ ] Preview functionality

#### Phase 3: Learning Interface (Week 3)
- [ ] Update `/academy/modules/[id]/learn` to fetch and display content
- [ ] Markdown renderer
- [ ] Video player component
- [ ] Quiz component
- [ ] Resource download links
- [ ] Progress tracking integration

#### Phase 4: Content Migration (Week 4)
- [ ] Create content for existing modules
- [ ] Import from existing documents
- [ ] AI-assisted content generation (optional)

### 5. Content Creation Workflow

#### Option A: Manual Creation (Admin Dashboard)
1. Admin creates/edits module
2. For each lesson topic, admin clicks "Add Content"
3. Admin fills in:
   - Markdown content (rich text editor)
   - Optional video URL
   - Quiz questions (if applicable)
   - Resources
4. Content is saved to PostgreSQL

#### Option B: AI-Assisted Generation
1. Admin provides module topic
2. System uses AI to generate:
   - Lesson content outline
   - Detailed markdown content
   - Quiz questions
   - Learning objectives
3. Admin reviews and edits
4. Content is saved

#### Option C: Import from Documents
1. Admin uploads PDF/DOCX
2. System extracts content
3. System splits into lessons
4. Admin reviews and assigns to lessons
5. Content is saved

### 6. Content Storage Strategy

**PostgreSQL (Prisma) for:**
- Structured lesson content
- Quizzes
- Metadata
- Relationships

**Firestore for:**
- Module metadata (title, dates, status)
- Module-level settings
- Quick access to module list

**File Storage (Future) for:**
- Video files (if self-hosted)
- PDF resources
- Images

### 7. API Design

```typescript
// Get lesson content
GET /api/lessons/[moduleId]/[lessonIndex]
Response: {
  success: true,
  lesson: {
    id: string,
    moduleId: string,
    lessonIndex: number,
    title: string,
    content: string, // Markdown
    summary: string,
    contentType: string,
    videoUrl?: string,
    videoDuration?: number,
    hasQuiz: boolean,
    quizData?: QuizData,
    resources?: Resource[],
    estimatedMinutes: number,
    difficulty: string
  }
}

// Create/Update lesson content (Admin)
POST /api/lessons
Body: {
  moduleId: string,
  lessonIndex: number,
  title: string,
  content: string,
  summary?: string,
  videoUrl?: string,
  quizData?: QuizData,
  resources?: Resource[],
  estimatedMinutes?: number,
  difficulty?: string
}

// Bulk get all lessons for a module
GET /api/lessons/module/[moduleId]
Response: {
  success: true,
  lessons: LessonContent[]
}
```

### 8. UI Components Needed

#### A. Lesson Content Editor (Admin)
- Rich text editor (Tiptap/Quill)
- Markdown preview
- Video URL input
- Quiz builder
- Resource manager

#### B. Lesson Viewer (Learner)
- Markdown renderer (react-markdown)
- Video player (react-player)
- Quiz component
- Resource download buttons
- Progress indicator

### 9. Migration Path

#### For Existing Modules:
1. Keep `content: string[]` in Firestore (backward compatible)
2. Create `LessonContent` records in PostgreSQL for each lesson
3. Learning interface checks PostgreSQL first, falls back to topic title if no content

#### For New Modules:
1. Admin creates module with topics
2. Admin adds detailed content for each lesson
3. Both Firestore (topics) and PostgreSQL (content) are populated

### 10. Content Templates

Create reusable templates for common lesson types:

- **Concept Lesson**: Introduction → Explanation → Examples → Summary
- **How-To Lesson**: Problem → Steps → Example → Practice
- **Case Study**: Scenario → Analysis → Key Takeaways
- **Quiz Lesson**: Review → Questions → Explanations

### 11. Future Enhancements

- **Interactive Elements**: 
  - Code playgrounds
  - Interactive calculators
  - Scenario simulations
  
- **Social Learning**:
  - Comments on lessons
  - Discussion threads
  - Peer reviews
  
- **Adaptive Learning**:
  - Content difficulty adjustment
  - Personalized recommendations
  - Learning path optimization

## Implementation Priority

1. **High Priority**: Basic markdown content + API
2. **Medium Priority**: Admin editor + Video support
3. **Low Priority**: Quizzes + Resources + AI generation

## Estimated Timeline

- **Week 1**: Database model + API routes
- **Week 2**: Admin content editor
- **Week 3**: Learning interface updates
- **Week 4**: Content creation for existing modules

Total: ~4 weeks for full implementation


-- Migration SQL to create Insight and News tables
-- Copy and paste this entire file into your database SQL console

-- CreateTable: Insight
CREATE TABLE IF NOT EXISTS "Insight" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "downloads" JSONB,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable: News
CREATE TABLE IF NOT EXISTS "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "externalUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Insight slug (unique)
CREATE UNIQUE INDEX IF NOT EXISTS "Insight_slug_key" ON "Insight"("slug");

-- CreateIndex: Insight category
CREATE INDEX IF NOT EXISTS "Insight_category_idx" ON "Insight"("category");

-- CreateIndex: Insight isPublished
CREATE INDEX IF NOT EXISTS "Insight_isPublished_idx" ON "Insight"("isPublished");

-- CreateIndex: Insight isFeatured
CREATE INDEX IF NOT EXISTS "Insight_isFeatured_idx" ON "Insight"("isFeatured");

-- CreateIndex: News slug (unique)
CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News"("slug");

-- CreateIndex: News type
CREATE INDEX IF NOT EXISTS "News_type_idx" ON "News"("type");

-- CreateIndex: News isPublished
CREATE INDEX IF NOT EXISTS "News_isPublished_idx" ON "News"("isPublished");

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('News', 'Insight');




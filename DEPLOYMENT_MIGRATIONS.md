# Production Migration Guide

## Issue: Tables Don't Exist in Production

If you're seeing errors like:
```
The table `public.News` does not exist in the current database
The table `public.Insight` does not exist in the current database
```

This means migrations haven't been applied to your production database.

## Solution: Run Migrations on Production

### Option 1: Using Vercel (Recommended)

If you're using Vercel, migrations will run automatically if you set the build command:

1. Go to your Vercel project settings
2. Go to "Build & Development Settings"
3. Set **Build Command** to:
   ```
   npm run vercel-build
   ```
4. Redeploy your application

This will:
- Generate Prisma Client
- Run migrations (`prisma migrate deploy`)
- Build your Next.js app

### Option 2: Manual Migration via Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Run migrations in production:
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### Option 3: Manual Migration via Database Console

1. Connect to your production database (Neon Console, etc.)
2. Open SQL Editor
3. Run the migration SQL:

```sql
-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Insight_slug_key" ON "Insight"("slug");
CREATE INDEX IF NOT EXISTS "Insight_category_idx" ON "Insight"("category");
CREATE INDEX IF NOT EXISTS "Insight_isPublished_idx" ON "Insight"("isPublished");
CREATE INDEX IF NOT EXISTS "Insight_isFeatured_idx" ON "Insight"("isFeatured");
CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News"("slug");
CREATE INDEX IF NOT EXISTS "News_type_idx" ON "News"("type");
CREATE INDEX IF NOT EXISTS "News_isPublished_idx" ON "News"("isPublished");
```

### Option 4: Using Railway, Render, or Other Platforms

1. SSH into your production server (or use their console)
2. Set `DATABASE_URL` environment variable
3. Run:
   ```bash
   npm install
   npx prisma migrate deploy
   ```

## Verify Migration Success

After running migrations, verify tables exist:

```bash
# Using Prisma Studio (if you have database access)
npx prisma studio

# Or check via SQL
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('News', 'Insight');
```

## Quick Fix for Vercel

The easiest way is to update your Vercel build command:

1. **Vercel Dashboard** → Your Project → **Settings** → **Build & Development Settings**
2. Change **Build Command** from `npm run build` to `npm run vercel-build`
3. Click **Save**
4. Go to **Deployments** tab
5. Click **Redeploy** on the latest deployment

This will automatically run migrations on every deployment.

## Troubleshooting

### Error: "Migration already applied"
- This is fine - it means migrations are up to date
- Check if tables exist using Prisma Studio

### Error: "DATABASE_URL not found"
- Ensure `DATABASE_URL` is set in your production environment variables
- For Vercel: Project Settings → Environment Variables

### Error: "Permission denied"
- Ensure your database user has CREATE TABLE permissions
- Check database user roles in your database provider (Neon, Railway, etc.)


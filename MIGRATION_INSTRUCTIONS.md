# Database Migration Instructions

## Issue: Missing News Table

If you're seeing the error:
```
Invalid `prisma.news.findUnique()` invocation: The table `public.News` does not exist in the current database.
```

This means the database migrations haven't been applied to your production database.

## Solution: Apply Migrations

### Option 1: Using the Migration Script (Recommended)

```bash
npm run migrate:apply
```

or

```bash
npx tsx scripts/apply-migrations.ts
```

### Option 2: Using Prisma CLI Directly

```bash
npx prisma migrate deploy
```

This will apply all pending migrations to your production database.

### Option 3: Manual Migration (if automated fails)

1. Connect to your production database
2. Run the SQL from the migration file:
   ```bash
   cat prisma/migrations/20251220061100_add_insights_and_news/migration.sql
   ```
3. Copy and execute the SQL in your database console

## Verify Migration Success

After running migrations, verify the tables exist:

```bash
npx prisma studio
```

Or check via SQL:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('News', 'Insight');
```

## Environment Variables

Make sure `DATABASE_URL` is set correctly in your production environment:

```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Or in your hosting platform (Vercel, Railway, etc.)
# Add DATABASE_URL to environment variables
```

## Troubleshooting

### Error: "Migration already applied"
- This is fine - it means migrations are up to date
- Check if the table exists: `npx prisma studio`

### Error: "Connection refused" or "Database not found"
- Verify `DATABASE_URL` is correct
- Check database credentials
- Ensure database is accessible from your deployment environment

### Error: "Permission denied"
- Ensure database user has CREATE TABLE permissions
- Check database user roles and permissions

## After Migration

Once migrations are applied:
1. Restart your application
2. The News table should now exist
3. You can create news items via `/dashboard/insights`

## Migration Files

The migration that creates the News table is located at:
- `prisma/migrations/20251220061100_add_insights_and_news/migration.sql`

This migration creates:
- `News` table - for press mentions and public statements
- `Insight` table - for structured tax explainers
- All necessary indexes and constraints




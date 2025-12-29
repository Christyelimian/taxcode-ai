-- Drop Insight and News tables since they're now handled by Firebase Firestore
-- This migration removes the PostgreSQL tables to avoid data duplication

-- Drop Insight table
DROP TABLE IF EXISTS "public"."Insight";

-- Drop News table
DROP TABLE IF EXISTS "public"."News";

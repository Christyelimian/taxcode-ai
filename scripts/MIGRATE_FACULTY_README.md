# Faculty Collection Migration Guide

This guide explains how to migrate faculty members from the `teamMembers` collection to the new `faculty` collection.

## Overview

The `faculty` collection is now separate from `teamMembers`:
- **`faculty` collection**: Regular faculty members only (Lead Facilitator, Training Coordinator, Admin, Member, etc.)
- **`teamMembers` collection**: Tax consultants and lawyers (separate from faculty)

## Migration Methods

### Method 1: Command Line Script (Recommended)

#### Dry Run (Preview Changes)
```bash
npm run migrate:faculty:dry-run
```

This will show you:
- Total documents in `teamMembers`
- How many consultants will be skipped
- How many lawyers will be skipped
- How many faculty members will be migrated
- List of documents that will be migrated

#### Execute Migration
```bash
npm run migrate:faculty
```

This will:
- Copy faculty members from `teamMembers` to `faculty` collection
- Skip consultants and lawyers (they remain in `teamMembers`)
- Preserve all document IDs
- Preserve all data fields including `createdAt`

### Method 2: Admin API Route

You can also trigger the migration through the admin API:

#### Dry Run
```bash
curl -X POST https://your-domain.com/api/admin/migrate-faculty \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{"dryRun": true}'
```

#### Execute Migration
```bash
curl -X POST https://your-domain.com/api/admin/migrate-faculty \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{"dryRun": false}'
```

**Note:** Requires admin authentication.

## What Gets Migrated

### ✅ Will be migrated to `faculty`:
- Regular faculty members (Lead Facilitator, Training Coordinator, etc.)
- Admin users
- Members without `isConsultant` or `isLawyer` flags
- Documents without role "Tax Consultant" or "Tax Lawyer"

### ❌ Will NOT be migrated (stay in `teamMembers`):
- Documents with `isConsultant === true`
- Documents with `isLawyer === true`
- Documents with `role === "Tax Consultant"`
- Documents with `role === "Tax Lawyer"`

## Migration Process

1. **Reads** all documents from `teamMembers` collection
2. **Filters** out consultants and lawyers
3. **Copies** remaining faculty members to `faculty` collection
4. **Preserves** document IDs and all data fields
5. **Skips** documents that already exist in `faculty` (updates them instead)

## After Migration

### Verify Migration
1. Go to `/dashboard/team` page
2. Check that faculty members are displayed
3. Verify consultants/lawyers are NOT shown on the team page
4. Verify consultants/lawyers are still accessible through their respective directory pages

### Clean Up (Optional)
After verifying the migration works correctly, you can optionally:
- Remove faculty members from `teamMembers` collection (they're now in `faculty`)
- Keep `teamMembers` collection only for consultants and lawyers

**⚠️ Warning:** Only remove data from `teamMembers` after confirming everything works correctly!

## Troubleshooting

### No faculty members showing on team page
- Check if `faculty` collection exists in Firestore
- Verify documents were migrated successfully
- Check Firestore console for any errors

### Consultants/lawyers appearing on team page
- Verify they don't have `isConsultant` or `isLawyer` flags set to `false`
- Check their `role` field is not "Tax Consultant" or "Tax Lawyer"
- Re-run migration to ensure clean separation

### Migration fails
- Check Firestore permissions
- Verify admin authentication
- Check console logs for specific errors
- Ensure batch size doesn't exceed Firestore limits (500 operations)

## Files Modified

- `src/app/actions.ts` - Updated to use `faculty` collection
- `src/app/dashboard/team/page.tsx` - Connected to `faculty` collection
- `scripts/migrate-to-faculty.ts` - Migration script
- `src/app/api/admin/migrate-faculty/route.ts` - API route for migration

## Collection Structure

### Before Migration
```
teamMembers/
  ├── faculty-member-1 (Lead Facilitator)
  ├── faculty-member-2 (Training Coordinator)
  ├── consultant-1 (Tax Consultant)
  └── lawyer-1 (Tax Lawyer)
```

### After Migration
```
faculty/
  ├── faculty-member-1 (Lead Facilitator)
  └── faculty-member-2 (Training Coordinator)

teamMembers/
  ├── consultant-1 (Tax Consultant)
  └── lawyer-1 (Tax Lawyer)
```

## Support

If you encounter any issues during migration, please:
1. Check the console logs
2. Verify your Firestore permissions
3. Ensure you have admin access
4. Review the migration stats output



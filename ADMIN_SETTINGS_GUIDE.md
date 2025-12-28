# Admin Settings Guide

## Overview

The Admin Settings page (`/dashboard/settings`) provides a comprehensive interface for managing all platform configurations, environment variables, backups, and system settings. This page is only accessible to users with the `admin` role.

## Features

### 1. Environment Variables Management

**Location:** Environment Variables tab

**Features:**
- View and manage all environment variables
- Add custom environment variables
- Mark variables as secret (masked by default)
- Copy values to clipboard
- Show/hide secret values
- Add descriptions for each variable

**Important Notes:**
- Environment variables stored here are for reference and documentation purposes
- Actual environment variable changes require updating your deployment environment (Vercel, Railway, etc.)
- The page shows current values from `process.env` but cannot modify them at runtime

**Common Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `FIREBASE_PROJECT_ID` - Firebase project identifier
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase private key (secret)
- `RESEND_API_KEY` - Resend email service API key (secret)
- `OPENAI_API_KEY` - OpenAI API key for embeddings (secret)
- `OPENROUTER_API_KEY` - OpenRouter API key for AI chat (secret)

### 2. Database Configuration & Backup

**Location:** Database tab

**Features:**
- Configure database connection URL
- Enable/disable automatic backups
- Set backup frequency (hourly, daily, weekly, monthly)
- Create manual database backups
- Restore database from backup file
- Test database connection

**Backup Process:**
1. Click "Create Backup" button
2. System creates a JSON file containing:
   - All Firestore collections (users, trainingModules, knowledgeBase, etc.)
   - All PostgreSQL tables (users, questions, answers, enrollments, etc.)
   - Metadata and timestamps
3. Backup file downloads automatically
4. Last backup timestamp is saved

**Restore Process:**
1. Click "Restore Backup" button
2. Select a backup JSON file
3. System restores:
   - Firestore collections (upsert operations)
   - PostgreSQL tables (upsert operations)
4. Confirmation message displayed

**Important:** 
- Backups include both Firestore and PostgreSQL data
- Restore operations use upsert (update or insert) to avoid data loss
- Always test backups before relying on them in production

### 3. Email Configuration

**Location:** Email tab

**Features:**
- Select email provider (Resend, SendGrid, AWS SES, SMTP)
- Configure API key
- Set "from" email address
- Set "from" name
- Test email connection

**Current Implementation:**
- Uses Resend by default
- Configured via `RESEND_API_KEY` environment variable
- Used for:
  - Contact form notifications
  - Booking confirmations
  - Consultant notifications
  - Onboarding emails

### 4. AI Configuration

**Location:** AI tab

**Features:**
- Configure OpenAI API key (for embeddings)
- Configure OpenRouter API key (for chat)
- Select default AI model
- Adjust temperature setting (0-1)
- Test AI connections

**Models Available:**
- Claude 3.5 Sonnet (default)
- GPT-4
- GPT-3.5 Turbo
- Claude 3 Opus

**Usage:**
- OpenAI: Used for knowledge base embeddings and semantic search
- OpenRouter: Used for AI chat assistant responses

### 5. Firebase Configuration

**Location:** Firebase tab

**Features:**
- Configure Firebase Project ID
- Configure Firebase Client Email
- Configure Firebase Private Key
- Test Firebase connection

**Used For:**
- User authentication (Google, GitHub OAuth)
- Firestore database (users, training modules, etc.)
- Session management

**Security:**
- Private key is masked by default
- Can be shown/hidden with eye icon
- Stored securely in environment variables

### 6. System Settings

**Location:** System tab

**Features:**
- **Maintenance Mode:** Enable to show maintenance page to non-admin users
- **Allow Registrations:** Enable/disable new user signups
- **Max Upload Size:** Set maximum file upload size in MB (default: 10MB)
- **Session Timeout:** Set session timeout in seconds (default: 3600 = 1 hour)

**Use Cases:**
- **Maintenance Mode:** Use during deployments or major updates
- **Allow Registrations:** Temporarily disable signups if needed
- **Max Upload Size:** Control resource usage and storage costs
- **Session Timeout:** Balance security and user experience

## Security Features

1. **Admin-Only Access:** Page is protected by `AdminProtectedLayout`
2. **Secret Masking:** Sensitive values are masked by default
3. **Connection Testing:** Test connections before saving
4. **Audit Trail:** Settings changes are logged with user ID and timestamp

## API Endpoints

### GET `/api/admin/settings`
- Returns current settings from Firestore
- Merges with environment variables for display

### POST `/api/admin/settings`
- Saves settings to Firestore
- Requires admin authentication

### POST `/api/admin/backup`
- Creates a complete database backup
- Returns JSON file for download

### POST `/api/admin/restore`
- Restores database from backup file
- Requires admin authentication

### POST `/api/admin/test-connection`
- Tests connections to various services
- Types: `database`, `email`, `firebase`, `ai`

## Best Practices

1. **Regular Backups:** Create backups before major changes
2. **Test Connections:** Always test connections after configuration changes
3. **Document Changes:** Use descriptions for custom environment variables
4. **Secure Storage:** Never commit backup files or settings with secrets to git
5. **Environment Variables:** Update actual environment variables in your deployment platform
6. **Maintenance Mode:** Enable during deployments to prevent user issues

## Troubleshooting

### Settings Not Saving
- Check browser console for errors
- Verify admin role is assigned
- Check Firestore permissions

### Backup Fails
- Verify database connection is working
- Check Firestore permissions
- Ensure sufficient storage space

### Connection Tests Fail
- Verify environment variables are set correctly
- Check API keys are valid
- Verify network connectivity
- Check service status pages

### Environment Variables Not Updating
- Environment variables cannot be changed at runtime
- Update them in your deployment platform (Vercel, Railway, etc.)
- Redeploy application after changes

## Data Storage

Settings are stored in Firestore:
- Collection: `adminSettings`
- Document: `main`
- Fields: All settings sections (email, ai, database, firebase, system, envVars)

Backups are stored as JSON files locally (downloaded to admin's computer).

## Future Enhancements

Potential improvements:
- Scheduled automatic backups
- Cloud storage integration (S3, Google Cloud Storage)
- Settings version history
- Rollback functionality
- Email notifications for backup completion
- Environment variable validation
- Bulk operations
- Export/import settings as JSON
- Activity log for all changes




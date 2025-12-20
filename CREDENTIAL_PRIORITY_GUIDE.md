# Credential Priority and Environment Variable Management

## How Credentials Are Picked Up

The application uses credentials in the following priority order:

### 1. **process.env (Highest Priority)**
- Environment variables from your deployment platform (Vercel, Railway, etc.)
- These are the **actual** values used by the application
- Cannot be changed at runtime - must be updated in your deployment platform
- Examples: `DATABASE_URL`, `FIREBASE_PROJECT_ID`, `OPENAI_API_KEY`

### 2. **Firestore Settings (Fallback)**
- Settings saved in the Admin Settings page
- Used for:
  - Non-critical configuration (email from name, AI model selection, etc.)
  - Documentation/reference for environment variables
  - Custom environment variables not in process.env
- **Note:** If a value exists in both `process.env` and Firestore, `process.env` takes precedence

## Environment Variable Sources

### From process.env (Automatic)
The Admin Settings page automatically reads ALL environment variables from `process.env`:
- Shows actual values (masked for secrets)
- Marked with `env` badge
- Read-only (cannot be edited in UI)
- These are the values your application is actually using

### From Vercel API (Optional)
If you configure `VERCEL_TOKEN` and `VERCEL_PROJECT_ID`:
- Click "Sync from Vercel" button
- Fetches environment variables directly from Vercel
- Useful for verifying what's configured in Vercel dashboard
- Merges with existing variables

### Custom Variables (Documentation)
- Variables you add manually in the Admin Settings page
- Marked with `custom` badge
- Used for documentation/reference
- Can be edited/deleted

## AI Models

### Pre-configured Models (Top 10+)
- **Claude Models:** Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **OpenAI Models:** GPT-4 Turbo, GPT-4, GPT-3.5 Turbo, GPT-4o
- **Google Models:** Gemini Pro, Gemini Ultra
- **Meta Models:** Llama 3 70B, Llama 3 8B
- **Mistral Models:** Mixtral 8x7B

### Custom Models
- Select "Custom Model..." from dropdown
- Enter any model name supported by your AI provider
- Model name is saved and used directly
- Examples: `anthropic/claude-3-opus`, `openai/gpt-4-turbo-preview`, etc.

## Configuration Flow

```
Application Startup
    ↓
1. Read process.env (from deployment platform)
    ↓
2. Initialize services with process.env values
    ↓
3. Load Firestore settings (for UI preferences)
    ↓
4. Merge: process.env > Firestore settings
    ↓
Application Running
```

## Examples

### Example 1: Database Connection
```typescript
// Priority 1: process.env.DATABASE_URL (from Vercel)
const dbUrl = process.env.DATABASE_URL; // ✅ Used

// Priority 2: Firestore settings (ignored if process.env exists)
const dbUrlFromSettings = settings.database.url; // ❌ Not used if process.env exists
```

### Example 2: AI Model Selection
```typescript
// Priority 1: process.env (if exists)
const model = process.env.AI_MODEL || settings.ai.defaultModel; // ✅ Uses Firestore if no env var

// Firestore settings are used for:
// - Default model selection (if not in env)
// - Temperature settings
// - Other AI preferences
```

### Example 3: Email Configuration
```typescript
// Priority 1: process.env.RESEND_API_KEY (from Vercel)
const apiKey = process.env.RESEND_API_KEY; // ✅ Used

// Priority 2: Firestore settings (for fromEmail, fromName)
const fromEmail = settings.email.fromEmail; // ✅ Used (not in env)
const fromName = settings.email.fromName; // ✅ Used (not in env)
```

## Updating Credentials

### To Update Environment Variables (process.env)
1. Go to your deployment platform (Vercel, Railway, etc.)
2. Navigate to Project Settings → Environment Variables
3. Add/update variables
4. Redeploy application
5. Variables will appear in Admin Settings page automatically

### To Update Settings (Firestore)
1. Go to Admin Settings page (`/dashboard/settings`)
2. Make changes in respective tabs
3. Click "Save All Settings"
4. Changes are saved to Firestore immediately
5. **Note:** Environment variables in process.env still take priority

## Vercel Integration

### Setup
1. Get Vercel API Token:
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token
   - Add to environment: `VERCEL_TOKEN=your_token_here`

2. Get Project ID:
   - Go to your project in Vercel
   - Copy Project ID from settings
   - Add to environment: `VERCEL_PROJECT_ID=your_project_id`

3. Optional - Team ID:
   - If using a team, add: `VERCEL_TEAM_ID=your_team_id`

### Usage
- Click "Sync from Vercel" button in Environment Variables tab
- Fetches all environment variables from Vercel
- Shows what's actually configured in Vercel
- Useful for verification and documentation

## Best Practices

1. **Always use process.env for secrets:**
   - API keys, passwords, tokens
   - Database connection strings
   - Private keys

2. **Use Firestore settings for preferences:**
   - UI preferences
   - Default model selections
   - Non-sensitive configuration

3. **Document custom variables:**
   - Add descriptions for clarity
   - Mark as secret if sensitive
   - Keep in sync with actual deployment

4. **Regular sync:**
   - Sync from Vercel periodically
   - Verify environment variables match
   - Update documentation as needed

5. **Test after changes:**
   - Use "Test Connection" buttons
   - Verify services work correctly
   - Check logs for errors

## Troubleshooting

### Credentials Not Working
1. Check if variable exists in `process.env`
2. Verify in deployment platform (Vercel dashboard)
3. Check Firestore settings as fallback
4. Test connection using Admin Settings page

### Variables Not Showing
1. Refresh Admin Settings page
2. Click "Sync from Vercel" (if configured)
3. Check browser console for errors
4. Verify admin role is assigned

### Custom Model Not Working
1. Verify model name is correct
2. Check if provider supports the model
3. Verify API key is valid
4. Test connection using "Test AI Connection" button


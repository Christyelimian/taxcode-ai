# Builder.io Setup Script Error Fix

## The Error

```
/tmp/shell-scripts/builder_temp_1766214019059_r0tjru.sh:17: unknown file attribute: H
```

This error occurs when Builder.io tries to run a setup script but encounters formatting issues (likely Windows line endings or script syntax problems).

## Solution: Builder.io Doesn't Need a Setup Script

**Important**: Builder.io works entirely via API - you don't need a setup script!

### What Builder.io Actually Needs

1. **API Key** in environment variable
2. **Component Registration** (already done in your code)
3. **Design System Instructions** (already created)
4. **Setup Command** (already created)

### How to Fix This in Builder.io

1. **Skip the Setup Script Step**
   - In Builder.io's setup wizard, skip or leave blank any "Setup Command" or "Run Script" fields
   - Builder.io doesn't need to run scripts on your server

2. **Use Manual Configuration Instead**
   - Go to Builder.io Dashboard → Settings
   - Configure:
     - **API Key**: Your `NEXT_PUBLIC_BUILDER_API_KEY`
     - **Design System**: Paste from `BUILDER_IO_AI_INSTRUCTIONS.txt`
     - **Setup Command**: Paste from `BUILDER_IO_SETUP_COMMAND.txt`

3. **Verify Components Are Registered**
   - Components are registered in `src/lib/builder-init.ts`
   - This happens automatically when pages load
   - No script execution needed

## Alternative: If Builder.io Requires a Script

If Builder.io's interface requires a setup script, use this minimal one:

```bash
#!/bin/bash
echo "Builder.io setup - components registered via src/lib/builder-init.ts"
echo "No additional setup required"
```

**Important Notes**:
- Save with Unix line endings (LF, not CRLF)
- Make executable: `chmod +x builder-setup.sh`
- Keep it minimal - Builder.io doesn't need to install dependencies or run build commands

## Recommended Approach

**Don't use a setup script at all**. Instead:

1. **In Builder.io Dashboard**:
   - Go to Settings → Project Settings
   - Skip any "Setup Script" or "Install Command" fields
   - Only fill in:
     - API Key
     - Design System Instructions
     - Setup Command (the text instructions, not a script)

2. **In Your Project**:
   - Components are already registered
   - API integration is already set up
   - Everything works via API calls

## Verification

To verify everything works without a script:

1. Check that `NEXT_PUBLIC_BUILDER_API_KEY` is set in `.env.local`
2. Restart your dev server: `npm run dev`
3. Go to `/dashboard/static-pages`
4. Click "Edit in Builder.io" - it should open the editor
5. Components should be available in Builder.io's component picker

## Why This Error Happens

Builder.io might be trying to:
- Run a script with Windows line endings (CRLF) in a Linux environment
- Execute a script that has syntax errors
- Run a script that references files that don't exist

**Solution**: Don't use a setup script - Builder.io works via API only.




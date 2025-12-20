# Builder.io Visual Page Builder Setup Guide

This guide explains how to set up and use Builder.io for editing static pages on the TaxCode site.

## Overview

Builder.io provides a visual page builder that allows admins to edit static pages without touching code. The integration includes:

- **Visual Editor**: Drag-and-drop interface for editing pages
- **Component Registration**: Existing React components can be used in Builder.io
- **Safe Fallback**: Site always works, even if Builder.io content is unavailable
- **Separate Admin Interface**: Editing happens in Builder.io dashboard, not on live site

## Setup Instructions

### 1. Create Builder.io Account

1. Go to [builder.io](https://builder.io)
2. Sign up for a free account
3. Complete the onboarding process

### 2. Get Your API Key

1. Log into Builder.io dashboard
2. Go to **Account Settings** → **API Keys**
3. Copy your **Public API Key**
4. Keep this key secure (you'll need it for the next step)

### 3. Configure Environment Variable

1. Create or edit `.env.local` in the project root
2. Add your API key:

```bash
NEXT_PUBLIC_BUILDER_API_KEY=your-api-key-here
```

3. Restart your development server:

```bash
npm run dev
```

### 4. Configure Builder.io Project Settings

**Important**: Builder.io works via API - you don't need a setup script!

1. In Builder.io Dashboard → Settings → Project Settings:
   - **Skip** any "Setup Script" or "Install Command" fields
   - **Skip** any "Run Command" fields
   - Builder.io doesn't need to execute scripts on your server

2. Configure these fields instead:
   - **API Key**: Your `NEXT_PUBLIC_BUILDER_API_KEY` (already set in .env.local)
   - **Design System Instructions**: Copy from `BUILDER_IO_AI_INSTRUCTIONS.txt`
   - **Setup Command**: Copy from `BUILDER_IO_SETUP_COMMAND.txt` (this is text instructions, not a script)

3. Save settings

### 5. Verify Setup

1. Log into the admin dashboard
2. Navigate to **Dashboard** → **Static Pages**
3. You should see a list of editable pages
4. Click "Edit in Builder.io" on any page to open the visual editor

### Troubleshooting: Setup Script Error

If you see an error like:
```
unknown file attribute: H
```

**Solution**: Skip the setup script step entirely. Builder.io works via API and doesn't need to run scripts on your server. Components are already registered in your code (`src/lib/builder-init.ts`).

## Using Builder.io

### Creating Your First Page

When you first click "Edit in Builder.io", you'll see "Content entry not found" - this is normal!

1. Go to **Dashboard** → **Static Pages**
2. Click **"Edit in Builder.io"** on the page you want to edit
3. Builder.io editor opens in a new tab
4. **If you see "Content entry not found":**
   - Click **"Create New"** or **"New Entry"** button
   - Set the **URL** field to match the page route (e.g., `/start-here`)
   - Click **"Create"**
5. Use the visual editor to:
   - Drag and drop components from the left sidebar
   - Edit text inline
   - Change layouts and styling
   - Add new sections
6. Click **"Publish"** when ready

### Editing an Existing Page

1. Go to **Dashboard** → **Static Pages**
2. Click **"Edit in Builder.io"** on the page you want to edit
3. Builder.io editor opens with existing content
4. Make your changes
5. Click **"Publish"** when ready

### Available Components

The following components are registered and available in Builder.io:

- **HeroSection**: Hero banner with badge, heading, description, and buttons
- **PathwayGrid**: Grid of pathway cards with titles, descriptions, and links
- **PathwayCard**: Individual pathway card
- **RichTextSection**: Rich text content section

### Publishing Changes

1. Make your edits in Builder.io
2. Click **"Preview"** to see how it looks
3. Click **"Publish"** when ready
4. Changes will appear on the live site immediately

## How It Works

### Data Flow

1. Admin edits pages in Builder.io dashboard (separate interface)
2. Content stored in Builder.io cloud
3. Next.js pages fetch content via Builder.io API
4. Public site renders using `BuilderComponent`
5. Falls back to existing hardcoded content if Builder.io content unavailable

### Fallback Strategy

The site is designed to always work:

- If Builder.io API key is not configured → Uses default content
- If Builder.io content doesn't exist → Uses default content
- If Builder.io API fails → Uses default content

This ensures the site never breaks, even if Builder.io is unavailable.

## Component Registration

Components are registered in `src/lib/builder-components.ts`. To add a new component:

1. Create the component in `src/components/builder/`
2. Register it in `src/lib/builder-components.ts`
3. Define the component schema (inputs, types, defaults)
4. Restart the dev server

Example:

```typescript
Builder.registerComponent(MyComponent, {
  name: 'MyComponent',
  inputs: [
    { name: 'title', type: 'string', required: true },
    { name: 'content', type: 'richText' },
  ],
});
```

## Troubleshooting

### "Builder.io API Key Not Configured" Warning

- Check that `.env.local` exists and contains `NEXT_PUBLIC_BUILDER_API_KEY`
- Restart your development server after adding the key
- Verify the key is correct in Builder.io dashboard

### Changes Not Appearing

- Make sure you clicked "Publish" in Builder.io (not just "Save Draft")
- Check that the page URL matches the route in Builder.io
- Clear browser cache and refresh

### Components Not Showing in Editor

- Verify components are registered in `src/lib/builder-components.ts`
- Check that `src/lib/builder-components.ts` is imported in pages
- Restart the dev server after registering new components

## Migration from Hardcoded Content

To migrate existing hardcoded content to Builder.io:

1. Run the migration script:
   ```bash
   tsx scripts/migrate-to-builder.ts
   ```

2. Review the migration report
3. Manually recreate pages in Builder.io using the content structure
4. Test each page to ensure it renders correctly

## Support

- Builder.io Documentation: https://www.builder.io/c/docs
- Builder.io Support: support@builder.io
- TaxCode Admin Dashboard: `/dashboard/static-pages`

## Security Notes

- Builder.io API key is public (safe to expose in client-side code)
- Admin access is protected by Firebase authentication
- Only users with `admin` role can access the static pages admin dashboard
- Builder.io content is publicly readable (like your website), but editing requires Builder.io account access


# Builder.io Install Command Configuration

## The Problem

Builder.io is trying to run `npm run dev` but getting:
```
sh: 1: next: not found
exited with code 127
```

This means dependencies aren't installed in Builder.io's environment.

## Solution: Add Install Command

In Builder.io's project settings, you need to specify an **Install Command** that runs before the Dev Command.

### Install Command (Required)

In Builder.io's "Install Command" or "Dependencies Install" field, use:

```
npm install
```

### Complete Builder.io Configuration

1. **Install Command**: `npm install`
   - This installs all dependencies including Next.js

2. **Dev Command**: `npm run dev`
   - This starts the development server

3. **Port**: `9002`
   - Your dev server port

4. **API Key**: Your `NEXT_PUBLIC_BUILDER_API_KEY`

5. **Design System Instructions**: Copy from `BUILDER_IO_AI_INSTRUCTIONS.txt`

6. **Setup Command**: Copy from `BUILDER_IO_SETUP_COMMAND.txt`

## Alternative: Combined Command

If Builder.io only allows one command, you might need:

```
npm install && npm run dev
```

But ideally, Builder.io should have separate fields for:
- Install Command: `npm install`
- Dev Command: `npm run dev`

## Post-Install Script

Your `package.json` has a `postinstall` script that runs `prisma generate`. This will run automatically after `npm install`, so Builder.io should handle it correctly.

## Verification

After configuring:
1. Builder.io should run `npm install` first
2. Then run `npm run dev`
3. The dev server should start on port 9002
4. Builder.io can then preview your site

## Troubleshooting

If Builder.io still can't find `next`:
- Make sure "Install Command" is set to `npm install`
- Check that Builder.io runs the install command before the dev command
- Verify your `package.json` has Next.js in dependencies (it does: `"next": "15.3.8"`)




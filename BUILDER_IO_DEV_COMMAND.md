# Builder.io Dev Command Configuration

## Dev Command for Builder.io

In Builder.io's project settings, when asked for "Dev Command", use:

```
npm run dev
```

## Full Configuration Summary

When setting up Builder.io project, use these values:

### Dev Command
```
npm run dev
```

### Port (if asked)
```
9002
```
(Your dev server runs on port 9002 based on your package.json)

### Build Command (if asked)
```
npm run build
```

### Start Command (if asked)
```
npm start
```

## Complete Setup Checklist

1. **Dev Command**: `npm run dev`
2. **Port**: `9002` (optional, Builder.io should detect it)
3. **API Key**: Your `NEXT_PUBLIC_BUILDER_API_KEY` from `.env.local`
4. **Design System Instructions**: Copy from `BUILDER_IO_AI_INSTRUCTIONS.txt`
5. **Setup Command**: Copy from `BUILDER_IO_SETUP_COMMAND.txt`
6. **Setup Script**: Leave blank or skip (not needed)

## Notes

- Builder.io uses the dev command to start a preview server for testing changes
- Your dev server runs on port 9002 (configured in package.json: `next dev --turbopack -p 9002`)
- Builder.io should automatically detect the port, but you can specify `9002` if needed
- Make sure your `.env.local` file has `NEXT_PUBLIC_BUILDER_API_KEY` set before Builder.io tries to start the dev server


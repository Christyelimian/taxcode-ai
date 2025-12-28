# Builder.io AI Design System Configuration

This guide helps you configure Builder.io's AI assistant to understand and use your design system correctly.

## Design System Overview

### Component Library Location
- **Path**: `src/components/`
- **UI Components**: `src/components/ui/` (shadcn/ui components)
- **Builder Components**: `src/components/builder/` (components registered with Builder.io)
- **Custom Components**: `src/components/` (site-specific components)

### Available Builder.io Components

#### 1. HeroSection
- **Location**: `src/components/builder/HeroSection.tsx`
- **Usage**: Hero banners with badge, heading, description, and buttons
- **Props**:
  - `badge` (string): Badge text displayed above heading
  - `heading` (string, required): Main heading text
  - `description` (richText): Description paragraph
  - `buttons` (list): Array of button objects with `label`, `href`, and `variant`
  - `className` (string): Additional CSS classes

#### 2. PathwayGrid
- **Location**: `src/components/builder/PathwayGrid.tsx`
- **Usage**: Grid layout for pathway cards
- **Props**:
  - `pathways` (list): Array of pathway objects with `title`, `description`, and `links`
  - `columns` (number): Number of columns (2, 3, or 4)
  - `className` (string): Additional CSS classes

#### 3. PathwayCard
- **Location**: `src/components/builder/PathwayCard.tsx`
- **Usage**: Individual pathway card component
- **Props**:
  - `title` (string, required): Card title
  - `description` (richText): Card description
  - `links` (list): Array of link objects with `label` and `href`

#### 4. RichTextSection
- **Location**: `src/components/builder/RichTextSection.tsx`
- **Usage**: Rich text content sections
- **Props**:
  - `title` (string): Section heading
  - `content` (richText, required): HTML content
  - `className` (string): Additional CSS classes

### Design System Guidelines

#### Color System
- **Primary**: Used for main brand color (buttons, links, accents)
- **Muted**: Used for secondary text and backgrounds
- **Background**: Main page background
- **Foreground**: Main text color
- Use Tailwind CSS color utilities: `text-primary`, `bg-primary/5`, `text-muted-foreground`

#### Typography
- **Headline Font**: Used for headings (font-headline)
- **Body Font**: Default system font stack
- **Sizes**:
  - Hero headings: `text-4xl md:text-5xl` or `text-5xl md:text-6xl`
  - Section headings: `text-3xl md:text-4xl`
  - Card titles: `text-xl`
  - Body text: `text-lg` or default

#### Spacing
- Use Tailwind spacing scale
- Container padding: `px-4 py-16` or `px-4 py-8`
- Section spacing: `mb-8`, `mb-16`, `mt-8`
- Card spacing: `gap-6`, `space-y-4`

#### Layout Patterns
- **Container**: `container mx-auto px-4`
- **Grid**: `grid gap-6 md:grid-cols-2` or `lg:grid-cols-3`
- **Flex**: `flex flex-wrap gap-3`
- **Full-width sections**: Remove container, use `w-full`

#### Component Patterns

**Card Pattern**:
```tsx
<Card className="h-full">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Button Pattern**:
```tsx
<Button asChild variant="default|outline|ghost">
  <Link href="/path">Label</Link>
</Button>
```

**Badge Pattern**:
```tsx
<Badge variant="secondary">Badge Text</Badge>
```

### File Structure
```
src/
├── components/
│   ├── builder/          # Builder.io registered components
│   │   ├── HeroSection.tsx
│   │   ├── PathwayGrid.tsx
│   │   ├── PathwayCard.tsx
│   │   └── RichTextSection.tsx
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   └── ...
├── lib/
│   ├── builder.ts        # Builder.io client
│   ├── builder-init.ts   # Component registration
│   └── builder-server.ts # Server-side fetching
└── app/
    └── start-here/       # Example page implementation
```

## Instructions for Builder.io AI

Copy and paste this into Builder.io's "Setup New Project" → "How should the AI use your design system?":

---

### Design System Instructions

**Component Library**: All components are located in `src/components/builder/` and registered with Builder.io. Use these registered components instead of creating new ones.

**Available Components**:
1. **HeroSection** - Use for hero banners. Includes badge, heading, description, and action buttons.
2. **PathwayGrid** - Use for displaying pathway cards in a grid layout (2-4 columns).
3. **PathwayCard** - Use for individual pathway/feature cards with title, description, and links.
4. **RichTextSection** - Use for long-form text content with optional title.

**Design Patterns**:
- Use Tailwind CSS utility classes for styling
- Primary color: `text-primary`, `bg-primary/5` for backgrounds
- Muted text: `text-muted-foreground`
- Container: `container mx-auto px-4`
- Spacing: Use Tailwind scale (`py-16`, `gap-6`, `mb-8`)
- Typography: `font-headline` for headings, default for body

**Layout Guidelines**:
- Hero sections: Full-width with `bg-primary/5` background
- Content sections: Contained with `container mx-auto px-4`
- Cards: Use `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` components
- Buttons: Always wrap in `Button` component with `asChild` prop and `Link` inside
- Grids: Use `grid gap-6 md:grid-cols-2 lg:grid-cols-3` pattern

**Color Usage**:
- Primary actions: `bg-primary text-primary-foreground`
- Secondary actions: `variant="outline"`
- Backgrounds: `bg-background` or `bg-primary/5` for hero sections
- Text: `text-foreground` for primary, `text-muted-foreground` for secondary

**Spacing System**:
- Section padding: `py-16` for large sections, `py-8` for smaller
- Container padding: `px-4`
- Element gaps: `gap-6` for grids, `gap-3` for flex items
- Margins: `mb-8` or `mb-16` between sections

**Typography Scale**:
- Hero: `text-4xl md:text-5xl font-headline font-bold`
- Section headings: `text-3xl md:text-4xl font-headline font-bold`
- Card titles: `text-xl`
- Body: `text-lg` or default size

**Component Registration**: All components are pre-registered. Do not create new components - use the existing registered ones.

**Best Practices**:
- Always use registered Builder.io components
- Follow the established spacing and typography patterns
- Use semantic HTML with proper heading hierarchy
- Ensure responsive design with `md:` and `lg:` breakpoints
- Keep content accessible and semantic

---

## Additional Configuration Tips

### In Builder.io Dashboard

1. **Go to Settings** → **Design System**
2. **Paste the instructions above** into the AI configuration
3. **Add Component Examples**:
   - Upload screenshots of your components
   - Link to your component documentation
   - Reference your design tokens

### Component Examples to Provide

You can also add specific examples:

```
Example HeroSection Usage:
- Badge: "Start Here"
- Heading: "Know your rights and obligations"
- Description: "Tax Code explains how tax law works..."
- Buttons: [{label: "Explore", href: "/focus-areas"}, {label: "Learn More", href: "/insights", variant: "outline"}]

Example PathwayGrid Usage:
- Columns: 2
- Pathways: Array of objects with title, description, and links array
- Each pathway has 3-4 links with labels and hrefs
```

### Design Tokens

If you have specific design tokens, add them:

```
Design Tokens:
- Primary Color: Used for brand elements
- Spacing Scale: 4px base (gap-1 = 4px, gap-2 = 8px, etc.)
- Border Radius: Default rounded corners
- Shadows: Subtle shadows for cards and elevated elements
```

## Testing the Configuration

After configuring:

1. Ask Builder.io AI: "Create a hero section for the start page"
2. Verify it uses `HeroSection` component
3. Check that styling matches your design system
4. Adjust instructions if needed

## Updating Instructions

As you add more components or change patterns:

1. Update this document
2. Update Builder.io AI instructions
3. Test with a new page creation
4. Iterate based on results



